import { BigQueryDate, BigQueryDatetime, BigQueryTime, BigQueryTimestamp } from "@google-cloud/bigquery";
import { getBigQueryConfig } from "../config.js";


const bq = getBigQueryConfig();
const dataset = "LUG";

export async function insertOrder(order) {
      console.log("Backend nhận thông tin Order:", order);
    const table = "ORDER";
    const query = ` DECLARE vUUID STRING;
                    
                    SET vUUID=GENERATE_UUID();

                    INSERT INTO \`${dataset}.${table}\` 
                    (UUID, ORDER_ID, MODIFIED_DATE, 
                    CHECK_IN, CHECK_OUT, 
                    RENTAL_TIME, PRICE_ID, 
                    SENDER_ID, RECEIVER_ID, 
                    NOTE,DEF_ORD_STATUS_ID,
                    SUBTOTAL,DISCOUNT,TAX,TOTAL)
                    VALUES 
                    (vUUID,@orderID,TIMESTAMP(@modifiedDate),
                    TIMESTAMP(@checkIn),TIMESTAMP(@checkOut),
                    @rentalTime,@priceID,
                    @senderID,@receiverID,
                    @note,@defOrdStatusID,
                    @subTotal,@discount,@tax,@total);


                    SELECT vUUID as UUID;
                    `;

    const options = {
        query,
        params: {
            orderID: order.order.id,
            modifiedDate: new Date(),
            checkIn: order.order.checkIn,
            checkOut: order.order.finalCheckOut,
            rentalTime: order.order.maxRentalTime,
            priceID: order.order.priceListID,
            senderID: order.customer.id,
            receiverID: order.receiver.id,
            note: order.transaction.description,
            subTotal: order.order.subTotal,
            discount: order.order.discountPrice,
            tax: order.order.tax,
            total: order.order.total,
            defOrdStatusID: -1
        }
    };

    const [rows] = await bq.query(options);
    return rows?.[0]?.UUID;
}

export async function updateOrderStatus(obj) {
    const table = "ORDER";
    const query = ` UPDATE \`${dataset}.${table}\`
                    SET DEF_ORD_STATUS_ID=@ordStatusID
                    WHERE UUID=@uuid`;
    const options = {
        query,
        params: {
            ordStatusID:obj.ordStatusID,
            uuid:obj.uuid
        }
    };
    const res=await bq.query(options);
    console.log(res.data);
    return res.data;
}

export async function checkExistCustomer(customer) {
    const table = "CUSTOMER";
    const query = `SELECT CUSTOMER_ID FROM \`${dataset}.${table}\` WHERE MOBILE=@mobile OR EMAIL=@email`;
    const options = {
        query,
        params: {
            mobile: customer.mobile,
            email: customer.email,
        }
    };

    const [rows] = await bq.query(options);
    return rows;
}

// export async function insertCustomer(customer) {
//     const table = "CUSTOMER";
//     const query = `INSERT INTO \`${dataset}.${table}\`
//     (CUSTOMER_ID, FULLNAME, MOBILE, EMAIL, IDENTITY_CARD, IMAGE_URL) 
//     VALUES(@customerID, @fullname, @mobile, @email, @identityCard, @imgURL)`;
//     const options = {
//         query,
//         params: {
//             customerID: customer.id,
//             fullname: customer.fullName,
//             mobile: customer.mobile,
//             email: customer.email,
//             identityCard: customer.identityCard,
//             imgURL: customer.imageURL
//         }
//     };

//     await bq.query(options);
//     return true;

// }

