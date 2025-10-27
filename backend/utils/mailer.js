const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

async function sendOtpViaMail(receiver, otp) {
  const mailOptions = {
    from: `"SmartLocker" <${process.env.EMAIL_USER}>`,
    to:receiver,
    subject: "Mã OTP mở tủ SmartLocker",
    text: `Mã OTP của bạn là: ${otp}. Mã có hiệu lực trong 5 phút.`,
  };

  await transporter.sendMail(mailOptions);
}

module.exports = { sendOtpViaMail };