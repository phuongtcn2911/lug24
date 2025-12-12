import "./CSS/OTP.css"
import { OTP, Timer } from "../../data/Data"
import "./CSS/ResultStatus.css"
import React, { useState, useRef, useContext, useEffect } from "react";

import { PaymentProgressContext } from "../../data/PaymentProgressContext";
import { OrderContext } from "../../data/OrderContext";
import axios from "axios";
import api from "../../config/axios";
import { useTranslation } from "react-i18next";

export async function sendingOTP(obj) {
    try {
        const res = await api.post('api/requestOTP', { obj });
        // const res = await axios.post("http://localhost:5000/api/requestOTP", { obj });
        console.log(res.data);
        return res.data;
    } catch (err) {
        console.error("Lỗi khi gửi OTP:", err.message);
        return { code: -1, message: "Gửi OTP thất bại" };
    }
}

export async function sendOTP(order, lang) {
    try {
        const otpObj = {
            receiver: {
                fullname: order.customer.fullName,
                email: order.customer.email,
                mobile: order.customer.mobile
            },
            contactType: order.customer.email != "" ? "Email" : "Zalo",
            lang: lang
        };
        await api.post("api/requestOTP", { obj: otpObj });
    }
    catch (err) {
        console.log("Giai đoạn gửi OTP bị lỗi: ", err);
    }
}

export function InputOTP() {
    const [otp, setOTP] = useState(["", "", "", "", "", ""]);
    const inputsRef = useRef([]);
    const { t, i18n } = useTranslation();
    const { order } = useContext(OrderContext);
    const [error, setError] = useState("");
    const [resendTimer, setResendTimer] = useState(Timer.resendOTP);
    const [isReactive, setIsReactive] = useState(true);
    const [titleOTP, setTitleOTP] = useState(t("labelConfirmOTP.resend"));
    const [isCounting, setIsCounting] = useState(false);
    // const [currentIndex, setCurrentIndex] = useState(0);
    const { changeStep, changeStatus } = useContext(PaymentProgressContext);

    useEffect(() => {
        const inputOTP = otp.join("");
        if (inputOTP.length === 6) {
            (async () => {
                async function verifyOTP(obj) {
                    try {
                        const res = await api.post('api/verifyOTP', obj);
                        console.log(res.data);
                        return res.data;
                    } catch (err) {
                        console.error("Không thể xác thực OTP", err.message);
                        return { code: -1, message: "Network error" };
                    }
                }

                const obj = {
                    receiver: order.customer.email || order.customer.mobile,
                    otp: otp.join(""),
                }

                const response = await verifyOTP(obj);
                if (response.code == 0) {
                    setError("");
                    changeStep(3);
                    changeStatus(0);
                }
                else {
                    setError(t("labelConfirmOTP.error"));
                    setOTP(["", "", "", "", "", ""]);
                    // setCurrentIndex(0);
                    const firstInput = inputsRef.current[0];
                    if (firstInput) {
                        firstInput.focus();
                        firstInput.select(); // 👉 Tự động bôi đen nội dung
                    }
                    console.warn("Lỗi xác thực OTP", response.message);
                }
            }
            )();
        }
    }, [otp]);

    useEffect(() => {
        if (!isCounting) return;

        let timer;
        if (resendTimer > 0) {
            timer = setTimeout(() => {
                setResendTimer(prev => prev - 1);
            }, 1000);
            setTitleOTP(t("labelConfirmOTP.resendCountDown", { timelapse: resendTimer }));
            setIsReactive(false);
        } else {
            setIsReactive(true);
            setTitleOTP(t("labelConfirmOTP.resend"));
            setIsCounting(false);
        }
        return () => clearTimeout(timer);
    }, [resendTimer, isCounting]);






    const handleInput = (e, index) => {
        const value = e.target.value;
        if (!/^\d?$/.test(value)) return; // chỉ cho nhập 1 chữ số

        const newOtp = [...otp];
        newOtp[index] = value;
        setOTP([...newOtp]);

        // nếu có số thì chuyển focus sang ô kế tiếp
        if (value && index < 5) {
            const nextInput = inputsRef.current[index + 1];
            if (nextInput) {
                setTimeout(() => {
                    nextInput.focus();
                    nextInput.select();
                }, 10);
            }
        }
    };

    const handleKeyDown = (e, index) => {
        if (e.key === "Backspace" && !otp[index] && index > 0) {
            // nếu xoá khi ô trống -> focus về ô trước
            inputsRef.current[index - 1].focus();
            inputsRef.current[index - 1].select();
        }
    };

    const resendOTP = async () => {
        if (!isReactive) return;
        setError("");
        sendOTP(order, i18n.language);
        setResendTimer(Timer.resendOTP);
        setIsCounting(true);
    };

    function sendOTPHandler(e){
        if(!isReactive){
            e.preventDefault();
            return;
        }
        resendOTP();
    }





    return (
        <div className="container">

            <img className="object-cover mx-auto my-4" src={OTP} alt="OTP"></img>

            <p className="title is-2">{t("labelConfirmOTP.title")}</p>
            <p className="subtitle is-6 is-italic">{t("labelConfirmOTP.subtitle")}</p>
            <div id="otp" className="otp-container mb-4">
                {otp.map((val, index) => (
                    <input
                        key={index}
                        className="inpt otp-input"
                        type="text"
                        maxLength={1}
                        inputMode="numeric"
                        onInput={(e) => handleInput(e, index)}
                        onKeyDown={(e) => handleKeyDown(e, index)}
                        onFocus={(e) => e.target.select()}
                        ref={(el) => (inputsRef.current[index] = el)}
                    />
                ))}

            </div>
            <p className="help is-danger">{error}</p>
            <a disabled={!isReactive}
                style={{
                    cursor: !isReactive ? "not-allowed" : "pointer",
                }}
                onClick={sendOTPHandler}>
                {titleOTP}
            </a>

        </div>
    );
}