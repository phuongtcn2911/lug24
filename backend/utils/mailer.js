// utils/mailer.js
import nodemailer from "nodemailer";
import path from "path";
import { fileURLToPath } from "url";
import { config } from "dotenv";
import hbs from "nodemailer-express-handlebars";
import { generateQRCode } from "../utils/qrcode.js";
import { getTranslator } from "../routes/i18n.js";

config();

// Chuyển __dirname sang cú pháp tương thích ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);



// const nodemailer = require("nodemailer");
// const hbs = require('nodemailer-express-handlebars').default;
// const fs = require('fs').promises;
// const path = require('path');
// const { env } = require("process");
// const { generateQRCode } = require("../utils/qrcode");
// const { buffer } = require("stream/consumers");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_NOREPLY,
    pass: process.env.EMAIL_NOREPLY_PWD,
  },
});

transporter.use(
  'compile',
  hbs({
    viewEngine: {
      extname: '.hbs',
      layoutsDir: path.join(__dirname, '../template'),
      defaultLayout: false,
    },
    viewPath: path.join(__dirname, '../template'),
    extName: '.hbs',
  }));

// async function sendOtpViaMail(receiver, otp) {
//   const mailOptions = {
//     from: `"SmartLocker" <${process.env.EMAIL_USER}>`,
//     to:receiver,
//     subject: "Mã OTP mở tủ SmartLocker",
//     text: `Mã OTP của bạn là: ${otp}. Mã có hiệu lực trong 5 phút.`,
//   };

//   await transporter.sendMail(mailOptions);

// }

export async function sendOTPMail(receiver, otp, lang = "vi") {
  console.log(receiver);
  const otpDigits = otp.toString().split('');
  //dict (dictionary) lấy tất cả mẫu câu theo ngôn ngữ lang nằm trong t
  const dict = getTranslator(lang);

  await transporter.sendMail({
    from: "LUG24 - Smart Locker <noreply@vizi24.com>",
    to: receiver.email,
    subject: dict("otpSubject", { ns: "otpMail" }),
    replyTo: process.env.EMAIL_CS,
    template: "OTP_Mail",
    context: {
      otpDigits,
      fullname: receiver.fullname,
      mailCS: process.env.EMAIL_CS,

      otpHeader: dict("otpHeader", { ns: "otpMail" }),
      otpContent_0: dict("otpContent_0", { ns: "otpMail" }),
      otpContent_1: dict("otpContent_1", { ns: "otpMail" }),
      otpContent_2: dict("otpContent_2", { ns: "otpMail" }),
      otpContent_3: dict("otpContent_3", { ns: "otpMail" }),

      otpSupportNote_0: dict("otpSupportNote_0", { ns: "otpMail" }),
      otpSupportNote_1: dict("otpSupportNote_1", { ns: "otpMail" }),
      otpSupportNote_2: dict("otpSupportNote_2", { ns: "otpMail" }),
      otpSupportNote_3: dict("otpSupportNote_3", { ns: "otpMail" }),
      otpSupportNote_4: dict("otpSupportNote_4", { ns: "otpMail" }),
      otpSupportNote_5: dict("otpSupportNote_5", { ns: "otpMail" }),

      otpFooter_0: dict("otpFooter_0", { ns: "otpMail" }),
      otpFooter_1: dict("otpFooter_1", { ns: "otpMail" }),

      mailSignature_0: dict("mailSignature_0"),
      mailSignature_1: dict("mailSignature_1"),
      mailSignature_2: dict("mailSignature_2"),
    },
  });
  console.log("Từ công cụ soạn mail phản hồi: Đã soạn và phát lệnh gửi mail OTP");
}



