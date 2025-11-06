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

export function Payment({ method }) {
    const { order, setOrder, resetOrder } = useContext(OrderContext);
    const { lang, Languages } = useContext(LanguageContext);
    const { remaining } = useContext(TimerContext);
    const { changeStatus } = useContext(PaymentProgressContext);

    const [msg, setMsg] = useState("");
    const [timeLeft, setTimeLeft] = useState(Timer.transactDur);

    // // Tạo message ngân hàng
    // useEffect(() => {
    //     if (order?.order?.subID && Languages[lang]) {
    //         const text = `${Languages[lang].defaultBankingMsg} ${order.order.subID}`;
    //         setMsg(text);

    //         // Cập nhật transaction.description
    //         setOrder((prev) => ({
    //             ...prev,
    //             transaction: {
    //                 ...prev.transaction,
    //                 description: text,
    //             },
    //         }));
    //     }
    // }, [order?.order?.subID, lang]);

    // useEffect(() => {
    //     if (!order.transaction.description || order.transaction.uuid) return;
    //     setOrder((prev) => ({
    //         ...prev,
    //         transaction: {
    //             ...prev.transaction,
    //             qrURL:BankAccount.makeQRCode(order.order.total,order.transaction.description),
    //         },
    //     }));
    // }, [order.transaction.description]);

    // Timer giảm
    useEffect(() => {
        const timer = setInterval(() => {
            setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
        }, 1000);
        return () => clearInterval(timer);


    }, []);

    // Timer hết → hủy giao dịch
    useEffect(() => {
        if (timeLeft === 0 && order?.order?.id) {
            cancelBookABox();
        }
    }, [timeLeft, order]);

    // TimerContext hết hạn → hủy giao dịch
    useEffect(() => {
        if (remaining === 0 && order?.order?.id) {
            console.log("Hủy giao dịch do hết thời gian của phiên giao dịch");
            cancelBookABox();
        }
    }, [remaining, order]);

    // Hủy đặt tủ thủ công
    async function cancelBookABox() {

        (async () => {
            const response = await cancelTransaction(order?.order?.id);

            if (response.code !== 0) {
                console.warn("Tủ có thể chưa huỷ thành công:", response.message);
            }
        })();
        resetOrder();
        changeStatus(3);
    }

    // async function makeSepayTransaction(obj) {
    //     try {
    //         console.log("BackEnd nhận OBJ để thiết lập chuyển cho Sepay: ", obj)
    //         const res = await api.post('api/createPaymentSePay', { obj });
    //         console.log("Transact: ", res.data);
    //         return res.data;
    //     } catch (err) {
    //         console.error("FrontEnd nhận phản hồi từ BackEnd: Không tạo được giao dịch", err.message);
    //         return { code: -1, message: "Network error" };
    //     }
    // }

    // Demo thanh toán thành công
    function afterPayment() {
        (async () => {
            try {
                const bill = {
                    orderCode: order.order.id,
                    type: 0,
                    money: order.order.total,
                };
                await api.post("api/savePayment", { obj: bill });

                const obj = {
                    receiver: {
                        fullname: order.customer.fullName,
                        email: order.customer.email,
                    },
                    contactType: "email",
                };
                await api.post("api/requestOTP", { obj });
                changeStatus(1);
            } catch (err) {
                console.error(err.message);
            }
        })();
    }

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
                afterPayment();
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
                        <a className="help" onClick={() => cancelBookABox()}>{Languages[lang].labelCancelTransaction}</a>
                        <a className="help" onClick={changePaymentMethod}>{Languages[lang].labelChangePaymentMethod}</a>
                        {/* <a className="help" onClick={createPayment}>Demo thành công</a>
                        <a className="help" onClick={failPayment}>Demo thất bại</a> */}
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
