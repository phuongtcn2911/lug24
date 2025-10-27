import React, { useState } from "react";
import { Header } from "../components/ExtraPart/Header"
import ProgressBar from "../components/ExtraPart/ProgressBar"
import SupportPart from "../components/ExtraPart/SupportPart";
import ResultStatus from "../components/ExtraPart/ResultStatus";
import { OrderContext } from "../data/OrderContext";
import {PaymentProgressProvider } from "../data/PaymentProgressContext";

export default function OrderResult() {
    const [step, setStep] = useState(1);
    return (
        <>
            <Header link="/ConfirmCheckIn" isBackEnable={false}></Header>
            <PaymentProgressProvider>
                <ProgressBar  />
                <ResultStatus />
                <SupportPart />
            </PaymentProgressProvider>

        </>
    );
}