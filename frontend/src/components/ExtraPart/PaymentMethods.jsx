import { useState,useContext, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { OrderContext } from "../../data/OrderContext";

export default function PaymentMethods() {
    const { t } = useTranslation();
    const items = t("paymentMethod", { returnObjects: true });
    
    const {order,updateOrder}=useContext(OrderContext);
    const [paymentOpt, setPaymentOpt] = useState();


    function changeHandler(e) {
        const checkState=e.target.checked;
        const paymentMethodOpt=parseInt(e.target.value);
        if (checkState) {
            setPaymentOpt(paymentMethodOpt);
            updateOrder("transaction","paymentMethod",paymentMethodOpt);
        }
    }

   

    return (
        <>
            <h3 className="mb-2 text-left text-lg font-medium text-gray-900 ">{t("labelPaymentMethods")}</h3>
            <ul class="items-center w-full text-sm font-medium text-heading bg-neutral-primary-soft border border-default rounded-lg sm:flex">
                {items?.map(function (item, key) {
                    return (
                        <li key={"item_" + key} className="w-full border-b border-default sm:border-b-0 sm:border-r">
                            <div className="flex items-center ps-2">
                                <input id={`pMethod${key}`}
                                    type="radio"
                                    value={key}
                                    checked={order.transaction.paymentMethod===key||paymentOpt===key}
                                    name="paymentMethods"
                                    onChange={changeHandler}
                                    className="w-3 h-3 text-gray-600 border-default-medium bg-gray-100 rounded-full 
                                checked:border-brand 
                                focus:ring-2 focus:outline-none focus:ring-brand-subtle border border-default appearance-none" />
                                <label for={`pMethod${key}`} className="w-full py-2 text-left select-none ms-2 text-xs ">{item}</label>
                            </div>
                        </li>
                    );

                })}
            </ul>
        </>
    );
}