export async function insertCustomer(customer) {
    // console.log("Backend nhận thông tin customer:", customer);
    //Thực hiện công việc kiểm tra tồn tại trước
    //Nếu chưa có thì Insert - sau đó trả về mã khách hàng
    //Nếu đã có chỉ trả về mã khách hàng

    const table = "CUSTOMER";
    const script = `
    DECLARE inpFULLNAME STRING DEFAULT @fullname;
    DECLARE inpMOBILE STRING DEFAULT @mobile;
    DECLARE inpEMAIL STRING DEFAULT @email;
    DECLARE inpIDENTITY_CARD STRING DEFAULT @identityCard;
    DECLARE inpAUTH_MODE STRING DEFAULT @authMethod;

    DECLARE vID STRING;

    SET vID=(
    SELECT CUSTOMER_ID
    FROM \`${dataset}.${table}\` AS C
    WHERE C.IDENTITY_CARD IS NOT NULL AND C.IDENTITY_CARD=inpIDENTITY_CARD
    LIMIT 1);

    IF vID is NULL THEN
        IF inpAUTH_MODE="Email" THEN
            SET vID=(
                SELECT CUSTOMER_ID
                FROM \`${dataset}.${table}\` AS C
                WHERE C.EMAIL=inpEMAIL
                LIMIT 1
            );
        ELSEIF inpAUTH_MODE="Zalo" THEN
            SET vID=(
                    SELECT CUSTOMER_ID
                    FROM \`${dataset}.${table}\` AS C
                    WHERE C.MOBILE=inpMOBILE
                    LIMIT 1
                );
        END IF;
    END IF;

    IF vID is NULL THEN
        SET vID = GENERATE_UUID();
        INSERT INTO \`${dataset}.${table}\`
        (CUSTOMER_ID, FULLNAME, MOBILE,EMAIL,IDENTITY_CARD)
        VALUES 
        (vID, inpFULLNAME, inpMOBILE,inpEMAIL,inpIDENTITY_CARD);
    END IF;

    SELECT vID AS CUSTOMER_ID;
    `;
    const options = {
        query: script,
        params: {
            fullname: customer.fullName,
            mobile: customer.mobile,
            email: customer.email,
            identityCard: customer.identityCard,
            authMethod: customer.authMethod
        }
    };
    const [result] = await bq.query(options);
    return result;
}

export async function createTransactLog(transact) {
    console.log("TRANSACT bên trong Bigquery: ",transact);
    const table = "TRANSACT_LOG";
    const query = ` INSERT INTO \`${dataset}.${table}\`
                    (TIMESTAMP,UUID,ACTION_ID,ROLE_ID,ACTOR_ID,IMAGE_URL)
                    VALUES
                    (@timestamp,@uuid,@actionID,@actorType,@actorID,@imgURL)`;
    const options = {
        query,
        params: {
            timestamp: new Date(),
            uuid: transact.uuid,
            actionID: transact.actionID,
            actorType: transact.actorType,
            actorID: transact.actorID,
            imgURL: transact.imageURL
        }
    };
    await bq.query(options);
    return true;
}

export async function getPriceList(deviceNo) {
    try {
        const query = `SELECT DISTINCT PRC.PRICE_LIST_ID, LCK.SIZE,PRC.UNIT_PRICE,PRC.TAX_RATE FROM \`LUG.LOCKER\` as LCK, \`LUG.PRICE_LIST\` as PRC, \`LUG.LOCKER_PRICE\` as LKP, \`LUG.CAMPUS\` as CMP WHERE LCK.LOCKER_ID=LKP.LOCKER_ID AND PRC.PRICE_LIST_ID=LKP.PRICE_ID AND CMP.CAMPUS_ID=LCK.CAMPUS_ID AND CMP.DEVICE_NO=@deviceNo`;

        const options = {
            query,
            params: {
                deviceNo: deviceNo
            }
        }

        const [results] = await bq.query(options);
        const castingResult = results.map(row => castingBigQueryData(row));
        // console.log(castingResult);
        return castingResult;
    } catch (err) {
        console.log("Sai gì đó: ", err);
    }
}

export async function getCampus(deviceNo) {
    const table = "CAMPUS";
    const query = `SELECT * FROM \`${dataset}.${table}\` WHERE DEVICE_NO=@deviceNo`;
    const option = {
        query,
        params: {
            deviceNo: deviceNo
        }
    }

    const [results] = await bq.query(option);
    const castingResult = results.map(row => castingBigQueryData(row));
    // console.log(castingResult);
    return castingResult;
}

