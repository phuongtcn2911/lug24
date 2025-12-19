import { useTranslation } from "react-i18next";
import DatePicker from "./DatePicker.jsx";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { Stack } from "@mui/material";
import { useContext, useEffect, useState } from "react";
import dayjs from "dayjs";
import "dayjs/locale/vi";
import "dayjs/locale/en";
import { InitialDataContext } from "../../data/InitialDataContext.jsx";
import { OrderContext } from "../../data/OrderContext.jsx";

export default function RentalTime() {
    const { t, i18n } = useTranslation();
    const items = t("rentalTimeChoices", { returnObjects: true });
    const { order, setOrder, updateOrder } = useContext(OrderContext);
    const { campus, loading } = useContext(InitialDataContext);
    const [workingTime, setWorkingTime] = useState({
        open: dayjs(),
        closed: dayjs()
    });

    const [isTimeValid, setIsTimeValid] = useState(true);
    const [timeAlert, setTimeAlert] = useState("");
    const [chooseRentalChoices, setChooseRentalChoices] = useState([true, true]);


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


    useEffect(() => { console.log(draft) }, [draft]);

    useEffect(() => {
        if (!campus) return;
        setWorkingTime({
            open: dayjs(String(campus[0]?.OPEN_TIME), "HH:mm:ss"),
            closed: dayjs(String(campus[0]?.CLOSE_TIME), "HH:mm:ss")
        });
    }, [campus]);

    useEffect(() => {
        if (!workingTime.open || !workingTime.closed) return;

        let opt = order?.order.rentalTimeChoice !== undefined ? order.order.rentalTimeChoice : draft.order.rentalTimeChoice;
        console.log("opt lúc khởi tạo: ",opt);
        const hourChoices = [4, 6];
        let rentalTime = hourChoices[opt];

        const startDate = order?.order.checkIn ? dayjs(order.order.checkIn) : roundDate();
        let predictEnd = order?.order.checkOut ? dayjs(order.order.checkOut) : startDate.add(rentalTime, "hour");
        let choiceList = [true, true];

        if (isOutWorkingTime(predictEnd)) {
            opt =1;
            rentalTime = hourChoices[opt];
            choiceList[opt] = false;
            predictEnd = calcEndDate(startDate, rentalTime);
        }

        let endDate = predictEnd;

        console.log(choiceList);
        console.log("Chọn cái option: ",opt);

        setChooseRentalChoices(choiceList);

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

        // updateOrder("order", "rentalTimeChoice", opt);
        // updateOrder("order", "rentalTime", rentalTime);
        // updateOrder("order", "checkIn", startDate);
        // updateOrder("order", "checkOut", endDate);
    }, [workingTime]);

    useEffect(() => {
        if (!draft.order.checkOut) return;
        if (!isOutWorkingTime(draft.order.checkOut)) {
            setIsTimeValid(true);
            setTimeAlert("");
        }
    }, [draft.order.checkOut])



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
        const minute = timeValue.minute();
        const open = workingTime.open;
        const closed = workingTime.closed;

        const beforeOpen = hour < open.hour() || (hour === open.hour() && minute < open.minute());
        const afterClosed = hour > closed.hour() || (hour === closed.hour() && minute > closed.minute());
        return beforeOpen || afterClosed;
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
                checkIn: startDate,
                checkOut: endDate,
            }
        }));

        updateOrder("order", "rentalTimeChoice", opt);
        updateOrder("order", "rentalTime", rentalTime);
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

        // Update draft
        setDraft(prev => ({
            ...prev,
            order: {
                ...prev.order,
                checkOut: roundedEnd,
                rentalTime: duration
            }
        }));

        // Sync OrderContext
    
        updateOrder("order","rentalTime",duration);
        updateOrder("order","checkOut",roundedEnd);
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
            <ul class="w-full bg-white border border-default rounded-base rounded-lg">
                {
                    items?.map(function (item, key) {
                        return (
                            <li key={"item" + key}
                                className={`w-full ${key == 0 ? "border-b border-default" : ""}`}>
                                <div className={`flex items-center ps-3 `}>
                                    <input
                                        id={`rentalChoice_${key}`}
                                        type="radio"
                                        value={key}
                                        checked={order.order.rentalTimeChoice === key||draft.order.rentalTimeChoice===key}
                                        disabled={chooseRentalChoices[key]}
                                        name="order.rentalTimeChoice"
                                        onChange={changeRentalOpt}
                                        className={`w-4 h-4  border-default-medium bg-neutral-secondary-medium rounded-full 
                                                    checked:border-brand 
                                                    focus:ring-2 focus:outline-none focus:ring-brand-subtle border border-default appearance-none
                                                    ${chooseRentalChoices[key] ? "cursor-not-allowed opacity-50 text-gray-300" : "text-gray-500"}`} />
                                    <label
                                        for={`rentalChoice_${key}`}
                                        className={`w-full py-3 select-none ms-2 text-base font-medium text-heading text-left
                                        ${chooseRentalChoices[key] ? "cursor-not-allowed opacity-50 text-gray-300" : "text-gray-500"}`}>{item}</label>
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