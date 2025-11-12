import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import { Header } from "../components/ExtraPart/Header"
import ProgressBar from "../components/ExtraPart/ProgressBar"
import SupportPart from "../components/ExtraPart/SupportPart";
import ResultStatus from "../components/ExtraPart/ResultStatus";




export default function OrderResult() {
    const [step, setStep] = useState(1);


    const location = useLocation();

    const queryParams = new URLSearchParams(location.search);
    const status = queryParams.get("status");





    return (
        <>
            <Header link="/ConfirmCheckIn" isBackEnable={false} />
            <ProgressBar />
            <ResultStatus status={status} />
            <SupportPart />
        </>
    );
}