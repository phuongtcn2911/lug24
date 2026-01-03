import { SePayPgClient } from "sepay-pg-node";
import { config } from "dotenv";
import crypto from "crypto"
import axios from "axios";
import { error } from "console";

config();

const client = new SePayPgClient({
    env: 'sandbox',
    merchant_id: process.env.SEPAY_MERCHANT_ID,
    secret_key: process.env.SEPAY_SECRET_KEY,
});

export async function createPaymentSePay(req, res) {
    try {
        const obj = req.body?.obj;

        if (!obj) return res.status(400).json({ error: "Thiếu thông tin hóa đơn như yêu cầu của SePay" });

        const apiCheckOutURL = client.checkout.initCheckoutUrl();
        // console.log("apiCheckOutURL: ", apiCheckOutURL);

        const successURL=`${process.env.FRONTEND_URL}/OrderResult?status=success`;
        const errorURL=`${process.env.FRONTEND_URL}/OrderResult?status=error`;
        const cancelURL=`${process.env.FRONTEND_URL}/OrderResult?status=cancel`;

        // console.log(successURL);
        // console.log(errorURL);
        // console.log(cancelURL);


        const pkg = {
            operation: 'PURCHASE',
            payment_method: 'BANK_TRANSFER',
            order_invoice_number: obj.order.id,
            order_amount: obj.order.total,
            currency: 'VND',
            order_description: obj.transaction.description,
            success_url: successURL,
            error_url: errorURL,
            cancel_url: cancelURL,
        }
        
        const data = client.checkout.initOneTimePaymentFields(pkg);

        const response = await axios.post(apiCheckOutURL, data, {
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
                "Authorization": `Bearer ${process.env.SEPAY_SECRET_KEY}`
            },
        });

        console.log("Liên kết thanh toán SePay: ",response.request.res.responseUrl);

        res.json({
            checkout_url: response.request.res.responseUrl,
        });

    }
    catch (err) {
        console.log("Phía SePay phản hồi về Backend: Có lỗi giao dịch: ", err.message);
        return res.status(500).json({ code: 1, message: "Chưa hoàn tất thanh toán với SePay" });
    }
}


export async function confirmPaymentSePay(req, res) {
    try {
        console.log("Webhook từ SePay:", req.body);

        const { timestamp, notification_type, order, transaction } = req.body;

        // ✅ 1. Kiểm tra dữ liệu cơ bản
        if (!order?.order_id || !transaction?.transaction_status) {
            return res.status(400).json({ error: "Dữ liệu IPN không hợp lệ" });
        }

        // ✅ 2. Xác minh chữ ký bảo mật
        // SePay sẽ gửi kèm header "x-sepay-signature"
        const signatureHeader = req.headers["x-sepay-signature"];

        if (!signatureHeader) {
            console.warn("Không có chữ ký bảo mật trong webhook");
            return res.status(403).json({ error: "Thiếu chữ ký bảo mật" });
        }

        const bodyString = JSON.stringify(req.body);
        const expectedSignature = crypto
            .createHmac("sha256", process.env.SEPAY_SECRET_KEY)
            .update(bodyString)
            .digest("hex");

        if (signatureHeader !== expectedSignature) {
            console.warn("Chữ ký không khớp — webhook có thể bị giả mạo");
            return res.status(403).json({ error: "Chữ ký không hợp lệ" });
        }

        // ✅ 3. Xử lý kết quả giao dịch
        if (transaction.transaction_status === "APPROVED") {
            console.log(`Thanh toán thành công cho đơn hàng ${order.order_id}`);

            // 👉 Gửi socket signal tới frontend
            const io = req.app.get("io"); // socket server đã set trong server.js
            if (io) {
                io.emit("payment_success", {
                    order_id: order.order_id,
                    amount: order.order_amount,
                    method: transaction.payment_method,
                    time: transaction.transaction_date,
                    status: transaction.transaction_status,
                });
                console.log("🚀 Đã gửi tín hiệu thanh toán thành công tới frontend");
            } else {
                console.warn("⚠️ Không tìm thấy socket server (io chưa được gán)");
            }

            // 👉 Tùy bạn: cập nhật DB, gửi email, v.v.
        } else {
            console.log(
                `⚠️ Giao dịch không thành công: ${transaction.transaction_status}`
            );
        }

        // ✅ 4. Phản hồi lại SePay (bắt buộc)
        // Nếu bạn không trả về { success: true }, SePay sẽ retry IPN nhiều lần
        return res.json({ success: true });
    } catch (err) {
        console.error("🔥 Lỗi xử lý IPN từ SePay:", err);
        return res.status(500).json({ error: "Lỗi xử lý IPN" });
    }
}