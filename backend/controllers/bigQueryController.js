import express from "express"
import * as query from "../services/query.js"
import { generateCustomerID } from "../utils/generator.js";

export async function insertOrder(req, res) {
    try {
        const order = req.body?.obj;
        console.log(order);

        await query.insertOrder(order);
        res.json({ message: "Inserted" });

    } catch (err) {
        console.error(err.message);
        res.status(500).json({ err: "Không thể kết nối tới BigQuery" });
    }
}

export async function checkExistCustomer(req, res) {
    try {
        const info = req.body?.obj;
        console.log(info);
        const result = await query.checkExistCustomer(info);
        if (result.length == 0) {
            return res.json({ result: false, message: "Non-exist this customer" });
        }
        else {
            return res.json({ result: true, id: result, message: "Existed customer" });
        }
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ err: "Không thể kết nối tới BigQuery" });
    }

}

export async function insertCustomer(req, res) {
    try {
        const customer = req.body?.obj;
        const results = await query.checkExistCustomer(customer);
        if (results.length === 0) {
            // console.log("Chưa có tài khoản người dùng");
            // console.log("Generate mã khách hàng mới");
            const customerID = generateCustomerID();
            customer.id = customerID;
            // console.log("Dữ liệu khách hàng: ",customer);
            // console.log("Insert thông tin khách hàng");
            await query.insertCustomer(customer);
            // console.log("Trả về mã khách hàng mới");
            return res.json({ customerID: customerID, message: "Insert customer successfully" });
        } else {
            // console.log("Đã có tài khoản người dùng");
            // console.log(results);
            // console.log("Lấy mã khách hàng từ CSDL");
            // console.log("Trả về mã khách hàng");
            return res.json({ customerID: results[0].CUSTOMER_ID, message: "Get customer ID from database" });
        }

    }
    catch (err) {
        console.error(err.message);
        res.status(500).json({ err: "Inserting customer failed: ", err });
    }

}

export async function getPrivateVoucher(req, res) {
    try {
        const code = req?.query.code;
        const result = await query.getPrivateVoucher(code);
        console.log(result);
        return res.json({ code: 1, message: "Truy vấn thành công", result });

    } catch (err) {
        return res.json({ code: 0, message: "Truy vấn thất bại: ", err });
    }
}

export async function getInitialData(req, res) {
    try {
        const priceList = await query.getPriceList(process.env.DEVICE_NO);
        const campus = await query.getCampus(process.env.DEVICE_NO);
        const availableLockers = await query.getLockersAmount(process.env.DEVICE_NO);
        const vouchers = await query.getPublicVoucher();
        return res.json({ code: 1, message: "Lấy dữ liệu khởi tạo thành công", data: { priceList, campus, availableLockers, vouchers } });

    } catch (err) {
        return res.json({ code: 0, message: "Lấy dữ liệu khởi tạo thất bại: ", err });
    }

}

export async function getAvailableLockerAmount(req, res) {
    try {
        const rows = await query.getLockersAmount(process.env.DEVICE_NO);
        return res.json({ code: 1, message: "Lấy dữ liệu thành công", data: { rows } });
    } catch (err) {
        return res.json({ code: 0, message: "Lấy dữ liệu thất bại: ", err });
    }
}

export async function getAvailableLocker(req, res) {
    const size = req?.query.size;
    try {
        const rows = await query.getAvailableLocker(process.env.DEVICE_NO, size);
        return res.json({ code: 1, message: "Lấy dữ liệu thành công", data: { rows } });

    } catch (err) {
        return res.json({ code: 0, message: "Lấy dữ liệu thất bại: ", err });
    }
}

export async function checkExistOrderID(req,res){

}