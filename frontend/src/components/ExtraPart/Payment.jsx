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

    // Tạo message ngân hàng
    useEffect(() => {
        if (order?.order?.subID && Languages[lang]) {
            const text = `${Languages[lang].defaultBankingMsg} ${order.order.subID}`;
            setMsg(text);

            // Cập nhật transaction.description
            setOrder((prev) => ({
                ...prev,
                transaction: {
                    ...prev.transaction,
                    description: text,
                },
            }));
        }
    }, [order?.order?.subID, lang]);

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
        console.log(order.order.id);
        (async () => {
            const response = await cancelTransaction(order?.order?.id);

            if (response.code !== 0) {
                console.warn("Tủ có thể chưa huỷ thành công:", response.message);
            }
        })();
        resetOrder();
        changeStatus(3);
    }

    // Demo thanh toán thành công
    function createPayment() {
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
                createPayment();
            }
        });

        socket.on("payment_failed", (data) => {
            if (data?.orderID === order?.order?.subID) {
                failPayment();
            }
        });

        return () => socket.disconnect();
    }, [order]);

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
                        src={method === 1 ? BankAccount.makeQRCode(order.order.total, msg) : TapToPay}
                        alt="Payment QR"
                    />
                </div>
            </div>
        </>
    );
}

// export async function cancelTransaction(orderCode) {
//     async function cancelABox(orderCode) {
//         try {
//             const res = await api.post('api/cancelABox', { orderCode });
//             // const res = await axios.post("http://localhost:5000/api/cancelABox", { orderCode });
//             console.log(res.data);
//             return res.data;
//         } catch (err) {
//             console.error("Không hủy được tủ", err.message);
//             return { code: -1, message: "Network error" };
//         }
//     }

//     const response = await cancelABox(orderCode);

//     if (response.code !== 0) {
//         console.warn("Tủ có thể chưa huỷ thành công:", response.message);
//     }

//     return response;
// }


// export function Payment({ method }) {
//     const { order, resetOrder } = useContext(OrderContext);
//     const { lang, Languages } = useContext(LanguageContext);
//     const { remaining } = useContext(TimerContext)
//     const [msg, setMsg] = useState("");

//     const [timeLeft, setTimeLeft] = useState(Timer.transactDur);
//     const { changeStatus } = useContext(PaymentProgressContext);


//     useEffect(() => {
//         if (order?.orderID && Languages[lang]) {
//             const shortOrderID=`${String(order.orderID).slice(-6)}`;
//             let text = `${Languages[lang].defaultBankingMsg} ${order.orderID}`;
//             setMsg(text);
//         }
//     }, [order, lang, Languages]);

//     useEffect(() => {
//         const timer = setInterval(() => {
//             setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
//         }, 1000);
//         return () => clearInterval(timer);
//     }, []);

//     useEffect(() => {
//         if (timeLeft == 0 && order?.orderID) {
//             cancelTransaction(order.orderID);
//             resetOrder();
//             changeStatus(3);
//         }
//     }, [timeLeft, order]);

//     useEffect(() => {
//         // console.log(remaining);
//         if (remaining == 0 && order?.orderID) {
//             console.log("Hủy giao dịch do hết thời gian của phiên giao dịch");
//             cancelTransaction(order.orderID);
//             resetOrder();
//             changeStatus(3);
//         }
//     }, [remaining]);


//     function cancelBookABox() {
//         (async () => {
//             const response = await cancelTransaction(order.orderID);

//             if (response.code !== 0) {
//                 console.warn("Tủ có thể chưa huỷ thành công:", response.message);
//             }
//         })();
//         resetOrder();
//         changeStatus(3);
//     }

//     function createPayment() {
//         (async () => {
//             async function savePayment(obj) {
//                 try {
//                     const res = await api.post('api/savePayment', { obj });
//                     // const res = await axios.post("http://localhost:5000/api/savePayment", { obj });
//                     console.log(res.data);
//                     return res.data;
//                 } catch (err) {
//                     console.error("Không thể lưu phần thanh toán", err.message);
//                     return { code: -1, message: "Network error" };
//                 }
//             }

//             async function requestOTP(obj) {
//                 try {
//                     const res = await api.post('api/requestOTP', { obj });
//                     // const res = await axios.post("http://localhost:5000/api/requestOTP", { obj });
//                     console.log(res.data);
//                     return res.data;
//                 } catch (err) {
//                     console.error("Lỗi khi gửi OTP:", err.message);
//                     return { code: -1, message: "Gửi OTP thất bại" };
//                 }
//             }

//             var bill = {
//                 orderCode: order.orderID,
//                 type: 0,
//                 money: order.total,
//             };

//             const response = await savePayment(bill);
//             if (response.code !== 0) {
//                 console.warn("Thanh toán lưu không thành công:", response.message);
//             }

//             const obj = {
//                 receiver: {
//                     fullname: order.fullName,
//                     email: order.email,
//                 },
//                 contactType: "email",
//             };
//             console.log("Thông tin gửi mail OTP:", obj);

//             const responseOTP = await requestOTP(obj);
//             if (responseOTP.code !== 0) {
//                 console.warn("Mã OTP ko thể gửi đi:", response.message);
//             }
//             changeStatus(1);
//         })();
//     }

//     function failPayment() {
//         changeStatus(2);
//     }

//     function changePaymentMethod() {
//         changeStatus(0);
//     }


//     const minutes = Math.floor(timeLeft / 60);
//     const seconds = timeLeft % 60;

//     // function getBackStatus(status) {
//     //     console.log(status);
//     //     return getResult(status);
//     // }




//     return (
//         <>
//             <div className="columns is-mobile ">
//                 <div className="column is-6">
//                     <p className="title mb-2 is-5">{Languages[lang].labelEndTransaction}</p>
//                     <div className=" tags are-large is-centered mb-2">

//                         <span className="tag has-text-weight-bold">{minutes.toString().padStart(2, '0')}</span>
//                         <span className="">:</span>
//                         <span className="tag has-text-weight-bold">{seconds.toString().padStart(2, '0')}</span>

//                     </div>

//                     <hr className="divider"></hr>
//                     <InfoLabel label={Languages[lang].labelCustomer} children={order.fullName}></InfoLabel>
//                     <InfoLabel label={`${Languages[lang].labelRenterEmail}/${Languages[lang].labelRenterPhone}`} children={order.email || order.mobile}></InfoLabel>
//                     <InfoLabel label={Languages[lang].labelMessage} children={msg}></InfoLabel>

//                     <div className="field p-3 has-text-left">
//                         <a className="help" onClick={() => cancelBookABox()}>{Languages[lang].labelCancelTransaction}</a>
//                         <a className="help" onClick={() => changePaymentMethod()}>Thay đổi phương thức thanh toán</a>
//                         <a className="help" onClick={() => createPayment()}>Demo thành công</a>
//                         <a className="help" onClick={() => failPayment()}>Demo thất bại</a><br />
//                     </div>




//                 </div>
//                 <div className="column is-6">
//                     <p className="title is-5 ">{Languages[lang].labelPaymentDirection[method]}</p>
//                     <img width="300" src={method == 1 ? BankAccount.makeQRCode(order.total, msg) : TapToPay}></img>
//                 </div>
//             </div>
//             <div className="columns">
//                 <div className="column">

//                 </div>
//             </div>

//         </>

//     );


// }