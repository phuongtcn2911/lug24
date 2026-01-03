import { useTranslation } from "react-i18next";
import CurrencyFormat from "../../utils/CurrencyFormat.jsx";
import PromotionPanel from "./PromotionPanel.jsx";
import { useContext, useEffect, useState } from "react";
import { OrderContext } from "../../data/OrderContext.jsx";
import { InitialDataContext } from "../../data/InitialDataContext.jsx";
import ModalHouseRule from "../Modal/ModalHouseRule.jsx";


export function OrderForm() {
    const { t } = useTranslation();
    const { order, updateOrder } = useContext(OrderContext);
    const { priceList, loading } = useContext(InitialDataContext);
    const [isEnabledBookingStatus, setsEnabledBookingStatus] = useState(false);
    const [isOpenHouseRule,setOpenHouseRule]=useState(false);

    const [draft, setDraft] = useState({
        priceListID: "",
        sizeLetter: null,
        rentalTime: 0,
        maxRentalTime: 0,
        subTotal: 0,
        discountPrice: 0,
        tax: 0,
        total: 0,
    });

    useEffect(() => {
        const newOrder = {
            sizeLetter: order.locker.sizeLetter,
            rentalTime: order.order.rentalTime,
            maxRentalTime: order.order.maxRentalTime,
            subTotal: order.order.subTotal,
            discountPrice: order.order.discountPrice,
            tax: order.order.tax,
            total: order.order.total
        }
        setDraft(newOrder);

        setsEnabledBookingStatus(checkValidOrderForm());

    }, [order]);

    useEffect(() => {
        if (loading) return;
        if (!order.order.priceListID) return;
        if (!order.order.maxRentalTime) return;

        const priceItem = priceList.find(
            item => item.PRICE_LIST_ID === order.order.priceListID
        );
        console.log("Hạng mục giá đã lọc: ", priceItem);
        if (!priceItem) return;

        console.log(priceItem.TAX_RATE);

        const subTotal = priceItem.UNIT_PRICE * order.order.maxRentalTime;
        const tax = priceItem.TAX_RATE * (subTotal + order.order.discountPrice);
        const total = subTotal + order.order.discountPrice + tax;

        setDraft(prev => ({
            ...prev,
            subTotal,
            tax,
            total
        }));

        updateOrder("order", "subTotal", subTotal);
        updateOrder("order", "tax", tax);
        updateOrder("order", "total", total);

    }, [
        order.order.priceListID,
        order.order.maxRentalTime,
        order.order.discountPrice,
        priceList,
        loading
    ]);


    function checkValidOrderForm() {
        //Kiểm tra tính hợp lệ từ thông tin của người dùng
        //Không kiểm tra dữ liệu liên quan đến việc tính toán
        const isValidPerson = order.customer.fullName!=="" &&order.customer.identityCard!== ""&& (order.customer.mobile!=="" || order.customer.email!=="") && order.receiver.fullName!== ""&&order.receiver.identityCard!== ""&& (order.receiver.mobile!=="" || order.receiver.email!=="");
        const isValidLockerSize = order.locker.sizeLetter !== undefined;
        const isValidRentalTime = order.order.rentalTime!==0 && order.order.checkIn!==null && order.order.checkOut!==null;
        const isValidPaymentMethod = order.transaction.paymentMethod !== undefined;

        console.log("Người dùng hợp lệ: ",isValidPerson);
        console.log("Hộc tủ hợp lệ: ",isValidLockerSize);
        console.log("Thời gian thuê hợp lệ: ",isValidRentalTime);
        console.log("Phương thức thanh toán hợp lệ: ",isValidPaymentMethod);

        return isValidPerson && isValidLockerSize && isValidRentalTime && isValidPaymentMethod;
    }

    function showHouseRule(e){
        e.preventDefault();
        setOpenHouseRule(true);
    }




    return (
        <div className="h-full flex flex-col">
            <h2 className="title-font sm:text-2xl text-xl font-medium text-gray-900 mb-4 text-left">
                {t("legendOrder")}
            </h2>
            <div className="backdrop-blur-xs bg-white/70 border p-5 rounded-lg flex-1">
                <div className="level">
                    <div className="level-left">
                        <p className="text-base font-medium text-heading">{t("labelLockerSize")}</p>
                    </div>
                    <div className="level-right">
                        <p className="text-base text-right">{`${draft.sizeLetter ? `${t("sizeUnit")} ${draft.sizeLetter}` : "-"}`}</p>
                    </div>
                </div>
                <div className="level">
                    <div className="level-left">
                        <p className="text-base font-medium text-heading">
                            <span>{t("labelRentalTimeOrder")}</span>
                            <span className="has-text-danger"> *</span>
                        </p>
                    </div>
                    <div className="level-right">
                        <p className="text-base text-right">{`${draft.rentalTime ? `${draft.rentalTime} ${t("rentalTimeUnit")}` : "-"}`}</p>
                    </div>
                </div>
                <div className="level">
                    <div className="level-left">
                        <p className="text-base font-medium text-heading">
                            <span>{t("labelMaxRentalTimeOrder")}</span>
                            <span className="has-text-danger">*</span>
                        </p>
                    </div>
                    <div className="level-right">
                        <p className="text-base text-right">{`${draft.maxRentalTime ? `${draft.maxRentalTime} ${t("rentalTimeUnit")}` : "-"}`}</p>
                    </div>
                </div>
                <div className="divider"></div>
                <PromotionPanel></PromotionPanel>
                <div className="divider mb-5"></div>
                <div className="level">
                    <div className="level-left">
                        <p className="text-base font-medium text-heading">{t("labelSubTotal")}</p>
                    </div>
                    <div className="level-right">
                        <p className="text-base text-right">
                            {
                                loading ?
                                    <span class="loading loading-spinner loading-xs"></span>
                                    :
                                    CurrencyFormat(draft.subTotal)
                            }
                        </p>
                    </div>
                </div>
                <div className="level">
                    <div className="level-left">
                        <p className="text-base font-medium text-heading">{t("labelDiscount")}</p>
                    </div>
                    <div className="level-right">
                        <p className="text-base text-right">{CurrencyFormat(draft.discountPrice)}</p>
                    </div>
                </div>
                <div className="level">
                    <div className="level-left">
                        <p className="text-base font-medium text-heading">{t("labelTax")}</p>
                    </div>
                    <div className="level-right">
                        <p className="text-base text-right">{CurrencyFormat(draft.tax)}</p>
                    </div>
                </div>
                <div className="divider mb-5"></div>
                <div className="level">
                    <div className="level-left">
                        <p className="text-lg font-medium text-heading">{t("labelTotal")}</p>
                    </div>
                    <div className="level-right">
                        <p className="text-lg text-right">{CurrencyFormat(draft.total)}</p>
                    </div>
                </div>

                <button className="button is-warning rounded-xl is-fullwidth"
                    disabled={!isEnabledBookingStatus}
                    // disabled={false}
                    onClick={showHouseRule}
                >
                    <span className="icon">
                        <i className="fa-solid fa-warehouse"></i>
                    </span>
                    <span>{t("btnReservation")}</span>
                </button>
            </div>
            <ModalHouseRule
            isOpen={isOpenHouseRule}
            onClose={()=>setOpenHouseRule(false)}></ModalHouseRule>
        </div>
    );

}