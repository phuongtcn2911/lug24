import { useTranslation } from "react-i18next";
import DatePicker from "./DatePicker.jsx";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { Stack } from "@mui/material";
import { useContext, useEffect, useRef, useState } from "react";
import dayjs from "dayjs";

import "dayjs/locale/vi";
import "dayjs/locale/en";

import { InitialDataContext } from "../../data/InitialDataContext.jsx";
import { OrderContext } from "../../data/OrderContext.jsx";
// import { createPriceListID } from "./OrderForm.jsx";

export default function RentalTime() {
    const { t, i18n } = useTranslation();
    const items = t("rentalTimeChoices", { returnObjects: true });
    const { order, setOrder, updateOrder } = useContext(OrderContext);
    const { campus, loading } = useContext(InitialDataContext);
    const [workingTime, setWorkingTime] = useState({
        open: null,
        closed: null
    });
    const hasLoadFirstTime = useRef(false);

    const [isTimeValid, setIsTimeValid] = useState(true);
    const [timeAlert, setTimeAlert] = useState("");

    const [isPromoRentalChoice, setPromoRentalChoice] = useState(true);

    const [draft, setDraft] = useState({
        order: {
            rentalTimeChoice: 0,
            checkIn: null,
            checkOut: null,
            finalCheckOut: null,
            rentalTime: 0,
            maxRentalTime: 0
        }
    });

    useEffect(() => {
        if (!campus) return;
        setWorkingTime({
            open: parseTime(campus?.OPEN_TIME),
            closed: parseTime(campus?.CLOSE_TIME)
        });

    }, [campus]);

    // useEffect(() => {
    //     console.log("Khởi tạo giờ mở cửa: ", workingTime.open);
    //     console.log("Khởi tạo giờ đóng cửa: ", workingTime.closed);
    // }, [workingTime]);

    useEffect(() => {
        if (hasLoadFirstTime.current) return;
        if (!workingTime.open || !workingTime.closed) return;

        hasLoadFirstTime.current = true;

        let opt = order?.order.rentalTimeChoice !== undefined ? parseInt(order.order.rentalTimeChoice) : parseInt(draft.order.rentalTimeChoice);
        const hourChoices = [4, 6];
        let rentalTime = hourChoices[opt];
        console.log("rentalTime lúc khởi tạo: ", rentalTime);

        const startDate = order?.order.checkIn ? dayjs(order.order.checkIn) : roundDate();
        let predictEnd = startDate.add(rentalTime, "hour");
        // let predictEnd = order?.order.checkOut ? dayjs(order.order.checkOut) : startDate.add(rentalTime, "hour");
        console.log("Dự đoán ngày trả lúc khởi tạo: ", predictEnd);
        // let choiceList = [true, true];

        console.log("Có ngoài giờ không? ", isOutWorkingTime(predictEnd));


        if (isOutWorkingTime(predictEnd)) {
            opt = 1;
            rentalTime = hourChoices[opt];
            // choiceList[opt] = false;
            predictEnd = calcEndDate(startDate, rentalTime);
            setPromoRentalChoice(false);
            // console.log("Giờ thuê thực: ",rentalTime);
        }
        else {
            setPromoRentalChoice(true);
        }


        let endDate = !order?.order.checkOut?predictEnd:dayjs(order?.order.checkOut);
        let actualRentalTime = endDate.diff(startDate, "hour");
        rentalTime = rentalTime != actualRentalTime ? actualRentalTime : rentalTime;
       

        // console.log(choiceList);
        console.log("Chọn cái option: ", opt);

        // setChooseRentalChoices(choiceList);

        setDraft(prev => ({
            ...prev,
            order: {
                ...prev.order,
                rentalTimeChoice: opt,
                rentalTime,
                checkIn: startDate,
                checkOut: endDate
            }
        }));

        updateOrder("order", "rentalTimeChoice", opt);
        updateOrder("order", "rentalTime", rentalTime);
        updateOrder("order", "maxRentalTime",  roundMaxRentalTime(rentalTime));
        updateOrder("order", "checkIn", startDate);
        updateOrder("order", "checkOut", endDate);
        updateOrder("order", "finalCheckOut", endDate);

    }, [workingTime]);

    useEffect(() => {
        if (!draft.order.checkOut) return;
        if (!isOutWorkingTime(draft.order.checkOut)) {
            setIsTimeValid(true);
            setTimeAlert("");
        }
    }, [draft.order.checkOut]);




    //ULTILITES
    function roundDate(date = dayjs()) {
        const roundMinutes = Math.ceil(date.minute() / 15) * 15;
        const roundDate = date.set("minute", roundMinutes).set("second", 0);
        return roundDate;
    }

    function calcEndDate(start, duration) {
        let end = start.add(duration, "hour");
        if (isOutWorkingTime(end)) {
            const nextOpen = getNextOpenDay(start);
            end = nextOpen;
        }
        return end;
    }

    function getNextOpenDay(date) {
        let nextOpen = date
            .set("hour", workingTime.open.hour())
            .set("minute", workingTime.open.minute())
            .set("second", 0);
        if (!nextOpen.isAfter(date)) nextOpen = nextOpen.add(1, "day");
        return nextOpen;
    }

    function isOutWorkingTime(timeValue) {
        const hour = timeValue.hour();
        // console.log("Giờ dự đoán: ", hour);
        const minute = timeValue.minute();
        // console.log("Phút dự đoán: ", minute);
        const open = workingTime.open;
        // console.log("Giờ mở cửa: ", open);
        const closed = workingTime.closed;
        // console.log("Giờ đóng cửa: ", closed);

        const beforeOpen = hour < open.hour() || (hour === open.hour() && minute < open.minute());
        const afterClosed = hour > closed.hour() || (hour === closed.hour() && minute > closed.minute());
        return beforeOpen || afterClosed;
    }

    function parseTime(time) {
        const [hour, min, sec] = time.split(":").map(Number);
        const newTime = dayjs().set("hour", hour).set("minute", min).set("second", sec).set("millisecond", 0);
        return newTime;
    }

    function roundMaxRentalTime(hours) {
        // console.log("Trước khi làm tròn: ", hours);
        const fullRoundHour = Math.trunc(hours / 12);
        // console.log("Phần đủ: ", fullRoundHour);
        const remainedHour = hours % 12;
        // console.log("Phần dư: ", remainedHour);
        let roundedRemainedHour = 0;
        if (remainedHour === 0 || remainedHour === 4 || remainedHour === 6 || remainedHour === 12) {
            roundedRemainedHour = remainedHour;
        }
        else if (remainedHour < 6) {
            roundedRemainedHour = 6;
        }
        else {
            roundedRemainedHour = 12;
        }
        // console.log("Phần dư sau khi làm tròn: ", roundedRemainedHour);

        const totalHour = fullRoundHour * 12 + roundedRemainedHour;
        // console.log("Tổng: ", totalHour);
        return totalHour;
    }

    //HANDLER

    function changeRentalOpt(e) {
        const opt = parseInt(e.target.value);
        const rentalTime = opt === 0 ? 4 : 6;
        let startDate = roundDate();
        let endDate = calcEndDate(startDate, rentalTime);

        setDraft(prev => ({
            ...prev,
            order: {
                ...prev.order,
                rentalTimeChoice: opt,
                rentalTime: rentalTime,
                maxRentalTime: rentalTime,
                checkIn: startDate,
                checkOut: endDate,
            }
        }));


        updateOrder("order", "rentalTimeChoice", opt);
        updateOrder("order", "rentalTime", rentalTime);
        updateOrder("order", "maxRentalTime", rentalTime);
        updateOrder("order", "checkIn", startDate);
        updateOrder("order", "checkOut", endDate);
    }

    const handleEndDateChange = (newValue) => {
        if (!newValue || !newValue.isValid()) return;

        if (!draft.order.checkIn) return;

        const startDate = draft.order.checkIn;
        const roundedEnd = roundDate(newValue);

        // Không cho nhỏ hơn hoặc bằng check-in
        if (!roundedEnd.isAfter(startDate)) {
            setIsTimeValid(false);
            setTimeAlert(t("alertRentalTime.0"));
            return;
        }

        // Ngoài giờ làm việc
        if (isOutWorkingTime(roundedEnd)) {
            setIsTimeValid(false);
            setTimeAlert(t("alertRentalTime.1", {
                openHour: String(workingTime.open.hour()).padStart(2, "0"),
                openMinute: String(workingTime.open.minute()).padStart(2, "0"),
                closeHour: String(workingTime.closed.hour()).padStart(2, "0"),
                closeMinute: String(workingTime.closed.minute()).padStart(2, "0")
            }));
            return;
        }

        const duration = Math.ceil(roundedEnd.diff(startDate, "hour", true));

        setIsTimeValid(true);
        setTimeAlert("");

        const actualRentalTime = roundMaxRentalTime(duration);
        const finalCheckOut = startDate.add(actualRentalTime, "hour");

        // Update draft
        setDraft(prev => ({
            ...prev,
            order: {
                ...prev.order,
                checkOut: roundedEnd,
                rentalTime: duration,
                maxRentalTime: actualRentalTime,
                finalCheckOut: finalCheckOut
            }
        }));

        // Sync OrderContext

        updateOrder("order", "rentalTime", duration);
        updateOrder("order", "checkOut", roundedEnd);
        updateOrder("order", "maxRentalTime", actualRentalTime);
        updateOrder("order", "finalCheckOut", finalCheckOut);
    };

    function setDraftField(field, e) {
        setDraft(prev => ({
            ...prev,
            order: {
                ...prev.order,
                [field]: e.target.value
            }
        }))
    }

    return (
        <>
            <h3 className="mb-3 text-left text-lg font-medium text-gray-900 ">{t("labelRentalTimeOrder")}</h3>
            <ul class="w-full backdrop-blur-xs bg-white/85 border border-default rounded-base rounded-lg">
                {
                    items?.map(function (item, key) {
                        return (
                            <li key={"item" + key}
                                className={`w-full  ${key == 0 ? "border-b border-default" : ""}`}>
                                <div className={`flex items-center ps-3 `}>
                                    <input
                                        id={`rentalChoice_${key}`}
                                        type="radio"
                                        value={key}
                                        checked={order.order.rentalTimeChoice === key || draft.order.rentalTimeChoice === key}
                                        disabled={key == 0 ? !isPromoRentalChoice : false}
                                        name="order.rentalTimeChoice"
                                        onChange={changeRentalOpt}
                                        className={`w-4 h-4  border-default-medium  rounded-full 
                                                    checked:border-brand 
                                                    focus:ring-2 focus:outline-none focus:ring-brand-subtle border border-default appearance-none
                                                    ${key == 0 && !isPromoRentalChoice ? "cursor-not-allowed opacity-50 text-gray-300" : "text-gray-500"}
                                                    `} />

                                    {/* ${!chooseRentalChoices[key] ? "cursor-not-allowed opacity-50 text-gray-300" : "text-gray-500"} */}
                                    <label
                                        for={`rentalChoice_${key}`}
                                        className={`w-full py-3 select-none ms-2 text-base font-medium text-heading text-left 
                                            ${key == 0 && !isPromoRentalChoice ? "cursor-not-allowed opacity-50 text-gray-300" : "text-gray-500"}
                                        `}>{item}</label>

                                    {/* ${!chooseRentalChoices[key] ? "cursor-not-allowed opacity-50 text-gray-300" : "text-gray-500"} */}
                                </div>
                            </li>
                        );
                    })

                }
            </ul>
            <div className="w-full mt-5 mb-5">
                <LocalizationProvider dateAdapter={AdapterDayjs}
                    adapterLocale={i18n.language === "vi" ? "vi" : "en"}>
                    <Stack spacing={2}>
                        <DatePicker
                            label={t("labelCheckInTime")}
                            value={draft.order.checkIn}
                            isDisabled={true}
                            isTimeValid={true}
                            timeAlert=""
                        />
                        <DatePicker
                            label={t("labelCheckOutTime")}
                            value={draft.order.checkOut}
                            disablePast={true}
                            maxDateTime={dayjs().add(1, "year")}
                            isDisabled={draft.order.rentalTimeChoice === 0}
                            onChange={handleEndDateChange}
                            isTimeValid={isTimeValid}
                            timeAlert={timeAlert}
                        />
                    </Stack>
                </LocalizationProvider>
            </div>
        </>
    );
}