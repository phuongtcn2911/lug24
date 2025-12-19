import { useTranslation } from "react-i18next";
import { Header } from "../components/ExtraPart/Header";
import DiscountPart from "../components/InputForm/DiscountPart";
import CurrencyFormat from "../utils/CurrencyFormat.jsx";
import SenderInput from "../components/InputForm/SenderInput.jsx";
import ChooseLocker from "../components/InputForm/ChooseLocker.jsx";
import { useEffect, useState,useContext } from "react";
import OrderForm from "../components/InputForm/OrderForm.jsx";
import { TimerContext } from "../data/TimerContext.jsx";
import { OrderContext } from "../data/OrderContext.jsx";

export default function SendParcel() {
    const { t } = useTranslation();
    const [step, setStep] = useState(1);
    const [animatedDirection, setAnimatedDirection] = useState("forward");
    const {startTimer}=useContext(TimerContext);
    const {resetOrder}=useContext(OrderContext);
    
    useEffect(()=>{
        startTimer();
        resetOrder();
        
    },[]);

    return (
        <>
            <Header isBackEnable={true} link={"/"} />
            <section className="text-gray-600 body-font">

                <form className="w-full mx-auto">
                    <div className="container mx-auto">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 item-stretch mb-5">
                            {/* TRÁI */}
                            <div className="h-full flex flex-col overflow-hidden">
                                <div
                                    key={step}
                                    className={`w-full transition-transform duration-300
                                    ${animatedDirection==="forward"?"animate-slideInRight":"animate-slideInLeft"}`}>
                                    {step === 1 ?
                                        <SenderInput></SenderInput> :
                                        <ChooseLocker></ChooseLocker>}
                                </div>

                                <div className="level mt-5 items-center">
                                    <div className="level-left">
                                        {
                                            step === 2 &&
                                            <a className="text-gray-500" onClick={() => { setAnimatedDirection("backward"); setStep(1); }}>
                                                <i class="fa-solid fa-angles-left mr-2"></i>
                                                <span className="text-base">{t("btnPrevStep")}</span>
                                            </a>
                                        }
                                    </div>
                                    <div className="level-right items-center">
                                        {
                                            step === 1 &&
                                            <a className="text-gray-500" onClick={() => { setAnimatedDirection("forward"); setStep(2); }}>
                                                <span className="text-base mr-2">{t("btnNextStep")}</span>
                                                <i class="fa-solid fa-angles-right"></i>
                                            </a>
                                        }

                                    </div>
                                </div>
                            </div>



                            {/* PHẢI */}
                            <OrderForm></OrderForm>

                        </div>


                    </div>




                </form>
            </section >
        </>
    );
}