import { useContext, useEffect, useState, useRef } from "react";
import { Header } from "../components/ExtraPart/Header";
import InfoLabel from "../components/InputForm/InfoLabel";
import RadioButton from "../components/InputForm/RadioButton";
import { useNavigate } from "react-router-dom";
import { OrderContext } from "../data/OrderContext";
import * as Data from "../data/Data";
import CurrencyFormat from "../utils/CurrencyFormat";
import * as DateStringFormat from "../utils/DateStringFormat";
import api from "../config/axios";
import { PaymentProgressContext } from "../data/PaymentProgressContext";
import { useTranslation } from "react-i18next";


export default function ConfirmCheckIn() {
    // const { lang, Languages } = useContext(LanguageContext);
    const {t,i18n}=useTranslation();

    const { order, setOrder } = useContext(OrderContext);
    
    const [selectedValue, setSelectedValue] = useState({ paymentMethods: 0 });
    const [locker, setLocker] = useState();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const [isRedirecting, setIsRedirecting] = useState(false);

    const navigate = useNavigate();
    const orderRef = useRef(order);

    useEffect(() => {
        orderRef.current = order;
    }, [order]);

    // Lấy lockerID nếu chưa có
    useEffect(() => {
        if (order.locker.id === undefined || order.locker.id === null) {
            getLockerID();
        } else {
            setLocker(order.locker.id);
        }
    }, [order.locker.id]);

    useEffect(() => {
        if (!locker) return;
        setOrder(prev => ({
            ...prev,
            locker: {
                ...prev.locker,
                id: locker,
            },
        }));
    }, [locker]);

    // Đồng bộ phương thức thanh toán
    useEffect(() => {
        setOrder(prev => ({
            ...prev,
            transaction: {
                ...prev.transaction,
                paymentMethod: selectedValue.paymentMethods,
            }
        }));
    }, [selectedValue]);

    const changeValue = (groupName, value) => {
        setSelectedValue(prev => ({
            ...prev,
            [groupName]: value,
        }));
    };

    // Lấy lockerID từ API
    const getLockerID = async () => {
        let sizeID = order.locker.sizeIndex === 0 ? 1 : 3;
        try {
            const res = await api.post('api/getAvailableBox', { size: sizeID });
            console.log("Get available box:", res.data);
            setLocker(res.data.value.box.boxNo);
        } catch (err) {
            console.error("Không lấy được lockerID", err.message);
        }
    };

    useEffect(() => {
        if (order.transaction.checkoutURL) {
            setIsRedirecting(true);
            window.location.href = order.transaction.checkoutURL;
        }
        // return <p>Đang chuyển đến trang thanh toán SePay...</p>;
    }, [order.transaction.checkoutURL]);

    const createAnOrder = async () => {

        async function bookABox(obj) {
            try {
                const res = await api.post('api/bookABox', { obj });
                console.log("Order: ", res.data);
                return res.data;
            } catch (err) {
                console.error("Không thể đặt box", err.message);
                return { code: -1, message: "Network error" };
            }
        }

        async function confirmPayment(bill) {
            try {
                const res = await api.post('api/confirmPayment', { bill });
                console.log("Order: ", res.data);
                return res.data;
            } catch (err) {
                console.error("Không thể xác nhận đơn hàng", err.message);
                return { code: -1, message: "Network error" };
            }
        }

        async function makeSepayTransaction(obj) {
            try {
                console.log("BackEnd nhận OBJ để thiết lập chuyển cho Sepay: ", obj)
                const res = await api.post('api/createPaymentSePay', { obj });
                console.log("Transact: ", res.data);
                return res.data;
            } catch (err) {
                console.error("FrontEnd nhận phản hồi từ BackEnd: Không tạo được giao dịch", err.message);
                return { code: -1, message: "Network error" };
            }
        }

        if (orderRef.current.order.id) {
            console.log("Order ID: ", order.order.id);
            navigate("/OrderResult");
            return;
        }

        setError("");
        setIsLoading(true);
        try {
            const obj = {
                boxNo: locker,
                trackNo: orderRef.current.customer.fullName,
                mobile: orderRef.current.customer.mobile,
                email: orderRef.current.customer.email
            };
            console.log("Sending order object:", obj);
            const response = await bookABox(obj);
            let orderCode = "";

            if (response.code === 0) {
                const newSubID = `LUG${String(response.value.orderCode).slice(-6)}`;
                const description = `${t("defaultBankingMsg")} ${newSubID}`;

                orderRef.current = {
                    ...orderRef.current,
                    order: {
                        ...orderRef.current.order,
                        id: response.value.orderCode,
                        subID: newSubID,
                    },
                    transaction: {
                        ...orderRef.current.transaction,
                        description: description,
                    }
                };

                setOrder(orderRef.current);
            }
            else {
                setError(response.message);
                return;
            }

            const bill = {
                orderCode: response.value.orderCode,
                setPayment: 0,
                money: orderRef.current.order.total,
            };
            console.log("Bill Confirm:", bill);
            const response_stp2 = await confirmPayment(bill);

            if (response_stp2.code !== 0) {
                setError(response_stp2.message);
                return;

            }

            const response_stp3 = await makeSepayTransaction(orderRef.current);

            if (response_stp3?.code !== 1) {
                orderRef.current = {
                    ...orderRef.current = {
                        ...orderRef.current,
                        transaction: {
                            ...orderRef.current.transaction,
                            checkoutURL: response_stp3?.checkout_url
                        }
                    }
                }
                setOrder(orderRef.current);
                localStorage.setItem("order", JSON.stringify(orderRef.current));
            }
            else {
                setError(response_stp3?.message);
                return;
            }


        } catch (err) {
            setError("Có lỗi khi tạo đơn hàng! Vui lòng thử lại sau!");
            console.log(err);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            <Header link="/SendParcel" isBackEnable={true} />
            {isRedirecting && (
                <div className="notification is-info">
                {t("sepayTransitionNoti")}
                </div>
            )}

            <article className="message is-warning">
                <div className="message-body">
                    <h1 className="title has-text-left">{t("labelConfirmCheckIn")}</h1>
                    <div className="columns is-mobile">
                        <InfoLabel layout="is-6" label={t("labelCustomer")}>
                            {String(order.customer.fullName).toUpperCase()}
                        </InfoLabel>
                        <InfoLabel layout="is-6" label={`${t("labelRenterEmail")}/${t("labelRenterPhone")}`}>
                            {order.customer.email || order.customer.mobile}
                        </InfoLabel>
                    </div>
                    <div className="columns is-mobile">
                        <InfoLabel layout="is-6" label={t("labelLockerSize")}>
                            {Data.Lockers?.[order.locker.sizeIndex]?.size || "-"}
                        </InfoLabel>
                        <InfoLabel layout="is-2" label={t("labelLockerID")}>#{locker}</InfoLabel>
                    </div>
                    <div className="columns is-mobile">
                        <InfoLabel layout="is-6" label={t("labelCheckInTime")}>
                            {DateStringFormat.DateStringFormat(order.order.checkIn,i18n.language)}
                        </InfoLabel>
                        <InfoLabel layout="is-6" label={t("labelCheckOutTime")}>
                            {DateStringFormat.DateStringFormat(order.order.finalCheckOut,i18n.language)}
                        </InfoLabel>
                    </div>
                    <div className="columns is-mobile">
                        <InfoLabel layout="is-6" label={t("labelMaxRentalTimeOrder")}>
                            {`${order.order.maxRentalTime} ${t("rentalTimeUnit")}`}
                        </InfoLabel>
                        <InfoLabel layout="is-6" label={t("labelTotal")}>
                            {CurrencyFormat(order.order.total)}
                        </InfoLabel>
                    </div>
                </div>
            </article>

            <div className="fieldset-columns">
                <fieldset className="group">
                    <legend>{t("labelPaymentMethod")}</legend>
                    {t("paymentMethod",{returnObjects:true}).map((p, i) => (
                        <div className="field" key={i}>
                            <RadioButton
                                label={p}
                                value={i}
                                selectedValue={selectedValue}
                                onChange={changeValue}
                                groupName="paymentMethods"
                            />
                        </div>
                    ))}
                </fieldset>
            </div>

            <div className="container py-5">
                <button
                    className={`button is-warning is-rounded is-fullwidth ${isLoading ? "is-loading" : ""}`}
                    onClick={createAnOrder}
                    disabled={isLoading}
                >
                    <span className="icon"><i className="fa-solid fa-cart-shopping"></i></span>
                    <span>{t("btnCheckout")}</span>
                </button>
                {error && <p className="help is-danger">{error}</p>}
            </div>
        </>
    );
}

