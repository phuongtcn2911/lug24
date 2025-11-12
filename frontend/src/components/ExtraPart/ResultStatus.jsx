import React, { useContext, useEffect, useState } from "react";

import "./CSS/ResultStatus.css";
import * as Data from "../../data/Data"
import { LanguageContext } from "../../data/LanguageContext";
import { OrderContext } from "../../data/OrderContext";
import CurrencyFormat from "../../data/CurrencyFormat";
import * as DateStringFormat from "../../data/DateStringFormat";
import { AnimatePresence } from "framer-motion";
import * as Transition from "../../components/Transition"

import {Payment,cancelBookABox,afterPayment} from "./Payment";
import OrderStatusScreen from "./OrderStatusScreen";
import {InputOTP} from "./InputOTP";
import { PaymentProgressContext } from "../../data/PaymentProgressContext";
import LockerStatusScreen from "./LockerStatusScreen";
import { TimerContext } from "../../data/TimerContext";

export default function ResultStatus({status}) {
    const { lang, Languages } = useContext(LanguageContext);
    const { order,resetOrder } = useContext(OrderContext); // order mới nested
    const { progress, changeStatus,changeStep,resetProgress } = useContext(PaymentProgressContext);
    const {startTimer}=useContext(TimerContext);

    useEffect(()=>{
        console.log(status);
        startTimer();       
       
        if(status==="success"){
            changeStatus(1); 
            changeStep(1);
            console.log("Tiến hành lưu giao dịch trên AITUIO và gửi OTP về mail");
            afterPayment(order,0,changeStatus);
        }
        else if(status==="cancel"){
            console.log("Tiến hành hủy giao dịch trên AITUIO");
            cancelBookABox(order.order.id,resetOrder,changeStatus,resetProgress);
            console.log("Đã đi lệnh hủy");
        }
    },[status]);


    // function getResult(status) {
    //     changeStatus(status);
    // }

    return (
        <div className="order-card">
            {/* PHẦN TRÊN */}
            <div className="order-header">
                <AnimatePresence mode="wait">
                    {progress.status == -1 ? (
                        <Transition.SwipeLeft key="payment">
                            <Payment method={order.transaction.paymentMethod}></Payment>
                        </Transition.SwipeLeft>
                    ) : progress.step == 1 ? (
                        <Transition.SwipeLeft key="resultScreen">
                            <OrderStatusScreen></OrderStatusScreen>
                        </Transition.SwipeLeft>
                    ) : progress.step == 2 ? (
                        <Transition.SwipeLeft key="otp">
                            <InputOTP />
                        </Transition.SwipeLeft>
                    ) : progress.step == 3 ? (
                        <Transition.SwipeLeft key="lockerOpenScreen">
                            <LockerStatusScreen></LockerStatusScreen>
                        </Transition.SwipeLeft>
                    ) : progress.step == 4 ? (
                        <Transition.SwipeLeft key="lockerCloseScreen">
                            <LockerStatusScreen></LockerStatusScreen>
                        </Transition.SwipeLeft>
                    ) : null}
                </AnimatePresence>
            </div>

            {/* PHẦN DƯỚI */}
            <div className="order-body has-background-warning">
                <div className="columns is-mobile is-multiline p-4">
                    {Languages[lang].orderInfo.map((e, i) => (
                        <div className="column is-4" key={i}>
                            <p className="has-text-grey-dark is-size-7 mb-1">{String(e).toUpperCase()}</p>
                            <p className="has-text-weight-semibold">
                                {i === 0
                                    ? order.order.subID
                                    : i === 1
                                    ? CurrencyFormat(order.order.total)
                                    : DateStringFormat.DateStringFormatWithoutWeekDay(order.order.finalCheckOut)}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
