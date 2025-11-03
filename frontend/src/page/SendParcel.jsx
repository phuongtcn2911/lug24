import { useContext, useEffect, useState } from "react";
import { LanguageContext } from "../data/LanguageContext.jsx";
import * as Data from '../data/Data.js'
import { Link, useNavigate, useLocation } from "react-router-dom";
import "./CSS/Form.css"
import TextInput from "../components/InputForm/TextInput.jsx";
import { AnimatePresence } from "framer-motion";
import * as Transition from "../components/Transition.jsx"
import ButtonList from "../components/InputForm/ButtonList.jsx";
import { Header } from "../components/ExtraPart/Header.jsx";
import DiscountPart from "../components/InputForm/DiscountPart.jsx";
// import { Lockers } from "../data/Data.js";
import CurrencyFormat from "../data/CurrencyFormat.jsx";
import { OrderContext } from "../data/OrderContext.jsx";
import RadioButton from "..//components/InputForm/RadioButton.jsx"
import RentalTime from "../components/InputForm/RentalTime.jsx";
import Checkbox from "../components/InputForm/CheckBox.jsx";
import validator from "validator"
import { ReceiptTurkishLiraIcon, Timer } from "lucide-react";
import axios from "axios";
import { TimerContext } from "../data/TimerContext.jsx";


