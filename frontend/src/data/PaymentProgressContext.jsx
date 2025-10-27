import { createContext, useState } from "react";

export const PaymentProgressContext=createContext();
export const defaultPaymentProcess={
    step:1,
    status:-1
}

export function PaymentProgressProvider({children}){
    const [progress, setProgress]=useState(defaultPaymentProcess);

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

    return(
        <PaymentProgressContext.Provider value={{progress,changeStep,changeStatus}}>
            {children}
        </PaymentProgressContext.Provider>
    );

}
