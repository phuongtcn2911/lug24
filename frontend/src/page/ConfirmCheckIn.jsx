import { useContext, useEffect, useState } from "react";
import { Header } from "../components/ExtraPart/Header";
import InfoLabel from "../components/InputForm/InfoLabel";
import RadioButton from "../components/InputForm/RadioButton";
import { LanguageContext } from "../data/LanguageContext";
import { Link, useNavigate } from "react-router-dom";
import { OrderContext } from "../data/OrderContext";
import * as Data from "../data/Data"
import CurrencyFormat from "../data/CurrencyFormat";
import * as  DateStringFormat from "../data/DateStringFormat";
import axios from "axios";
import api from "../config/axios";


export default function ConfirmCheckIn() {
    const { lang, Languages } = useContext(LanguageContext);
    const { order, setOrder } = useContext(OrderContext);
    const [selectedValue, setSelectedValue] = useState({ paymentMethods: 0 });
    const [orderCode, setOrderCode] = useState('');
    const [locker, setLocker] = useState();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");


    const navigate = useNavigate();

    useEffect(() => {
        if (order.lockerID === undefined || order.lockerID === null) {
            getLockerID();
        }
        else {
            setLocker(order.lockerID);
        }
    }, [order.lockerID]);

    useEffect(() => {
        if (!locker) return;
        setOrder(prev => ({
            ...prev,
            lockerID: locker,
        }));
    }, [locker]);

    useEffect(() => {
        setOrder(prev => ({
            ...prev,
            paymentMethod: selectedValue.paymentMethods
        }));
        console.log(order.paymentMethod);
    }, [selectedValue]);

    const changeValue = (groupName, value) => {
        setSelectedValue(prev => ({
            ...prev,
            [groupName]: value,
        }));
    };

    // const getOrderCode = async () => {
    //     const res = await fetch('http://localhost:5000/api/generate-order-code');
    //     const data = await res.json();
    //     setOrderCode(data.orderCode);
    // }

    const getLockerID = async () => {
        let sizeID = order.sizeIndex == 0 ? 1 : 3;
        const res = await api.get('api/getAvailableBox', { params: { size: sizeID } });
        // const res = await axios.get('http://localhost:5000/api/getAvailableBox', { params: { size: sizeID } });
        console.log("Get available box:", res.data);
        setLocker(res.data.value.box.boxNo);
    }



    const createAnOrder = async () => {

        async function bookABox(obj) {
            try {
                const res = await api.post('api/bookABox', { params: { obj } });
                // const res = await axios.post('http://localhost:5000/api/bookABox', { obj });
                console.log("Order: ", res.data);
                return res.data;
            } catch (err) {
                console.error("Không thể đặt box", err.message);
                return { code: -1, message: "Network error" };
            }
        }

        async function confirmPayment(bill) {
            try {
                const res = await api.get('api/confirmPayment', { params: { bill } });
                // const res = await axios.post('http://localhost:5000/api/confirmPayment', { bill });
                console.log("Order: ", res.data);
                return res.data;
            } catch (err) {
                console.error("Không thể xác nhận đơn hàng", err.message);
                return { code: -1, message: "Network error" };
            }
        }

        if (order.orderID != undefined || order.orderID != null) {
            console.log("Order ID: ", order.orderID);
            navigate("/OrderResult");
            return;
        }

        setIsLoading(true);
        try {
            const obj = {
                boxNo: order.lockerID,
                trackNo: order.fullName,
                mobile: order.mobile,
                email: order.email
            };
            console.log("Sending order object:", obj);
            const response = await bookABox(obj);
            let orderCode = "";

            if (response.code === 0) {
                orderCode = response.value.orderCode;

                setOrder(prev => ({
                    ...prev,
                    orderID: response.value.orderCode,
                }));
            }
            else {
                console.warn(data.msg);
            }

            const bill = {
                orderCode: orderCode,
                setPayment: 0,
                money: order.total,
            };
            console.log("Bill Confirm:", bill);
            const response_stp2 = await confirmPayment(bill);

            if (response_stp2.code === 0) {
                navigate("/OrderResult");
            }
            else {
                setError(response_stp2.message);
            }
        } catch (err) {
            setError("Có lỗi khi tạo đơn hàng! Vui lòng thử lại sau!");
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <>
            <Header link="/SendParcel" isBackEnable={true}></Header>

            <article className="message is-warning">
                <div className="message-body">
                    <h1 className="title has-text-left">Xác nhận thông tin đặt tủ</h1>
                    <div className="columns is-mobile">
                        {/* <InfoLabel layout="is-2" label="Mã đặt tủ">{orderCode}</InfoLabel> */}
                        <InfoLabel layout="is-6" label={Languages[lang].labelCustomer}>{String(order.fullName).toUpperCase()}</InfoLabel>
                        <InfoLabel layout="is-6" label={`${Languages[lang].labelRenterEmail}/${Languages[lang].labelRenterPhone}`}>{order.email || order.mobile}</InfoLabel>
                    </div>
                    <div className="columns is-mobile">
                        <InfoLabel layout="is-6" label={Languages[lang].labelLockerSize}>{Data.Lockers?.[order.sizeIndex]?.size || "-"}</InfoLabel>
                        <InfoLabel layout="is-2" label={Languages[lang].labelLockerID}>#{locker}</InfoLabel>

                    </div>
                    <div className="columns is-mobile">
                        <InfoLabel layout="is-6" label={Languages[lang].labelCheckInTime}>{DateStringFormat.DateStringFormat(order.checkIn)}</InfoLabel>
                        <InfoLabel layout="is-6" label={Languages[lang].labelCheckOutTime}>{DateStringFormat.DateStringFormat(order.checkOut)}</InfoLabel>
                    </div>
                    <div className="columns is-mobile">
                        <InfoLabel layout="is-6" label={Languages[lang].labelRentalTimeOrder}>{`${order.rentalTime} ${Languages[lang].rentalTimeUnit}`}</InfoLabel>
                        <InfoLabel layout="is-6" label={Languages[lang].labelTotal}>{CurrencyFormat(order.total)}</InfoLabel>
                    </div>

                </div>
            </article>

            {/* <article class="message is-light">
                <div class="message-body">
                    <h1 className="title has-text-left">Phương thức thanh toán</h1>
                </div>

            </article> */}

            <div className="fieldset-columns">
                <fieldset className="group">
                    <legend>Hình thức thanh toán</legend>
                    {Languages[lang].paymentMethod.map(function (p, i) {
                        return (
                            <div className="field">
                                <RadioButton label={p} value={i} selectedValue={selectedValue}
                                    onChange={changeValue} key={i} groupName="paymentMethods"></RadioButton>
                            </div>
                        );
                    })}
                </fieldset>
            </div>
            <div className="container py-5">
                {/* <Link to="/OrderResult"> */}
                <button
                    className={`button is-warning is-rounded is-fullwidth ${isLoading ? "is-loading" : ""}`}
                    onClick={createAnOrder}
                    disabled={isLoading}>
                    <span className="icon">
                        <i className="fa-solid fa-cart-shopping"></i>
                    </span>
                    <span>{Languages[lang].btnCheckout}</span>
                </button>
                <p className="help is-danger">
                    {error}
                </p>
                {/* </Link> */}




            </div>




        </>);
}

