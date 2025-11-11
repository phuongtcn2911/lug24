import React, { useContext, useEffect, useState } from "react";

import "./CSS/ResultStatus.css";
import * as Data from "../../data/Data"
import { LanguageContext } from "../../data/LanguageContext";
import { OrderContext } from "../../data/OrderContext";
import CurrencyFormat from "../../data/CurrencyFormat";
import * as DateStringFormat from "../../data/DateStringFormat";
import { AnimatePresence } from "framer-motion";
import * as Transition from "../../components/Transition"

import {Payment} from "./Payment";
import OrderStatusScreen from "./OrderStatusScreen";
import {InputOTP} from "./InputOTP";
import { PaymentProgressContext } from "../../data/PaymentProgressContext";
import LockerStatusScreen from "./LockerStatusScreen";

export default function ResultStatus({status}) {
    const { lang, Languages } = useContext(LanguageContext);
    const { order } = useContext(OrderContext); // order mới nested
    const { progress, changeStatus } = useContext(PaymentProgressContext);

    useEffect(()=>{
        if(status==="success"){
            changeStatus(1);
        }
        else if(status==="failed"){
            changeStatus(2);
        }
    },[]);


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


// export default function ResultStatus() {
//     const { lang, Languages } = useContext(LanguageContext);
//     const { order } = useContext(OrderContext);
//     const { progress, changeStatus } = useContext(PaymentProgressContext);

//     // const [orderStatus, setOrderStatus] = useState(-1);



//     function getResult(status) {
//         changeStatus(status);
//     }

 

//     return (

//         <div className="order-card">
//             {/* PHẦN TRÊN */}
//             <div className="order-header">
//                 <AnimatePresence mode="wait">
//                     {   progress.status == -1 ?
//                         (
//                             <Transition.SwipeLeft key="payment">
//                                 <Payment method={order.paymentMethod}></Payment>
//                             </Transition.SwipeLeft>
//                         ) :
//                         progress.step == 1 ?
//                         (
//                             <Transition.SwipeLeft key="resultScreen">
//                                 <OrderStatusScreen></OrderStatusScreen>
//                             </Transition.SwipeLeft>
//                         ) :
//                         progress.step == 2 ?
//                         (
//                             <Transition.SwipeLeft key="otp">
//                                 <InputOTP />
//                             </Transition.SwipeLeft>
//                         ) :
//                         progress.step == 3 ? 
//                         (
//                             <Transition.SwipeLeft key="lockerOpenScreen">
//                                 <LockerStatusScreen></LockerStatusScreen>
//                             </Transition.SwipeLeft>
//                         ): 
//                         progress.step == 4 ? 
//                         (
//                             <Transition.SwipeLeft key="lockerCloseScreen">
//                                 <LockerStatusScreen></LockerStatusScreen>
//                             </Transition.SwipeLeft>
//                         ):null
//                     }

//                 </AnimatePresence>





//             </div>

//             {/* PHẦN DƯỚI */}
//             <div className="order-body has-background-warning">
//                 {/* <hr className="divider" /> */}
//                 <div className="columns is-mobile is-multiline  p-4">
//                     {Languages[lang].orderInfo.map(function (e, i) {
//                         return (
//                             <div className="column is-4">
//                                 <p className="has-text-grey-dark is-size-7 mb-1">{String(e).toUpperCase()}</p>
//                                 <p className="has-text-weight-semibold">{
//                                     i == 0 ? 
//                                         `LUG${String(order.orderID).slice(-6)}`
//                                     :i == 1 ? 
//                                         CurrencyFormat(order.total) 
//                                     :DateStringFormat.DateStringFormatWithoutWeekDay(order.checkOut)}</p>
//                             </div>
//                         );
//                     })}
//                 </div>
//             </div>
//         </div>
//     );
// }