const nodemailer = require("nodemailer");
const fs=require('fs').promises;
const path=require('path');
const hbs=require('nodemailer-express-handlebars').default;

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

transporter.use('compile', hbs({
  viewEngine: {
    extname: '.hbs',
    layoutsDir: path.join(__dirname, '../template'),
    defaultLayout: false,
  },
  viewPath: path.join(__dirname, '../template'),
  extName: '.hbs',
}));

async function sendOtpViaMail(receiver, otp) {
  const mailOptions = {
    from: `"SmartLocker" <${process.env.EMAIL_USER}>`,
    to:receiver,
    subject: "Mã OTP mở tủ SmartLocker",
    text: `Mã OTP của bạn là: ${otp}. Mã có hiệu lực trong 5 phút.`,
  };

  await transporter.sendMail(mailOptions);
  
}

async function sendOTPMail(receiver, otp){
  console.log(receiver);
 const otpDigits=otp.toString().split('');
 await transporter.sendMail({
  from:`'LUG24 - Smart Locker' <${process.env.EMAIL_USER}>`,
  to:receiver.email,
  subject:"Xác thực mã OTP",
  template:"OTP_Mail",
  context:{
    otpDigits,
    fullname:receiver.fullname,
  }
 });
 console.log("Mail đã gửi đi");
}

module.exports = { sendOTPMail };