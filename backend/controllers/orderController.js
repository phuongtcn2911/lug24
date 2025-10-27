const axios = require("axios");
const { response } = require("express");
const{generateOrderCode}=require("../utils/generator");

const apiURL = process.env.SMARTLOCKER_API;
const apiSelfURL = process.env.SMARTLOCKER_SELF_API;
const apiKey = process.env.SMARTLOCKER_TOKEN;
const deviceNo = process.env.DEVICE_NO;



exports.generateOrderCode = async (req, res) => {
  const orderCode = generateOrderCode();
  res.json({ orderCode: orderCode });
};

exports.bookABox = async (req, res) => {
  try {
    const obj = req.body?.obj || req.query?.obj;

    if (!obj) {
      return res.status(400).json({ error: "Thiếu tham số đơn hàng" });
    }

    const data = {
      oType: "1007",
      apiKey: apiKey,
      param: {
        userId: '',
        deviceNo: deviceNo,
        boxNo: obj.boxNo,
        trackNo: obj.trackNo,
        mobile: obj.mobile,
        email: obj.email,
        dropoffCode: '',
        pinCode: '',
      }
    };

    const response = await axios.post(apiURL, data, {
      headers: { "Content-Type": "application/json" },
    });

    res.json(response.data);

  } catch (err) {
    console.error(err.message);
    res.status(500).json({ err: "Không thể kết nối tới máy chủ AITUO" });
  }
};

exports.cancelABox = async (req, res) => {
  try {

    const orderCode = req.body?.orderCode;


    if (!orderCode) {
      return res.status(400).json({ code: -1, message: "Thiếu orderCode" });
    }

    const data = {
      oType: "1008",
      apiKey: apiKey,
      param: {
        orderCode: orderCode,
      },
    };

    const response = await axios.post(apiURL, data, {
      headers: { "Content-Type": "application/json" },
      timeout: 8000,
    });

    console.log("Kết quả từ server AITUO:", response.data);

    res.json(response.data);

  } catch (err) {
    console.error("Lỗi khi gọi AITUO:", err.message);
    res.status(500).json({
      code: -1,
      message: "Không thể kết nối tới máy chủ AITUO",
      detail: err.message,
    });
  }
};

exports.confirmPayment = async (req, res) => {
  try {
    const bill = req.body?.bill;

    if (!bill) {
      return res.status(400).json({ code: -1, message: "Thiếu tham số obj" });
    }

    const data = {
      oType: "1015",
      apiKey: apiKey,
      param: {
        orderCode: bill.orderCode,
        setPayment: bill.setPayment,
        money: bill.money
      },
    };

    const response = await axios.post(apiURL, data, {
      headers: { "Content-Type": "application/json" },
    });

    res.json(response.data);

  } catch (err) {
    console.error("Lỗi khi gọi AITUO:", err.message);
    res.status(500).json({
      code: -1,
      message: "Không thể kết nối tới máy chủ AITUO",
      detail: err.message,
    });
  }
};

exports.savePayment = async (req, res) => {
  try {
    const obj = req.body?.obj;
    console.log(obj);

    if (!obj) {
      return res.status(400).json({ code: -1, message: "Thiếu tham số obj" });
    }

    const data = {
      oType: "1001",
      apiKey: apiKey,
      param: {
        orderCode: obj.orderCode,
        type: obj.type,
        money: obj.money
      },
    };

    const response = await axios.post(apiURL, data, {
      headers: { "Content-Type": "application/json" },
    });

    res.json(response.data);

  } catch (err) {
    console.error("Lỗi khi gọi AITUO:", err.message);
    res.status(500).json({
      code: -1,
      message: "Không thể kết nối tới máy chủ AITUO",
      detail: err.message,
    });
  }
};

exports.dropOffPackage = async (req, res) => {
  try {
    const obj = req.body?.obj;

    if (!obj) {
      return res.status(400).json({ error: "Thiếu tham số đơn hàng" });
    }

    const data = {
      oType: "1001",
      tid: obj.orderCode,
      userId: "",
      deviceNo: deviceNo,
      boxNo: obj.boxNo,
      orderCode: obj.orderCode,
      trackNo: "",
      pinCode: "",
      mobile: "",
      email: "",
      address: "",
    }

    const response = await axios.post(apiSelfURL, data, {
      headers: { "Content-Type": "application/json" },
    });

    res.json(response.data);


  } catch (err) {
    console.error("Lỗi khi gọi AITUO:", err.message);
    res.status(500).json({
      code: -1,
      message: "Không thể kết nối tới máy chủ AITUO",
      detail: err.message,
    });
  }
};
