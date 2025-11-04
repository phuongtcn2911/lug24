// utils/mailer.js
import nodemailer from "nodemailer";
import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";
import { config } from "dotenv";
import hbs from "nodemailer-express-handlebars";
import { generateQRCode } from "../utils/qrcode.js";

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
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
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

export async function sendOTPMail(receiver, otp) {
  console.log(receiver);
  const otpDigits = otp.toString().split('');
  await transporter.sendMail({
    from: `'LUG24 - Smart Locker' <${process.env.EMAIL_USER}>`,
    to: receiver.email,
    subject: "Xác thực mã OTP",
    template: "OTP_Mail",
    context: {
      otpDigits,
      fullname: receiver.fullname,
    },
  });
  console.log("Từ công cụ soạn mail phản hồi: Đã soạn và phát lệnh gửi mail OTP");
}

export async function sendReceiptEmail(obj) {
  console.log("Nhận hóa đơn", obj);
  //Tạo mã QR và set lệnh gửi mail
  var data = {
    customer: {
      phone: obj.mobile,
      email: obj.email,
      fullname: obj.fullName,
    },
    locker: {
      box:{
        boxNo:obj.lockerID,
        boxSize:obj.sizeIndex,
      },
      lockerID: env.DEVICE_NO,
      locationName: "DOUP Healthy Food",
      locationAddress: "54/1 Lê Quang Định, phường Bình Thạnh, TP.HCM, Việt Nam",
      locationPhone: "+84 111 1111",
      locationWorkingTime: {
        open: "10:00",
        closed: "22:00"
      }
    },
    order: {
      orderID: obj.orderID,
      checkIn: {
        date: new Date(obj.checkIn).toLocaleDateString('vi-VN',{
          day:'2-digit',
          month:'short',
          year:'numeric'
        }).replace(',',''),
        time:new Date(obj.checkIn).toLocaleTimeString('en-US',{
          hour:'2-digit',
          minute:'2-digit',
          hour12:true
        })}        ,
      checkOut: {
        date: new Date(obj.checkOut).toLocaleDateString('vi-VN',{
          day:'2-digit',
          month:'short',
          year:'numeric'
        }).replace(',',''),
        time:new Date(obj.checkOut).toLocaleTimeString('en-US',{
          hour:'2-digit',
          minute:'2-digit',
          hour12:true
        })},
      maxDuration: obj.maxRentalTime,
    }
  }

  var qrLink = await generateQRCode(data);
  const base64Data=qrLink.replace(/^data:image\/png;base64,/, "");
  const buffer=Buffer.from(base64Data,"base64");

  await transporter.sendMail({
    from: `'LUG24 - Smart Locker' ${process.env.EMAIL_USER}`,
    to: data.customer.email,
    subject: `[LUG24] - Phiếu thanh toán tủ - Mã đặt tủ <${data.order.orderID}>`,
    template: "Receipt_Mail",
    context: {
      customer: data.customer,
      locker: data.locker,
      order: data.order,
      qrCodeLink:"qr-code-embedded",
    },
    attachments:[
      {
        filename:"orderQR.png",
        content:buffer,
        cid:"qr-code-embedded"
      }
      
    ]
  });
  console.log("Từ công cụ soạn mail phản hồi: Đã soạn và phát lệnh gửi mail Hóa đơn");


}


// module.exports = { sendOTPMail, sendReceiptEmail };