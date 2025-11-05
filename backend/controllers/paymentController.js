export async function createPayment(req, res) {

}

export async function confirmPaymentSePay(req, res) {
    console.log("📩 Webhook từ SePay:", req.body);

    // Gửi phản hồi lại SePay
    res.json({ success: true });

}