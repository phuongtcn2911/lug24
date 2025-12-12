import { BigQueryDate, BigQueryDatetime, BigQueryTime } from "@google-cloud/bigquery";
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
        else {
            afterCasting[key] = val;
        }
    }
    return afterCasting;
}