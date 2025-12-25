import { BigQueryDate, BigQueryDatetime, BigQueryTime, BigQueryTimestamp } from "@google-cloud/bigquery";
import { getBigQueryConfig } from "../config.js";

const bq = getBigQueryConfig();
const dataset = "LUG";

export async function insertOrder(order) {
    const table = "ORDER";
    const query = `INSERT INTO \`${dataset}.${table}\` 
(MODIFIED_DATE, ORDER_ID, CHECK_IN, CHECK_OUT, RENTAL_TIME, PRICE_ID, SENDER_ID, RECEIVER_ID, NOTE)
VALUES (@modifiedDate,@orderID,@checkIn,@checkOut,@rentalTime,@priceID,@senderID,@receiverID,@note)`;
    const options = {
        query,
        params: {
            modifiedDate: new Date().toISOString(),
            orderID: order.order.subID,
            checkIn: order.order.checkIn,
            checkOut: order.order.checkOut,
            rentalTime: order.order.maxRentalTime,
            priceID: "",
            senderID: "",
            receiverID: "",
            note: order.transaction.description
        }
    };

    await bq.query(options);
    return true;
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

export async function insertCustomer(customer) {
    const table = "CUSTOMER";
    const query = `INSERT INTO \`${dataset}.${table}\`
    (CUSTOMER_ID, FULLNAME, MOBILE, EMAIL, IDENTITY_CARD, IMAGE_URL) 
    VALUES(@customerID, @fullname, @mobile, @email, @identityCard, @imgURL)`;
    const options = {
        query,
        params: {
            customerID: customer.id,
            fullname: customer.fullName,
            mobile: customer.mobile,
            email: customer.email,
            identityCard: customer.identityCard,
            imgURL: customer.imageURL
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