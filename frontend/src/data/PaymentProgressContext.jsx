import { createContext, useEffect, useState } from "react";

export const PaymentProgressContext=createContext();
export const defaultPaymentProgress={
    step:1,
    status:-1,
}

export function PaymentProgressProvider({children}){
    const [progress, setProgress]=useState(checkStoredPaymentProgress);

    function checkStoredPaymentProgress()
    {
        const storePP=sessionStorage.getItem("paymentProgress");
        if(storePP){
            return JSON.parse(storePP);
        }
        else{
            return defaultPaymentProgress;
        }
    }

    useEffect(()=>{
        sessionStorage.setItem("paymentProgress",JSON.stringify(progress));
    },[progress]);

    function changeStep(stepNo) {
        setProgress((prev) => {
            return { ...prev, step: stepNo };
        });
    }

    function changeStatus(statusNo){
         setProgress((prev) => {
            return { ...prev, status: statusNo };
        });
    }

    function resetProgress(){
        setProgress(defaultPaymentProgress);
        sessionStorage.removeItem("paymentProgress");
    }

    return(
        <PaymentProgressContext.Provider value={{
            progress,
            changeStep,
            changeStatus,
            resetProgress}}>
            {children}
        </PaymentProgressContext.Provider>
    );

}
