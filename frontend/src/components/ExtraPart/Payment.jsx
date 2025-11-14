import React, { useContext, useEffect, useState, useRef } from "react";
import { OrderContext } from "../../data/OrderContext";
import { LanguageContext } from "../../data/LanguageContext";
import * as BankAccount from "../../data/BankAccount";
import InfoLabel from "../InputForm/InfoLabel";
import { Timer, TapToPay } from "../../data/Data";
import { PaymentProgressContext } from "../../data/PaymentProgressContext";
import api from "../../config/axios";
import { TimerContext } from "../../data/TimerContext";
import { io } from "socket.io-client";
import { sendOTP } from "./InputOTP";

export async function cancelTransaction(orderID) {
    try {
        // console.log("OrderID Tại cancelTransaction: ",orderID);
        const res = await api.post("api/cancelABox", { orderID });
        console.log(res.data);
        if (res.data.code !== 0) {
            console.warn("Tủ có thể chưa huỷ thành công:", res.data.message);
        }
        return res.data;
    } catch (err) {
        console.error("Không hủy được tủ", err.message);
        return { code: -1, message: "Network error" };
    }
}

export async function cancelBookABox(orderID, resetOrder, resetProgress, changeStatus) {
    const response = await cancelTransaction(orderID);
    console.log(response);
    if (response.code !== 0) {
        console.warn("Tủ có thể chưa huỷ thành công:", response.message);
    }
    resetOrder();
    resetProgress();
    changeStatus(3);
}

export async function savePayment(order, paymentType) {
    try {
        const bill = {
            orderCode: order.order.id,
            type: paymentType,
            money: order.order.total,
        }
        await api.post("api/savePayment", { obj: bill });
    }
    catch (err) {
        console.log("Giai đoạn lưu thanh toán bị lỗi: ", err);
    }

}



export async function afterPayment(order, paymentType, changeStatus,langIndex) {
    (async () => {
        await savePayment(order, paymentType);
        await sendOTP(order,langIndex);
        console.log("Đã gửi mail OTP");
        changeStatus(1);
    })();

}

export function Payment({ method }) {
    const { order, setOrder, resetOrder } = useContext(OrderContext);
    const { lang, Languages } = useContext(LanguageContext);
    const { remaining } = useContext(TimerContext);
    const { changeStatus, resetProgress } = useContext(PaymentProgressContext);

    const [msg, setMsg] = useState("");
    const [timeLeft, setTimeLeft] = useState(Timer.transactDur);

   useEffect(() => {
        const timer = setInterval(() => {
            setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
        }, 1000);
        return () => clearInterval(timer);


    }, []);

    // Timer hết → hủy giao dịch
    useEffect(() => {
        if (timeLeft === 0 && order?.order?.id) {
            cancelBookABox(order?.order?.id, resetOrder, resetProgress, changeStatus);
        }
    }, [timeLeft, order]);

    // TimerContext hết hạn → hủy giao dịch
    useEffect(() => {
        if (remaining === 0 && order?.order?.id) {
            console.log("Hủy giao dịch do hết thời gian của phiên giao dịch");
            cancelBookABox(order?.order?.id, resetOrder, resetProgress, changeStatus);
        }
    }, [remaining, order]);

    function failPayment() {
        changeStatus(2);
    }

    function changePaymentMethod() {
        changeStatus(0);
    }

    // Socket realtime (giữ nguyên)
    useEffect(() => {
        const socket = io(import.meta.env.VITE_BACKEND_URL || "http://localhost:5000");

        socket.on("connect", () => console.log("Socket connected:", socket.id));

        socket.on("payment_success", (data) => {
            if (data?.orderID === order?.order?.subID) {
                afterPayment(order, 0, changeStatus,lang);
            }
        });

        socket.on("payment_failed", (data) => {
            if (data?.orderID === order?.order?.subID) {
                failPayment();
            }
        });

        return () => socket.disconnect();
    }, [order?.order?.subID]);

    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;

    return (
        <>
            <div className="columns is-mobile">
                <div className="column is-6">
                    <p className="title mb-2 is-5">{Languages[lang].labelEndTransaction}</p>
                    <div className="tags are-large is-centered mb-2">
                        <span className="tag has-text-weight-bold">{minutes.toString().padStart(2, "0")}</span>
                        <span>:</span>
                        <span className="tag has-text-weight-bold">{seconds.toString().padStart(2, "0")}</span>
                    </div>

                    <hr className="divider" />
                    <InfoLabel label={Languages[lang].labelCustomer} children={order.customer.fullName} />
                    <InfoLabel
                        label={`${Languages[lang].labelRenterEmail}/${Languages[lang].labelRenterPhone}`}
                        children={order.customer.email || order.customer.mobile}
                    />
                    <InfoLabel label={Languages[lang].labelMessage} children={msg} />

                    <div className="field p-3 has-text-left">
                        <a className="help" onClick={() => cancelBookABox(order.order.id, resetOrder, resetProgress, changeStatus)}>{Languages[lang].labelCancelTransaction}</a>
                        <a className="help" onClick={changePaymentMethod}>{Languages[lang].labelChangePaymentMethod}</a>
                    </div>
                </div>

                <div className="column is-6">
                    <p className="title is-5">{Languages[lang].labelPaymentDirection[method]}</p>
                    <img
                        width="300"
                        src={method === 1 ? order.transaction.qrURL : TapToPay}
                        alt="Payment QR"
                    />
                </div>
            </div>
        </>
    );
}