export async function getLockersAmount(deviceNo) {
    const query = `SELECT LCK.SIZE, COUNT(LCK.SIZE) AS AMOUNT
    FROM \`LUG.LOCKER\` as LCK, \`LUG.CAMPUS\` as CMP
    WHERE  LCK.CAMPUS_ID=CMP.CAMPUS_ID AND CMP.DEVICE_NO=@deviceNo
    GROUP BY LCK.SIZE`;

    const option = {
        query,
        params: {
            deviceNo: deviceNo
        }
    }

    const [rows] = await bq.query(option);
    return rows;
}

export async function getAvailableLocker(deviceNo, sizeLetter) {

    const query = `SELECT LCK.LOCKER_ID,LCK.LOCKER_NO,LCK.SIZE
    FROM \`${dataset}.LOCKER\` as LCK, \`${dataset}.CAMPUS\` as CMP 
    WHERE LCK.CAMPUS_ID=CMP.CAMPUS_ID AND CMP.DEVICE_NO=@deviceNo AND LCK.SIZE=@sizeLetter 
    AND LCK.DEF_LCK_STATUS_ID=0 LIMIT 1`;

    const option = {
        query,
        params: {
            deviceNo: deviceNo,
            sizeLetter: sizeLetter
        }
    }

    const [rows] = await bq.query(option);
    return rows;
}

export async function getPublicVoucher() {
    const table = ["PROMOTION_CAMPAIGN", "VOUCHER"];
    const query = `   SELECT VOUC.VOUCHER_ID,CAMP.CAMPAIGN_TITLE,CAMP.DISCOUNT_VALUE,CAMP.EXPIRED_DATE,CAMP.CAMPAIGN_DESCRIPTION,CAMP.IS_PARALLEL,VOUC.VALID_STATUS,CAMP.IS_PUBLIC
                    FROM \`${dataset}.${table[0]}\` as CAMP,  \`${dataset}.${table[1]}\` as VOUC
                    WHERE CAMP.CAMPAIGN_ID=VOUC.CAMPAIGN_ID AND CAMP.IS_PUBLIC=1 AND VOUC.VALID_STATUS=0 
                    AND CAMP.APPLIED_DATE<=CURRENT_TIMESTAMP() AND (CAMP.EXPIRED_DATE IS NULL OR CAMP.EXPIRED_DATE>CURRENT_TIMESTAMP())`;
    const [rows] = await bq.query(query);
    return rows;
}

export async function getPrivateVoucher(voucherCode) {
    const table = ["PROMOTION_CAMPAIGN", "VOUCHER"];
    const query = `  SELECT VOUC.VOUCHER_ID,CAMP.CAMPAIGN_TITLE,CAMP.DISCOUNT_VALUE,CAMP.EXPIRED_DATE,CAMP.CAMPAIGN_DESCRIPTION,CAMP.IS_PARALLEL,VOUC.VALID_STATUS,CAMP.IS_PUBLIC
                    FROM \`${dataset}.${table[0]}\` as CAMP,  \`${dataset}.${table[1]}\` as VOUC
                    WHERE CAMP.CAMPAIGN_ID=VOUC.CAMPAIGN_ID AND CAMP.IS_PUBLIC=0 AND VOUC.VALID_STATUS=0 
                    AND VOUC.VOUCHER_ID=@voucherCode`;
    const option = {
        query,
        params: {
            voucherCode: voucherCode
        }
    }
    const [results] = await bq.query(option);
    const castingResult = results.map(row => castingBigQueryData(row));
    return castingResult;

}

function castingBigQueryData(data) {
    const afterCasting = {};

    for (const key of Object.keys(data)) {
        const val = data[key];

        if (val instanceof BigQueryDate) {
            afterCasting[key] = val.value;
        }
        else if (val instanceof BigQueryDatetime) {
            afterCasting[key] = val.value;
        }
        else if (val instanceof BigQueryTime) {
            afterCasting[key] = val.value;
        }
        else if (val?.constructor?.name === "Big") {
            afterCasting[key] = Number(val.toString());
        }
        else if (val instanceof BigQueryTimestamp) {
            afterCasting[key] = val.value;
        }
        else {
            afterCasting[key] = val;
        }
    }
    return afterCasting;
}