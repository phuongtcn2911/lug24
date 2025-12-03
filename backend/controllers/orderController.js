import axios from "axios";
import { generateOrderCode, verifySignature } from "../utils/generator.js";
import { sendReceiptEmail } from "../utils/mailer.js";
import { config } from "dotenv";
import { sendReceiptZalo } from "./zaloController.js";
// import { getSmartLockerConfig } from "../config.js";

config();

const apiURL = process.env.SMARTLOCKER_API;
const apiKey = process.env.SMARTLOCKER_TOKEN;
const deviceNo = process.env.DEVICE_NO;

// export async function generateOrderCodeHandler(req, res) {
//   const orderCode = generateOrderCode();
//   res.json({ orderCode });
// }

export async function bookABox(req, res) {
  try {
    // const { apiURL, apiKey, deviceNo } = getSmartLockerConfig();
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
    // const { apiURL, apiKey, deviceNo } = getSmartLockerConfig();

    const orderCode = req.body?.orderID;
    // console.log("OrderCode đc nhận tại backend",orderCode);
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
    // const { apiURL, apiKey, deviceNo } = getSmartLockerConfig();
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
    // const { apiURL, apiKey, deviceNo } = getSmartLockerConfig();
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
    // const { apiURL, apiKey, deviceNo } = getSmartLockerConfig();
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
    // const { apiURL, apiKey, deviceNo } = getSmartLockerConfig();
    const obj = req.body?.obj;
    console.log("Server nhận OBJ Hóa đơn: ", obj);

    if (!obj)
      return res
        .status(400)
        .json({
          error:
            "Từ phía Server(Controller) nhận OBJ: Thiếu tham số đơn hàng",
        });

    if (obj.contactType === "Email") {
      await sendReceiptEmail(obj.order, obj.lang);
      res.json({
        code: 0,
        message:
          "Từ phía Server(Controller->Mailer) phản hồi: Đã gửi receipt về email",
      });
    }
    else if (obj.contactType === "Zalo") {
      await sendReceiptZalo(obj.order, obj.lang);
      res.json({
        code: 0,
        message: "Từ phía Server(Controller->Zalo API) Phản hồi: Đã gửi receipt về zalo",
      });

    }
  } catch (err) {
    console.error(err);
    res.status(500).json({
      error:
        "Từ phía Server(Controller->Mailer/Zalo API) phản hồi: Không thể gửi hóa đơn về mail/zalo",
    });
  }
}

export async function readQRCode(req, res) {
  try {
    const text = req.body?.obj;
    console.log("Server nhận QR URL: ", text);
    if (!text) {
      return res.status(400)
        .json({
          code: -2,
          message: "Từ phía Server(Controller) nhận OBJ: Thiếu tham số từ QR URL",
        })
    }

    const valid = verifySignature(text);
    if (!valid) {
      return res.status(200)
        .json({
          code: -1,
          message: "QR không hợp lệ",
          data: null
        });
    }

    const params = new URLSearchParams(text);
    let obj = {
      orderID: params.get("orderID"),
      time: params.get("time")
    }
    return res.status(200)
      .json({
        code: 1,
        message: "QR hợp lệ",
        data: obj
      })

  } catch (err) {
    console.error(err);
    res.status(500).json({
      error:
        "Từ phía Server(Controller) phản hồi: Có vấn đề từ QR gửi đến",
    });
  }
}
