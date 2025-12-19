import { AnimatePresence } from "framer-motion";
import { useContext, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import Input from "./Input";
import { OrderContext } from "../../data/OrderContext";

export default function SenderInput() {
    const { t } = useTranslation();

    const [showMobilecustomer, setShowMobilecustomer] = useState(false);
    const [showMobileReceiver, setShowMobileReceiver] = useState(false);

    const [isSameDelivery, setIsSameDelivery] = useState(true);
    const [form, setForm] = useState({
        customer: {
            fullName: "",
            email: "",
            mobile: "",
        },
        receiver: {
            fullName: "",
            email: "",
            mobile: "",
        }
    });

    const { order, setOrder, updateOrder } = useContext(OrderContext);

    useEffect(() => { console.log(order) }, [order]);

    function setValueInFormHandler(e) {
        // console.log(e.target);
        const obj = e.target.name;

        const [group, field] = obj.split(".");
        const value = e.target.value;


        setForm(prev => ({
            ...prev,
            [group]: {
                ...prev[group],
                [field]: value
            }
        }));
    }

    function updateOrderHandler(e) {
        const obj = e.target.name;
        const [group, field] = obj.split(".");
        const value = e.target.value;

        updateOrder(group, field, value);
    }

    function changeOtherMethod(e, who) {
        e.preventDefault();
        if (who === "customer")
            setShowMobilecustomer(!showMobilecustomer);
        else setShowMobileReceiver(!showMobileReceiver);
    }

    function setDifferentDelivery(e) {
        setIsSameDelivery(!isSameDelivery);
    }


    return (
        <div className="h-full flex flex-col">
            <h2 className="title-font sm:text-2xl text-xl font-medium text-gray-900 mb-5 text-left">
                {t("headerDropOff")}
            </h2>

            <div className="flex flex-col gap-4 flex-1">
                <Input label={t("labelRenterName")}
                    id="inpcustomerName"
                    name="customer.fullName"
                    type="text"
                    placeholder={t("plcFullname")}
                    value={form.customer.fullName||order.customer.fullName}
                    onChange={setValueInFormHandler}
                    onBlur={updateOrderHandler}
                />

                <div className="relative overflow-hidden h-[90px]">
                    <div className={`absolute inset-0 ${showMobilecustomer ? "animate-slideOutLeft" : "animate-slideInLeft"}`}>
                        <Input label={t("labelRenterEmail")}
                            id="inpcustomerEmail"
                            name="customer.email"
                            type="email"
                            placeholder={t("plcEmail")}
                            value={form.customer.email||order.customer.email}
                            onChange={setValueInFormHandler}
                            onBlur={updateOrderHandler}
                            disabled={showMobilecustomer}
                            tabIndex={showMobilecustomer ? -1 : 0}
                        />
                    </div>

                    <div className={`absolute inset-0 ${showMobilecustomer ? "animate-slideInRight" : "animate-slideOutRight"}`}>
                        <Input label={t("labelRenterPhone")}
                            id="inpPhoneSender"
                            name="customer.mobile"
                            type="tel"
                            placeholder={t("plcPhone")}
                            value={form.customer.mobile||order.customer.mobile}
                            onChange={setValueInFormHandler}
                            onBlur={updateOrderHandler}
                            disabled={!showMobilecustomer}
                            tabIndex={!showMobilecustomer ? -1 : 0}
                        />
                    </div>
                </div>
                <a onClick={(e) => changeOtherMethod(e, "customer")} className="text-sm text-left mb-5 text-gray-500 hover:text-yellow-500">{showMobilecustomer == false ? t("btnSignUpViaMobile") : t("btnSignUpViaEmail")}</a>


                <div className="divider mb-3">
                    <span className="bg-gray-50 px-2">{t("divFillInfo")}</span>
                </div>


                <div className="flex flex-col gap-2">
                    <button class="flex-1 text-white bg-yellow-500 border-0 p-2 focus:outline-none hover:bg-yellow-600 rounded text-base">
                        <i class="fa-solid fa-qrcode mr-2"></i>
                        {t("btnScanIDCard")}
                    </button>
                    {/* <button class="flex-1 text-white bg-yellow-500 border-0 p-2 focus:outline-none hover:bg-yellow-600 rounded text-base">
                        <i class="fa-solid fa-users-viewfinder mr-2"></i>
                        {t("btnFaceRecognize")}
                    </button> */}
                </div>


                <div className="text-left">
                    <label className="inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" checked={!isSameDelivery}
                            onChange={setDifferentDelivery} />
                        <div className="relative w-11 h-6 bg-gray-200 rounded-full peer peer-checked:bg-yellow-500
                                                after:content-[''] after:absolute after:top-[2px] after:left-[2px]
                                                after:bg-white after:rounded-full after:h-5 after:w-5
                                                after:transition-all peer-checked:after:translate-x-full">
                        </div>
                        <span className="ml-3 text-sm font-medium text-gray-900">{t("chkSameDelivery")}</span>
                    </label>
                </div>

                <div className={`overflow-hidden ${!isSameDelivery ? "animate-expand" : "animate-collapse"}`}>
                    <div className="divider mb-3" />
                    <h2 className="title-font sm:text-2xl text-xl font-medium text-gray-900 mb-5 text-left">
                        {t("headerPickUp")}
                    </h2>
                    <div className="flex flex-col gap-4 flex-1">
                        <div>
                            <Input label={t("labelReceiverName")}
                                id="inpReceiverFullname"
                                name="receiver.fullName"
                                type="text"
                                placeholder={t("plcFullname")}
                                value={form.receiver.fullName||order.receiver.fullName}
                                onChange={setValueInFormHandler}
                                onBlur={updateOrderHandler}
                            />
                        </div>

                        <div className="relative overflow-hidden h-[88px] mb-0">
                            <div className={`absolute inset-0 ${showMobileReceiver ? "animate-slideOutLeft" : "animate-slideInLeft"}`}>
                                <Input label={t("labelRenterEmail")}
                                    id="inpEmailReceiver"
                                    name="receiver.email"
                                    type="email"
                                    placeholder={t("plcEmail")}
                                    value={form.receiver.email||order.receiver.email}
                                    onChange={setValueInFormHandler}
                                    onBlur={updateOrderHandler}
                                    disabled={showMobileReceiver}
                                    tabIndex={showMobileReceiver ? -1 : 0}
                                />


                            </div>

                            <div className={`absolute inset-0 ${showMobileReceiver ? "animate-slideInRight" : "animate-slideOutRight"}`}>
                                <Input label={t("labelRenterPhone")}
                                    id="inpPhoneReceiver"
                                    name="receiver.mobile"
                                    type="tel"
                                    placeholder={t("plcPhone")}
                                    value={form.receiver.mobile||order.receiver.mobile}
                                    onChange={setValueInFormHandler}
                                    onBlur={updateOrderHandler}
                                    disabled={!showMobileReceiver}
                                    tabIndex={!showMobileReceiver ? -1 : 0}
                                />
                            </div>
                        </div>

                        <a onClick={(e) => changeOtherMethod(e, "receiver")} className="text-sm text-left mb-5 text-gray-500 hover:text-yellow-500">{showMobileReceiver == false ? t("btnSignUpViaMobile") : t("btnSignUpViaEmail")}</a>
                    </div>
                </div>


            </div>


        </div>
    );
}