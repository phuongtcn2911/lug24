const axios = require("axios");
const { sendOtpViaMail, sendOTPMail } = require("../utils/mailer");
const { generateOrderCode, hashCode, generateOTP } = require("../utils/generator");

let otpStore = {};

const apiURL = process.env.SMARTLOCKER_API;
const apiKey = process.env.SMARTLOCKER_TOKEN;
const deviceNo = process.env.DEVICE_NO;

exports.sendOTP = async (req, res) => {
    try {
        const orderCode = req.body?.orderCode || req.query?.orderCode;

        if (!orderCode) {
            return res.status(400).json({ error: "Thiếu tham số mã đơn" });
        }

        const data = {
            oType: '1002',
            apiKey: apiKey,
            param: {
                orderCode: orderCode
            }
        };

        const response = await axios.post(apiURL, data, {
            headers: { "Content-Type": "application/json" },
        });

        res.json(response.data);

    }
    catch (err) {
        console.error("Lỗi khi gọi API AITUO: ", err.message);
        res.status(500).json({ err: "Không thể kết nối tới máy chủ AITUO" });
    }
};

exports.requestOTP = async (req, res) => {
    try {
        const obj = req.body?.obj;
        console.log("Request OTP:",obj);
        // console.log(obj.receiver, obj.contactType);
        if (!obj.receiver) return res.status(400).json({ error: "Thiếu thông tin người nhận" });

        const otp = generateOTP();

        otpStore[obj.receiver.email] = {
            hash: otp.hashOTP,
            expire: Date.now() + 5 * 60 * 1000, //OTP sẽ hết hạn trong vòng 5 phút
        };

        if (obj.contactType === "email") {
            await sendOTPMail(obj.receiver, otp.otp);
            res.json({ code: 0, message: "Đã gửi OTP về email" });
        }


    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Không thể gửi OTP" });
    }
};

exports.verifyOTP = (req, res) => {
    const obj = req.body;
 
    if (!obj?.receiver || !obj?.otp)
        return res.status(400).json({ code: -1, message: "Thiếu tham số" });

    const record = otpStore[obj.receiver];
    if (!record) return res.status(400).json({ error: "Chưa gửi OTP cho email này" });
    if (Date.now() > record.expire) return res.json({ code: 2, message: "OTP đã hết hạn" });

    const hashedInput = hashCode(obj.otp);
    if (hashedInput !== record.hash) {
        return res.json({ code: 1, message: "OTP không đúng" });
    }
    delete otpStore[obj.receiver];
    return res.json({ code: 0, message: "Xác thực OTP thành công" });
};