function SendParcel() {
    const { lang, Languages } = useContext(LanguageContext);
    const { order, setOrder } = useContext(OrderContext);
    const {startTimer}=useContext(TimerContext);

    const [showMobile, setShowMobile] = useState(false);
    const [sizeLetter, setSizeLetter] = useState();
    const [sizeIndex, setSizeIndex] = useState(0);
    const [unitPrice, setUnitPrice] = useState(0);
    const [rentalTime, setRentalTime] = useState(0);
    const [maxRentalTime, setMaxRentalTime] = useState(0);
    const [discount, setDiscount] = useState(0);
    const [subTotal, setSubTotal] = useState(0);
    const [tax, setTax] = useState(0);
    const [total, setTotal] = useState(0);
    const [isDisabledSubmit, setIsDisabledSubmit] = useState(true);
    const [isShowMsg, setShowMsg] = useState(false);
    const [isAgreement, setIsAgreement] = useState(false);
    const [isValidTime, setIsValidTime] = useState(true);
    const [availableBoxes, setAvailableBoxes] = useState([]);

    const navigate = useNavigate();
    const location = useLocation();

    function showMsg(e) {
        e.preventDefault();
        setShowMsg(true);
    }

    async function countAvailableBox(size) {
        const res = await axios.get('http://localhost:5000/api/countAvailableBox', { params: { size } });
        console.log("Get available box:", res.data);
        return res.data;
    }

    useEffect(function () {
        let isMounted = true;

        async function fetchBoxes() {
            try {
                const [smallAmt, largeAmt] = await Promise.all([
                    countAvailableBox(1),
                    countAvailableBox(3),
                ]);
               
                if(isMounted){
                    setAvailableBoxes([smallAmt, largeAmt]);
                    console.log("Available boxes:", [smallAmt, largeAmt]);
                }
            } catch (err) {
                console.error("Lỗi khi lấy số lượng tủ:", err);
            }
        }

        fetchBoxes();

        const interval=setInterval(fetchBoxes, Data.Timer.checkAvlBoxPing*1000);

        return()=>{
            isMounted=false;
            clearInterval(interval);
        }
    }, [location.pathname]);

    // Khi mount, load dữ liệu từ context
    useEffect(function () {
        startTimer();
        if (order.sizeIndex !== undefined && Data.Lockers[order.sizeIndex]) {
            setSizeIndex(order.sizeIndex);
            setSizeLetter(Data.Lockers[order.sizeIndex].size);
            setRentalTime(order.rentalTime);
            setMaxRentalTime(order.maxRentalTime);
        }
        if (order.discountCode) {
            // Giả sử bạn đã lưu discount trước đó
            setDiscount(order.discountCode || 0); // nếu lưu giá trị discount trong context
        }
        console.log(isValidTime);
    }, []);

    // Tự động tính toán subtotal, tax, total khi các giá trị thay đổi
    useEffect(function () {
        if (order.sizeIndex === undefined) return; // tránh chạy khi context chưa sẵn sàng

        const currentLocker = Data.Lockers[order.sizeIndex];
        if (!currentLocker) return;

        let newSubTotal = 0;
        let newUnitPrice = 0;

        if (isValidTime) {
            if (maxRentalTime > 0 && maxRentalTime <= Data.Promotion.rentalTime) {
                newUnitPrice = 0;
                newSubTotal = Data.Promotion.lockers[order.sizeIndex].price;
            }
            else if (maxRentalTime > Data.Promotion.rentalTime) {
                newUnitPrice = currentLocker.price;
                newSubTotal = newUnitPrice * maxRentalTime;
            }

        }

        const newTax = Data.TaxIndex * newSubTotal;
        const newTotal = newSubTotal + newTax + discount;

        setUnitPrice(newUnitPrice);
        setSubTotal(newSubTotal);
        setTax(newTax);
        setTotal(newTotal);

        setOrder(prev => ({
            ...prev,
            subTotal: newSubTotal,
            discount,
            rentalTime: rentalTime,
            maxRentalTime: maxRentalTime,
            tax: newTax,
            total: newTotal,
        }));

    }, [unitPrice, rentalTime, maxRentalTime, discount, sizeIndex, isValidTime]);

    useEffect(function () {
        // console.log(isValidForm());
        if (isValidForm()) {
            setIsDisabledSubmit(false);
        }
        else {
            setIsDisabledSubmit(true);
        }
    }, [order.fullName, order.email, order.mobile, order.maxRentalTime, order.rentalTime, order.sizeIndex, isAgreement]);


    function changeOtherMethod(e) {
        e.preventDefault();
        setShowMobile(!showMobile);
    }

    function changeButton({ group, index }) {
        if (group == "grpSize") {
            setSizeLetter(Data.Lockers[index].size);
            setUnitPrice(Data.Lockers[index].price);
            setSizeIndex(index);
            setOrder((order) => ({ ...order, sizeIndex: index }));
        }
    }

    function getDiscount({ discountPrice }) {
        setDiscount(discountPrice);

    }

    function getFullNameValue(value) {
        setOrder(prev => ({ ...prev, fullName: value }));
    }

    function getMobileValue(value) {
        setOrder(prev => ({ ...prev, mobile: value }));
    }

    function getEmailValue(value) {
        setOrder(prev => ({ ...prev, email: value }));
    }

    function getDiscountCode(value) {
        setOrder(prev => ({ ...prev, discountCode: value }));
    }

    function getInOutTime(checkIn, checkOut) {
        setOrder(prev => ({
            ...prev,
            checkIn: checkIn,
            checkOut: checkOut
        }))

    }

    function isValidForm() {
        const hasName = order.fullName?.trim() !== "";
        const hasValidEmail = order.email?.trim() !== "" && validator.isEmail(order.email);
        const hasValidMobile = order.mobile?.trim() !== "" && validator.isMobilePhone(order.mobile, "vi-VN");
        const hasSize = order.sizeIndex != undefined;

        const validContact = hasValidEmail || hasValidMobile;
        return hasName && validContact && isAgreement && isValidTime && hasSize;
    }

    function handleBooking(e) {
        e.preventDefault();
        navigate("/ConfirmCheckIn");
    }


    return (
        <>
            <Header link="/" isBackEnable={true}></Header>
            <section>
                <form>
                    <div className="fieldset-columns">
                        <div className="col">
                            <fieldset className="group">
                                <legend>{Languages[lang].legendRenter}</legend>
                                <div className="fieldset-content mb-3">
                                    <TextInput
                                        label={Languages[lang].labelRenterName}
                                        type="text"
                                        transmitData={getFullNameValue}
                                        value={order.fullName || ""}></TextInput>
                                    <AnimatePresence mode="wait">
                                        {showMobile ? (
                                            <Transition.SwipeLeft key="mobile">
                                                <TextInput
                                                    label={Languages[lang].labelRenterPhone}
                                                    type="tel"
                                                    transmitData={getMobileValue}
                                                    value={order.mobile || ""}></TextInput>
                                            </Transition.SwipeLeft>
                                        ) : (
                                            <Transition.SwipeLeft key="email">
                                                <TextInput
                                                    label={Languages[lang].labelRenterEmail}
                                                    type="email"
                                                    transmitData={getEmailValue}
                                                    value={order.email || ""}></TextInput>
                                            </Transition.SwipeLeft>
                                        )}
                                    </AnimatePresence>

                                </div>
                                <a onClick={changeOtherMethod}>{showMobile == false ? Languages[lang].btnSignUpViaMobile : Languages[lang].btnSignUpViaEmail}</a>
                            </fieldset>
                            <fieldset className="group">
                                <legend>{Languages[lang].legendLocker}</legend>
                                <ButtonList
                                    arrayList={Data.Lockers}
                                    topic={Languages[lang].labelChooseSize}
                                    group="grpSize"
                                    changeButton={changeButton}
                                    savedSelectedIndex={order.sizeIndex}
                                    amountList={availableBoxes}></ButtonList>
                                <RentalTime topic={Languages[lang].labelRentalTime}
                                    arrayList={Languages[lang].rentalTimeChoices}
                                    getRentalTime={setRentalTime}
                                    getMaxRentalTime={setMaxRentalTime}
                                    getInOutTime={getInOutTime}
                                    getIsValidTime={setIsValidTime}></RentalTime>
                            </fieldset>
                        </div>
                        <div className="col double">
                            <fieldset className="group" style={{ flex: 1 }}>
                                <legend>{Languages[lang].legendOrder}</legend>

                                <div className="section-box">
                                    <div className="columns is-mobile">
                                        <div className="column is-two-third has-text-weight-semibold">
                                            <p className="title is-6 ">{`${Languages[lang].labelLockerSize}`}</p>
                                        </div>
                                        <div className="column has-text-right">
                                            <p className="subtitle is-6 has-text-right">{`${Languages[lang].sizeUnit} ${sizeLetter}`}</p>
                                        </div>

                                    </div>
                                    <div className="columns is-mobile">
                                        <div className="column is-two-third has-text-weight-semibold">
                                            <p className="title is-6 ">
                                                <span>{Languages[lang].labelRentalTimeOrder}</span>
                                                <span className="has-text-danger"> *</span>
                                            </p>
                                        </div>
                                        <div className="column has-text-right">
                                            <p className="subtitle is-6 has-text-right">
                                                {`${rentalTime} ${Languages[lang].rentalTimeUnit}`}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="columns is-mobile">
                                        <div className="column is-two-third has-text-weight-semibold">
                                            <p className="title is-6 ">
                                                <span>{Languages[lang].labelMaxRentalTimeOrder}</span>
                                                <span className="has-text-danger">*</span>
                                            </p>
                                        </div>
                                        <div className="column has-text-right">
                                            <p className="subtitle is-6 has-text-right">
                                                {`${maxRentalTime} ${Languages[lang].rentalTimeUnit}`}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                                <DiscountPart
                                    getDiscountPrice={getDiscount}
                                    transmitData={getDiscountCode}
                                    savedValue={order.discountCode || ""}></DiscountPart>

                                <div className="section-box">
                                    <div className="columns is-mobile">
                                        <div className="column is-two-third has-text-weight-semibold">
                                            <p className="title is-6">{Languages[lang].labelSubTotal}</p>
                                        </div>
                                        <div className="column has-text-right">
                                            <p className="subtitle is-6 has-text-right">{CurrencyFormat(subTotal)}</p>
                                        </div>
                                    </div>
                                    <div className="columns is-mobile">
                                        <div className="column is-two-third has-text-weight-semibold">
                                            <p className="title is-6">{Languages[lang].labelDiscount}</p>
                                        </div>
                                        <div className="column has-text-right">
                                            <p className="subtitle is-6 has-text-right">{CurrencyFormat(discount)}</p>
                                        </div>

                                    </div>
                                    <div className="columns is-mobile">
                                        <div className="column is-two-third has-text-weight-semibold">
                                            <p className="title is-6">{Languages[lang].labelTax}</p>
                                        </div>
                                        <div className="column has-text-right">
                                            <p className="subtitle is-6 has-text-right">{CurrencyFormat(tax)}</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="section-box">
                                    <div className="columns is-mobile">
                                        <div className="column is-two-third has-text-weight-semibold">
                                            <p className="title is-5">{Languages[lang].labelTotal}</p>
                                        </div>
                                        <div className="column has-text-right">
                                            <p className="subtitle is-5 has-text-right is-bold">{CurrencyFormat(total)}</p>
                                        </div>
                                    </div>
                                    <div className="columns is-mobile">
                                        <div className="column">
                                            <Checkbox isChecked={isAgreement} onChange={setIsAgreement}>
                                                <span>{Languages[lang].msgConfirm[0]} </span>
                                                <span><strong>{Languages[lang].msgConfirm[1]} </strong></span>
                                                <span>{Languages[lang].msgConfirm[2]} </span>
                                                <span>
                                                    <a onClick={showMsg}>{Languages[lang].msgConfirm[3]} </a>
                                                </span>
                                                <span>{Languages[lang].msgConfirm[4]} </span>
                                            </Checkbox>
                                        </div>

                                    </div>
                                    <div className="columns is-mobile">
                                        <div className="column">
                                            <button className="button is-warning is-rounded is-fullwidth"
                                                disabled={isDisabledSubmit}
                                                onClick={handleBooking}
                                            >
                                                <span className="icon">
                                                    <i className="fa-solid fa-warehouse"></i>
                                                </span>
                                                <span>{Languages[lang].btnReservation}</span>
                                            </button>
                                        </div>
                                    </div>

                                    <div className={`modal ${isShowMsg ? "is-active" : ""} is-primary`}>
                                        <div className="modal-background" onClick={() => setShowMsg(false)}></div>
                                        <div className="modal-card">
                                            <header className="modal-card-head has-background-warning">
                                                <p className="modal-card-title">{Languages[lang].terms.title}</p>
                                                <button className="delete has-background-warning-dark" aria-label="close"
                                                    onClick={(e) => { e.preventDefault(); setShowMsg(false) }}></button>
                                            </header>
                                            <section className="modal-card-body has-background-warning-light">
                                                {Languages[lang].terms.contents.map(function (e, i) {
                                                    return (
                                                        <div className="content" key={"p" + i}>
                                                            <p className="chapter-title">{e.chapter}</p>
                                                            <ul>
                                                                {e.content.map(function (subE, subI) {
                                                                    //Trường hợp Điều 4, đầu dòng 2 có chia mục con thì phát sinh lệnh này
                                                                    if (i == 3 && subI == 2 || i == 4 && subI % 2 != 0) {
                                                                        let smallArr = new Array();

                                                                        smallArr.push(subE.map(function (smallSubE, smallSubI) {
                                                                            return (
                                                                                <li key={"x" + smallSubI}>{smallSubE}</li>
                                                                            );
                                                                        }));
                                                                        return (<ol key={"z" + subI}>
                                                                            {smallArr}
                                                                        </ol>);
                                                                    }
                                                                    else
                                                                        return (
                                                                            <li key={"s" + subI}>{subE}</li>

                                                                        );
                                                                })}
                                                            </ul>
                                                        </div>

                                                    );
                                                })}
                                            </section>
                                        </div>
                                    </div>
                                </div>
                            </fieldset>
                        </div>

                    </div>
                    <div className="content">

                        <p className="title is-6 has-text-weight-bold">{Languages[lang].notes.title}</p>
                        <ul>
                            {
                                Languages[lang].notes.content.map(function (e, i) {
                                    return (
                                        <li key={i}>{e}</li>
                                    );
                                })
                            }
                        </ul>

                    </div>

                </form>
            </section>

        </>
    )
}

export default SendParcel;