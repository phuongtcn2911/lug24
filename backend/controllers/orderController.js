import axios from "axios";
import { generateOrderCode } from "../utils/generator.js";
import { sendReceiptEmail } from "../utils/mailer.js";

const apiURL = process.env.SMARTLOCKER_API;
const apiSelfURL = process.env.SMARTLOCKER_SELF_API;
const apiKey = process.env.SMARTLOCKER_TOKEN;
const deviceNo = process.env.DEVICE_NO;

export async function generateOrderCodeHandler(req, res) {
  const orderCode = generateOrderCode();
  res.json({ orderCode });
}

export async function bookABox(req, res) {
  try {
    const obj = req.body?.obj || req.query?.obj;
    if (!obj) return res.status(400).json({ error: "Thiếu tham số đơn hàng" });

    const data = {
      oType: "1007",
      apiKey,
      param: {
        userId: "",
        deviceNo,
        boxNo: obj.boxNo,
        trackNo: obj.trackNo,
        mobile: obj.mobile,
        email: obj.email,
        dropoffCode: "",
        pinCode: "",
      },
    };

    const response = await axios.post(apiURL, data, {
      headers: { "Content-Type": "application/json" },
    });

    res.json(response.data);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ err: "Không thể kết nối tới máy chủ AITUO" });
  }
}

export async function cancelABox(req, res) {
  try {
    const orderCode = req.body?.orderCode;
    if (!orderCode)
      return res.status(400).json({ code: -1, message: "Thiếu orderCode" });

    const data = {
      oType: "1008",
      apiKey,
      param: { orderCode },
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
}

export async function confirmPayment(req, res) {
  try {
    const bill = req.body?.bill;
    if (!bill)
      return res.status(400).json({ code: -1, message: "Thiếu tham số obj" });

    const data = {
      oType: "1015",
      apiKey,
      param: {
        orderCode: bill.orderCode,
        setPayment: bill.setPayment,
        money: bill.money,
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
}

export async function savePayment(req, res) {
  try {
    const obj = req.body?.obj;
    console.log(obj);

    if (!obj)
      return res.status(400).json({ code: -1, message: "Thiếu tham số obj" });

    const data = {
      oType: "1001",
      apiKey,
      param: {
        orderCode: obj.orderCode,
        type: obj.type,
        money: obj.money,
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
}

export async function dropOffPackage(req, res) {
  try {
    const obj = req.body?.obj;
    if (!obj)
      return res.status(400).json({ error: "Thiếu tham số đơn hàng" });

    const data = {
      oType: "1001",
      tid: obj.orderCode,
      userId: "",
      deviceNo,
      boxNo: obj.boxNo,
      orderCode: obj.orderCode,
      trackNo: "",
      pinCode: "",
      mobile: "",
      email: "",
      address: "",
    };

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
}

export async function sendReceipt(req, res) {
  try {
    const obj = req.body?.obj;
    console.log("Server nhận OBJ Hóa đơn: ", obj);

    if (!obj)
      return res
        .status(400)
        .json({
          error:
            "Từ phía Server(Controller) nhận OBJ: Thiếu tham số đơn hàng",
        });

    if (obj.contactType === "email") {
      await sendReceiptEmail(obj.order);
      res.json({
        code: 0,
        message:
          "Từ phía Server(Controller->Mailer) phản hồi: Đã gửi receipt về email",
      });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({
      error:
        "Từ phía Server(Controller->Mailer) phản hồi: Không thể gửi hóa đơn về mail",
    });
  }
}
