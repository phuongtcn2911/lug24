import { useContext, useEffect, useMemo, useState, useRef } from "react";
import { OrderContext } from "../data/OrderContext.jsx";
import { InitialDataContext } from "../data/InitialDataContext.jsx";
import { TimerContext } from "../data/TimerContext.jsx";
import ButtonList from "../components/InputForm/ButtonList.jsx";
import TextInput from "../components/InputForm/TextInput.jsx";
import DiscountPart from "../components/InputForm/DiscountPart.jsx";
import * as Data from "../data/Data.js";
import { Header } from "../components/ExtraPart/Header.jsx";
import { useTranslation } from "react-i18next";
import { AnimatePresence } from "framer-motion";
import * as Transition from "../components/Transition.jsx";
import RentalTime from "../components/InputForm/RentalTime.jsx";
import CurrencyFormat from "../utils/CurrencyFormat.jsx";
import Checkbox from "../components/InputForm/CheckBox.jsx";


export default function SendParcel() {

    const { t } = useTranslation();

    /* ================= CONTEXT ================= */
    const { order, setOrder } = useContext(OrderContext);
    const { getLockersInfo } = useContext(InitialDataContext);
    const { startTimer } = useContext(TimerContext);

    /* ================= LOCAL STATE ================= */
    const [showMobile, setShowMobile] = useState(true);
    const [availableBoxes, setAvailableBoxes] = useState([]);
    const [isValidTime, setIsValidTime] = useState(true);
    const [isShowMsg, setShowMsg] = useState(false);
    const [isAgreement, setIsAgreement] = useState(false);
    const [isScrollEnd, setIsScrollEnd] = useState(false);
    const contentRef = useRef(null);

    /* ================= DATA DERIVED (NO STATE) ================= */

    // Danh sách tủ đã gom nhóm theo size
    const lockerList = useMemo(() => {
        return getLockersInfo() || [];
    }, [getLockersInfo]);

    // Tủ đang được chọn
    const currentLocker = useMemo(() => {
        if (order.locker.sizeIndex == null) return null;
        return lockerList[order.locker.sizeIndex];
    }, [lockerList, order.locker.sizeIndex]);

    // Giá đang được chọn (theo thời gian thuê)
    const selectedPriceInfo = useMemo(() => {
        if (!currentLocker) return null;
        if (order.order.rentalTimeChoice == null) return null;
        return currentLocker.priceInfo[order.order.rentalTimeChoice];
    }, [currentLocker, order.order.rentalTimeChoice]);

    /* ================= PRICING ================= */

    const pricing = useMemo(() => {
        if (!selectedPriceInfo || !isValidTime) {
            return { subTotal: 0, tax: 0, total: 0 };
        }

        const subTotal =
            selectedPriceInfo.unitPrice * order.order.maxRentalTime;

        const tax = subTotal * selectedPriceInfo.tax;

        return {
            subTotal,
            tax,
            total: subTotal + tax - order.order.discountPrice
        };
    }, [
        selectedPriceInfo,
        order.order.maxRentalTime,
        order.order.discountPrice,
        isValidTime
    ]);

    // Đẩy giá vào order (1 nguồn duy nhất)
    useEffect(() => {
        setOrder(prev => ({
            ...prev,
            order: {
                ...prev.order,
                ...pricing
            }
        }));
    }, [pricing, setOrder]);

    /* ================= HANDLERS ================= */

    // Chọn size tủ
    function changeButton({ group, index, info }) {
        if (group !== "grpSize") return;

        setOrder(prev => ({
            ...prev,
            locker: {
                ...prev.locker,
                sizeIndex: index,
                sizeLetter: info.size
            }
        }));
    }

    // Chọn thời gian thuê → GÁN priceListID TẠI ĐÂY
    function getRentalTimeChoice(choiceIndex) {
        if (!currentLocker?.priceInfo?.[choiceIndex]) return;

        const selected = currentLocker.priceInfo[choiceIndex];

        setOrder(prev => ({
            ...prev,
            order: {
                ...prev.order,
                rentalTimeChoice: choiceIndex,
                priceListID: selected.priceID
            }
        }));
    }

    // Nhận thời gian in / out
    function getInOutTime(checkIn, checkOut, finalCheckOut) {
        setOrder(prev => ({
            ...prev,
            order: {
                ...prev.order,
                checkIn,
                checkOut,
                finalCheckOut
            }
        }));
    }

    // Nhận discount
    function getDiscount({ discountPrice }) {
        setOrder(prev => ({
            ...prev,
            order: {
                ...prev.order,
                discountPrice
            }
        }));
    }

    function getDiscountCode(value) {
        setOrder(prev => ({
            ...prev,
            order: {
                ...prev.order,
                discountCode: value
            }
        }));
    }

    function showMsg(e) {
        e.preventDefault();
        setShowMsg(true);
    }

    function changeOtherMethod(e) {
        e.preventDefault();
        setShowMobile(prev => !prev);
    }

    function getFullNameValue(value) {
        setOrder(prev => ({
            ...prev,
            customer: {
                ...prev.customer,
                fullName: value
            }
        }));
    }

    function getMobileValue(value) {
        setOrder(prev => ({
            ...prev,
            customer: { ...prev.customer, mobile: value, email: "" }
        }));
    }

    function getEmailValue(value) {
        setOrder(prev => ({
            ...prev,
            customer: { ...prev.customer, email: value, mobile: "" }
        }));
    }

    // RentalTime component callback
    function setRentalTime(value) {
        setOrder(prev => ({
            ...prev,
            order: { ...prev.order, rentalTime: value }
        }));
    }

    function setMaxRentalTime(value) {
        setOrder(prev => ({
            ...prev,
            order: { ...prev.order, maxRentalTime: value }
        }));
    }

    /* ================= VALIDATION ================= */

    function isValidForm() {
        const { customer, locker, order: ord } = order;

        const hasName = customer.fullName?.trim();
        const hasContact = customer.email || customer.mobile;
        const hasLocker = locker.sizeIndex != null;
        const hasPriceID = !!ord.priceListID;

        return (
            hasName &&
            hasContact &&
            hasLocker &&
            hasPriceID &&
            isValidTime
        );
    }

    /* ================= EFFECTS ================= */

    useEffect(() => {
        startTimer();
    }, [startTimer]);

    /* ========= VIEW DATA ========= */
    const sizeLetter = order.locker.sizeLetter;
    const rentalTime = order.order.rentalTime;
    const maxRentalTime = order.order.maxRentalTime;
    const subTotal = order.order.subTotal;
    const tax = order.order.tax;
    const discount = order.order.discountPrice;
    const total = order.order.total;

    const isDisabledSubmit =
        !order.customer.fullName ||
        (!order.customer.email && !order.customer.mobile) ||
        !order.order.priceListID ||
        !isValidTime;

    function handleBooking(e) {
        e.preventDefault();
        console.log("ORDER SUBMIT:", order);
    }

    /* ================= RENDER ================= */

    return (
        <>
            <Header link="/" isBackEnable={true}></Header>
            <section>
                <form>
                    <div className="fieldset-columns">
                        <div className="col">
                            <fieldset className="group">
                                <legend>{t("legendRenter")}</legend>
                                <div className="fieldset-content mb-3">
                                    <TextInput
                                        label={t("labelRenterName")}
                                        type="text"
                                        transmitData={getFullNameValue}
                                        value={order.customer.fullName || ""}></TextInput>
                                    <AnimatePresence mode="wait">
                                        {showMobile ? (
                                            <Transition.SwipeLeft key="mobile">
                                                <TextInput
                                                    label={t("labelRenterPhone")}
                                                    type="tel"
                                                    transmitData={getMobileValue}
                                                    value={order.customer.mobile || ""}></TextInput>
                                            </Transition.SwipeLeft>
                                        ) : (
                                            <Transition.SwipeLeft key="email">
                                                <TextInput
                                                    label={t("labelRenterEmail")}
                                                    type="email"
                                                    transmitData={getEmailValue}
                                                    value={order.customer.email || ""}></TextInput>
                                            </Transition.SwipeLeft>
                                        )}
                                    </AnimatePresence>

                                </div>
                                <a onClick={changeOtherMethod}>{showMobile == false ? t("btnSignUpViaMobile") : t("btnSignUpViaEmail")}</a>
                            </fieldset>
                            <fieldset className="group">
                                <legend>{t("legendLocker")}</legend>
                                <ButtonList
                                    arrayList={getLockersInfo()}
                                    topic={t("labelChooseSize")}
                                    group="grpSize"
                                    changeButton={changeButton}
                                    savedSelectedIndex={order.locker.sizeIndex}
                                    amountList={availableBoxes}></ButtonList>
                                <RentalTime topic={t("labelRentalTime")}
                                    arrayList={t("rentalTimeChoices", { returnObjects: true })}
                                    getRentalTime={setRentalTime}
                                    getMaxRentalTime={setMaxRentalTime}
                                    getInOutTime={getInOutTime}
                                    getIsValidTime={setIsValidTime}
                                    getChoice={getRentalTimeChoice}></RentalTime>
                            </fieldset>
                        </div>
                        <div className="col double">
                            <fieldset className="group" style={{ flex: 1 }}>
                                <legend>{t("legendOrder")}</legend>

                                <div className="section-box">
                                    <div className="columns is-mobile">
                                        <div className="column is-two-third has-text-weight-semibold">
                                            <p className="title is-6 ">{`${t("labelLockerSize")}`}</p>
                                        </div>
                                        <div className="column has-text-right">
                                            <p className="subtitle is-6 has-text-right">{`${t("sizeUnit")} ${sizeLetter}`}</p>
                                        </div>

                                    </div>
                                    <div className="columns is-mobile">
                                        <div className="column is-two-third has-text-weight-semibold">
                                            <p className="title is-6 ">
                                                <span>{t("labelRentalTimeOrder")}</span>
                                                <span className="has-text-danger"> *</span>
                                            </p>
                                        </div>
                                        <div className="column has-text-right">
                                            <p className="subtitle is-6 has-text-right">
                                                {`${rentalTime} ${t("rentalTimeUnit")}`}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="columns is-mobile">
                                        <div className="column is-two-third has-text-weight-semibold">
                                            <p className="title is-6 ">
                                                <span>{t("labelMaxRentalTimeOrder")}</span>
                                                <span className="has-text-danger">*</span>
                                            </p>
                                        </div>
                                        <div className="column has-text-right">
                                            <p className="subtitle is-6 has-text-right">
                                                {`${maxRentalTime} ${t("rentalTimeUnit")}`}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                                <DiscountPart
                                    getDiscountPrice={getDiscount}
                                    transmitData={getDiscountCode}
                                    savedValue={order.order.discountCode || ""}></DiscountPart>

                                <div className="section-box">
                                    <div className="columns is-mobile">
                                        <div className="column is-two-third has-text-weight-semibold">
                                            <p className="title is-6">{t("labelSubTotal")}</p>
                                        </div>
                                        <div className="column has-text-right">
                                            <p className="subtitle is-6 has-text-right">{CurrencyFormat(subTotal)}</p>
                                        </div>
                                    </div>
                                    <div className="columns is-mobile">
                                        <div className="column is-two-third has-text-weight-semibold">
                                            <p className="title is-6">{t("labelDiscount")}</p>
                                        </div>
                                        <div className="column has-text-right">
                                            <p className="subtitle is-6 has-text-right">{CurrencyFormat(discount)}</p>
                                        </div>

                                    </div>
                                    <div className="columns is-mobile">
                                        <div className="column is-two-third has-text-weight-semibold">
                                            <p className="title is-6">{t("labelTax")}</p>
                                        </div>
                                        <div className="column has-text-right">
                                            <p className="subtitle is-6 has-text-right">{CurrencyFormat(tax)}</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="section-box">
                                    <div className="columns is-mobile">
                                        <div className="column is-two-third has-text-weight-semibold">
                                            <p className="title is-5">{t("labelTotal")}</p>
                                        </div>
                                        <div className="column has-text-right">
                                            <p className="subtitle is-5 has-text-right is-bold">{CurrencyFormat(total)}</p>
                                        </div>
                                    </div>

                                    <div className="columns is-mobile">
                                        <div className="column">
                                            <button className="button is-warning is-rounded is-fullwidth"
                                                disabled={isDisabledSubmit}
                                                onClick={showMsg}
                                            >
                                                <span className="icon">
                                                    <i className="fa-solid fa-warehouse"></i>
                                                </span>
                                                <span>{t("btnReservation")}</span>
                                            </button>
                                        </div>
                                    </div>

                                    <div className={`modal ${isShowMsg ? "is-active" : ""} is-primary`}>
                                        <div className="modal-background" onClick={() => setShowMsg(false)}></div>
                                        <div className="modal-card">
                                            <header className="modal-card-head has-background-warning">
                                                <p className="modal-card-title">{t("terms.title")}</p>
                                                <button className="delete has-background-warning-dark" aria-label="close"
                                                    onClick={(e) => { e.preventDefault(); setShowMsg(false) }}></button>
                                            </header>
                                            <section ref={contentRef} className="modal-card-body has-background-warning-light">

                                                {t("terms.contents", { returnObjects: true }).map(function (e, i) {
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
                                            <footer className="modal-card-foot" style={{ flexDirection: "column", alignItems: "stretch" }}>
                                                <div className="block">
                                                    <Checkbox isChecked={isAgreement} onChange={setIsAgreement} disabled={!isScrollEnd}>
                                                        <span>{t("msgConfirm.0")} </span>
                                                        <span><strong>{t("msgConfirm.1")} </strong></span>
                                                        <span>{t("msgConfirm.2")} </span>
                                                        <span><strong>{t("msgConfirm.3")}</strong> </span>
                                                        <span>{t("msgConfirm.4")} </span>
                                                    </Checkbox>

                                                </div>

                                                <button className="button is-warning is-rounded"
                                                    disabled={!isAgreement}
                                                    onClick={handleBooking}
                                                >
                                                    <span className="icon">
                                                        <i class="fa-solid fa-clipboard-check"></i>
                                                    </span>
                                                    <span>{t("btnConfirm")}</span>
                                                </button>


                                            </footer>
                                        </div>
                                    </div>
                                </div>
                            </fieldset>
                        </div>

                    </div>
                    <div className="content">

                        <p className="title is-6 has-text-weight-bold">{t("notes.title")}</p>
                        <ul>
                            {
                                t("notes.content", { returnObjects: true }).map(function (e, i) {
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
    );
}
