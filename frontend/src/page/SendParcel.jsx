import { useTranslation } from "react-i18next";
import { Header } from "../components/ExtraPart/Header";
import DiscountPart from "../components/InputForm/DiscountPart";
import CurrencyFormat from "../utils/CurrencyFormat.jsx";
import SenderInput from "../components/InputForm/SenderInput.jsx";
import ChooseLocker from "../components/InputForm/ChooseLocker.jsx";
import { useState } from "react";

export default function SendParcel() {
    const { t } = useTranslation();
    const [step, setStep] = useState(1);
    const [animatedDirection, setAnimatedDirection] = useState("forward");
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
                            <div className="h-full flex flex-col">
                                <h2 className="title-font sm:text-2xl text-xl font-medium text-gray-900 mb-4 text-left">
                                    Đơn hàng
                                </h2>
                                <div className="bg-white border p-5 rounded-lg flex-1">
                                    <div className="level">
                                        <div className="level-left">
                                            <p className="title is-6 ">{`${t("labelLockerSize")}`}</p>
                                        </div>
                                        <div className="level-right">
                                            <p className="subtitle is-6 has-text-right">{`${t("sizeUnit")}`}</p>
                                        </div>
                                    </div>
                                    <div className="level">
                                        <div className="level-left">
                                            <p className="title is-6 ">
                                                <span>{t("labelRentalTimeOrder")}</span>
                                                <span className="has-text-danger"> *</span>
                                            </p>
                                        </div>
                                        <div className="level-right">
                                            <p className="subtitle is-6 has-text-right">{`${t("sizeUnit")}`}</p>
                                        </div>
                                    </div>
                                    <div className="level">
                                        <div className="level-left">
                                            <p className="title is-6 ">
                                                <span>{t("labelMaxRentalTimeOrder")}</span>
                                                <span className="has-text-danger">*</span>
                                            </p>
                                        </div>
                                        <div className="level-right">
                                            <p className="subtitle is-6 has-text-right">{`${t("sizeUnit")}`}</p>
                                        </div>
                                    </div>
                                    <div className="divider"></div>
                                    <DiscountPart
                                    ></DiscountPart>
                                    <div className="divider mb-5"></div>
                                    <div className="level">
                                        <div className="level-left">
                                            <p className="title is-6">{t("labelSubTotal")}</p>
                                        </div>
                                        <div className="level-right">
                                            <p className="subtitle is-6 has-text-right">{`${t("sizeUnit")}`}</p>
                                        </div>
                                    </div>
                                    <div className="level">
                                        <div className="level-left">
                                            <p className="title is-6">{t("labelDiscount")}</p>
                                        </div>
                                        <div className="level-right">
                                            <p className="subtitle is-6 has-text-right">{`${t("sizeUnit")}`}</p>
                                        </div>
                                    </div>
                                    <div className="level">
                                        <div className="level-left">
                                            <p className="title is-6">{t("labelTax")}</p>
                                        </div>
                                        <div className="level-right">
                                            <p className="subtitle is-6 has-text-right">{`${t("sizeUnit")}`}</p>
                                        </div>
                                    </div>
                                    <div className="divider mb-5"></div>
                                    <div className="level">
                                        <div className="level-left">
                                            <p className="title is-5">{t("labelTotal")}</p>
                                        </div>
                                        <div className="level-right">
                                            <p className="subtitle is-5 has-text-right is-bold">{CurrencyFormat(55000)}</p>
                                        </div>
                                    </div>

                                    <button className="button is-warning rounded-xl is-fullwidth"
                                        disabled={true}
                                        onClick={true}
                                    >
                                        <span className="icon">
                                            <i className="fa-solid fa-warehouse"></i>
                                        </span>
                                        <span>{t("btnReservation")}</span>
                                    </button>


                                </div>
                            </div>

                        </div>


                    </div>




                </form>
            </section >
        </>
    );
}