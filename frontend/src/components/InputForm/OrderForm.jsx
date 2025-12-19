import { useTranslation } from "react-i18next";
import CurrencyFormat from "../../utils/CurrencyFormat.jsx";
import PromotionPanel from "./PromotionPanel.jsx";

export default function OrderForm() {
    const { t } = useTranslation();
    return (
        <div className="h-full flex flex-col">
            <h2 className="title-font sm:text-2xl text-xl font-medium text-gray-900 mb-4 text-left">
                {t("legendOrder")}
            </h2>
            <div className="bg-white border p-5 rounded-lg flex-1">
                <div className="level">
                    <div className="level-left">
                        <p className="text-base font-medium text-heading">{`${t("labelLockerSize")}`}</p>
                    </div>
                    <div className="level-right">
                        <p className="subtitle is-6 has-text-right">{`${t("sizeUnit")}`}</p>
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
                        <p className="subtitle is-6 has-text-right">{`${t("rentalTimeUnit")}`}</p>
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
                        <p className="subtitle is-6 has-text-right">{`${t("rentalTimeUnit")}`}</p>
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
                        <p className="subtitle is-6 has-text-right">{`${t("sizeUnit")}`}</p>
                    </div>
                </div>
                <div className="level">
                    <div className="level-left">
                        <p className="text-base font-medium text-heading">{t("labelDiscount")}</p>
                    </div>
                    <div className="level-right">
                        <p className="subtitle is-6 has-text-right">{`${t("sizeUnit")}`}</p>
                    </div>
                </div>
                <div className="level">
                    <div className="level-left">
                        <p className="text-base font-medium text-heading">{t("labelTax")}</p>
                    </div>
                    <div className="level-right">
                        <p className="subtitle is-6 has-text-right">{`${t("sizeUnit")}`}</p>
                    </div>
                </div>
                <div className="divider mb-5"></div>
                <div className="level">
                    <div className="level-left">
                        <p className="text-lg font-medium text-heading">{t("labelTotal")}</p>
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
    );

}