export async function sendReceiptEmail(obj, lang = "vi") {
  console.log("Nhận hóa đơn", obj);
  const dict = getTranslator(lang);

  //Tạo mã QR và set lệnh gửi mail
  var data = {
    customer: {
      phone: obj.customer.mobile,
      email: obj.customer.email,
      fullname: obj.customer.fullName,
    },
    locker: {
      box: {
        boxNo: obj.locker.id,
        boxSize: obj.locker.sizeLetter,
      },
      lockerID: process.env.DEVICE_NO,
      locationName: "DOUP Healthy Food",
      locationAddress: "54/1 Lê Quang Định, phường Bình Thạnh, TP.HCM, Việt Nam",
      locationPhone: "+84 111 1111",
      locationWorkingTime: {
        open: "10:00",
        closed: "22:00"
      }
    },
    order: {
      orderID: obj.order.subID,
      checkIn: {
        date: new Date(obj.order.checkIn).toLocaleDateString('vi-VN', {
          day: '2-digit',
          month: 'short',
          year: 'numeric'
        }).replace(',', ''),
        time: new Date(obj.order.checkIn).toLocaleTimeString('en-US', {
          hour: '2-digit',
          minute: '2-digit',
          hour12: true
        })
      },
      checkOut: {
        date: new Date(obj.order.checkOut).toLocaleDateString('vi-VN', {
          day: '2-digit',
          month: 'short',
          year: 'numeric'
        }).replace(',', ''),
        time: new Date(obj.order.checkOut).toLocaleTimeString('en-US', {
          hour: '2-digit',
          minute: '2-digit',
          hour12: true
        })
      },
      maxDuration: obj.order.maxRentalTime,
    }
  }

  var qrLink = await generateQRCode(data);
  const base64Data = qrLink.replace(/^data:image\/png;base64,/, "");
  const buffer = Buffer.from(base64Data, "base64");


  await transporter.sendMail({
    from: "LUG24 - Smart Locker <noreply@vizi24.com>",
    to: data.customer.email,
    subject: `${dict("subject", { ns: "receiptMail" })} <${obj.order.subID}>`,
    template: "Receipt_Mail",
    context: {
      customer: data.customer,
      locker: data.locker,
      order: data.order,
      qrCodeLink: "qr-code-embedded",
      mailCS: process.env.EMAIL_CS,

      header: dict("header", { ns: "receiptMail" }),
      warning: dict("warning", { ns: "receiptMail" }),
      title: dict("title", { ns: "receiptMail" }),
      greeting_0: dict("greeting_0", { ns: "receiptMail" }),
      greeting_1: dict("greeting_1", { ns: "receiptMail" }),
      greeting_2: dict("greeting_2", { ns: "receiptMail" }),
      parcelInfo: dict("parcelInfo", { ns: "receiptMail" }),
      orderID: dict("orderID", { ns: "receiptMail" }),
      paymentByLug: dict("paymentByLug", { ns: "receiptMail" }),
      customerName: dict("customerName", { ns: "receiptMail" }),
      dropOff: dict("dropOff", { ns: "receiptMail" }),
      from: dict("from", { ns: "receiptMail" }),
      pickUp: dict("pickUp", { ns: "receiptMail" }),
      to: dict("to", { ns: "receiptMail" }),
      lockerSize: dict("lockerSize", { ns: "receiptMail" }),
      lockerNo: dict("lockerNo", { ns: "receiptMail" }),
      maxStorageTime: dict("maxStorageTime", { ns: "receiptMail" }),
      hour: dict("hour", { ns: "receiptMail" }),
      campusInfo: dict("campusInfo", { ns: "receiptMail" }),
      campusID: dict("campusID", { ns: "receiptMail" }),
      phone: dict("phone", { ns: "receiptMail" }),
      locationWorkingTime: dict("locationWorkingTime", { ns: "receiptMail" }),
      contactUs: dict("contactUs", { ns: "receiptMail" }),
      helpCenter: dict("helpCenter", { ns: "receiptMail" }),
      supportNote_0: dict("supportNote_0", { ns: "receiptMail" }),
      supportNote_1: dict("supportNote_1", { ns: "receiptMail" }),
      supportNote_2: dict("supportNote_2", { ns: "receiptMail" }),
      mailSignature_0: dict("mailSignature_0"),
      mailSignature_1: dict("mailSignature_1"),
      mailSignature_2: dict("mailSignature_2"),
    },
    attachments: [
      {
        filename: "orderQR.png",
        content: buffer,
        cid: "qr-code-embedded"
      }
    ]
  });
  console.log("Từ công cụ soạn mail phản hồi: Đã soạn và phát lệnh gửi mail Hóa đơn");


}


// module.exports = { sendOTPMail, sendReceiptEmail };