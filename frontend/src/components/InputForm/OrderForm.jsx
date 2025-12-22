import { useTranslation } from "react-i18next";
import CurrencyFormat from "../../utils/CurrencyFormat.jsx";
import PromotionPanel from "./PromotionPanel.jsx";
import { useContext, useEffect, useState } from "react";
import { OrderContext } from "../../data/OrderContext.jsx";
import { InitialDataContext } from "../../data/InitialDataContext.jsx";

export function createPriceListID(rentalOpt = null, size = "") {

    if (rentalOpt === null || size === "") return;
    const rentalID = parseInt(rentalOpt) === 0 ? "PP4H" : "PBUS";
    const priceListID = `${rentalID}.${size}`;
    console.log("Price List ID: ", priceListID);

    return priceListID;
}

export function OrderForm() {
    const { t } = useTranslation();
    const { order, updateOrder } = useContext(OrderContext);
    const { priceList, loading } = useContext(InitialDataContext);
    const [priceItem, setPriceItem] = useState();

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
    }, [order]);

    useEffect(() => {
        if (loading) return;
        if (!order.order.priceListID) return;
        if (!order.order.maxRentalTime) return;

        const priceItem = priceList.find(
            item => item.PRICE_LIST_ID === order.order.priceListID
        );
        console.log("Hạng mục giá đã lọc: ",priceItem);
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


   
    return (
        <div className="h-full flex flex-col">
            <h2 className="title-font sm:text-2xl text-xl font-medium text-gray-900 mb-4 text-left">
                {t("legendOrder")}
            </h2>
            <div className="bg-white border p-5 rounded-lg flex-1">
                <div className="level">
                    <div className="level-left">
                        <p className="text-base font-medium text-heading">{t("labelLockerSize")}</p>
                    </div>
                    <div className="level-right">
                        <p className="subtitle is-6 has-text-right">{`${draft.sizeLetter ? `${t("sizeUnit")} ${draft.sizeLetter}` : "-"}`}</p>
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
                        <p className="subtitle is-6 has-text-right">{`${draft.rentalTime ? `${draft.rentalTime} ${t("rentalTimeUnit")}` : "-"}`}</p>
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
                        <p className="subtitle is-6 has-text-right">{`${draft.maxRentalTime ? `${draft.maxRentalTime} ${t("rentalTimeUnit")}` : "-"}`}</p>
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
                        <p className="subtitle is-6 has-text-right">
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
                        <p className="subtitle is-6 has-text-right">{CurrencyFormat(draft.discountPrice)}</p>
                    </div>
                </div>
                <div className="level">
                    <div className="level-left">
                        <p className="text-base font-medium text-heading">{t("labelTax")}</p>
                    </div>
                    <div className="level-right">
                        <p className="subtitle is-6 has-text-right">{CurrencyFormat(draft.tax)}</p>
                    </div>
                </div>
                <div className="divider mb-5"></div>
                <div className="level">
                    <div className="level-left">
                        <p className="text-lg font-medium text-heading">{t("labelTotal")}</p>
                    </div>
                    <div className="level-right">
                        <p className="subtitle is-5 has-text-right is-bold">{CurrencyFormat(draft.total)}</p>
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
    );

}