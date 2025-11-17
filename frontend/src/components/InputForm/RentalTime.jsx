import { useContext, useEffect, useState, useRef } from "react";
import RadioButton from "./RadioButton";
import DatePicker from "./DatePicker.jsx";
import { LanguageContext } from "../../data/LanguageContext.jsx";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import { Stack } from "@mui/material";
import { OrderContext } from "../../data/OrderContext.jsx";
import { WorkingTime, Promotion } from "../../data/Data.js";

export default function RentalTime({
  arrayList,
  topic,
  getMaxRentalTime,
  getRentalTime,
  getInOutTime,
  getIsValidTime,
}) {
  const { lang, Languages } = useContext(LanguageContext);
  const { order, setOrder } = useContext(OrderContext);

  const [selectedValue, setSelectedValue] = useState({ rentalTimeChoices: 0 });
  const [startDate, setStartDate] = useState(roundStartDate());
  const [rentalTime, setRentalTime] = useState(Promotion.rentalTime); // default 4h
  const [maxRentalTime, setMaxRentalTime] = useState(Promotion.rentalTime);
  const [endDate, setEndDate] = useState(startDate.add(rentalTime, "hour"));
  const [timeAlert, setTimeAlert] = useState("");
  const [isTimeValid, setIsTimeValid] = useState(true);

  const hasInit = useRef(false);

  // --- Utils ---
  function roundMaxRentalTime(hours) {
    if (hours <= 6) return 6;
    if (hours <= 12) return 12;
    if (hours <= 24) return 24;
    return 48;
  }

  function calcEndDate(start, duration) {
    let end = start.add(duration, "hour");
    if (isOutWorkingTime(end)) {
      const nextOpen = getNextOpenDay(start);
      end = nextOpen.add(duration, "hour");
    }
    return end;
  }

  function roundStartDate() {
    let now = dayjs();
    const roundMinutes = Math.ceil(now.minute() / 15) * 15;
    return now.set("minute", roundMinutes).set("second", 0);
  }

  function getNextOpenDay(date) {
    let nextOpen = date
      .set("hour", WorkingTime.open.hour())
      .set("minute", WorkingTime.open.minute())
      .set("second", 0);
    if (!nextOpen.isAfter(date)) nextOpen = nextOpen.add(1, "day");
    return nextOpen;
  }

  function isOutWorkingTime(timeValue) {
    const hour = timeValue.hour();
    const minute = timeValue.minute();
    const open = WorkingTime.open;
    const closed = WorkingTime.closed;
    const beforeOpen = hour < open.hour() || (hour === open.hour() && minute < open.minute());
    const afterClosed = hour > closed.hour() || (hour === closed.hour() && minute > closed.minute());
    return beforeOpen || afterClosed;
  }

  // --- Init khi load page ---
  useEffect(() => {
    if (!order || hasInit.current) return;
    hasInit.current = true;

    let initStart = order.startDate ? dayjs(order.startDate) : roundStartDate();
    let initRental = Promotion.rentalTime; // default 4h
    let initChoice = 0; // 0 = standard, 1 = custom
    let initEnd = initStart.add(initRental, "hour");

    if (isOutWorkingTime(initEnd)) {
      // recommend custom
      initChoice = 1;
      initRental = 6;
      initStart = getNextOpenDay(initStart); // start at next open
      initEnd = initStart.add(initRental, "hour");
    }

    const initMax = roundMaxRentalTime(initRental);

    setStartDate(initStart);
    setRentalTime(initRental);
    setMaxRentalTime(initMax);
    setEndDate(initEnd);
    setSelectedValue({ rentalTimeChoices: initChoice });

    // đồng bộ orderContext
    setOrder(prev => ({
      ...prev,
      startDate: initStart.toISOString(),
      rentalTime: initRental,
      maxRentalTime: initMax,
      finalEndDate: initStart.add(initMax, "hour").toISOString(),
    }));

    getRentalTime(initRental);
    getMaxRentalTime(initMax);
    getInOutTime(initStart, initEnd, initStart.add(initMax, "hour"));
    getIsValidTime(true);
  }, [order]);

  // --- Khi user thay đổi radio ---
  const changeValue = (groupName, value) => {
    let newRental = value === 0 ? 4 : 6;
    let newStart = startDate;
    let newEnd = calcEndDate(newStart, newRental);
    let newMax = roundMaxRentalTime(newRental);

    setSelectedValue(prev => ({ ...prev, [groupName]: value }));
    setRentalTime(newRental);
    setMaxRentalTime(newMax);
    setEndDate(newEnd);
    setStartDate(newStart);
    setIsTimeValid(!isOutWorkingTime(newEnd));
    setTimeAlert(isOutWorkingTime(newEnd) ? Languages[lang].alertRentalTime[1] : "");

    // đồng bộ orderContext
    setOrder(prev => ({
      ...prev,
      startDate: newStart.toISOString(),
      rentalTime: newRental,
      maxRentalTime: newMax,
      finalEndDate: newStart.add(newMax, "hour").toISOString(),
    }));

    getRentalTime(newRental);
    getMaxRentalTime(newMax);
    getInOutTime(newStart, newEnd, newStart.add(newMax, "hour"));
    getIsValidTime(!isOutWorkingTime(newEnd));
  };

  // --- Khi user thay đổi endDate trực tiếp ---
  const handleEndDateChange = newValue => {
    if (!newValue || !newValue.isValid()) return;

    let valid = !isOutWorkingTime(newValue) && newValue.isAfter(startDate);
    let duration = newValue.diff(startDate, "hour", true);
    const roundedMax = roundMaxRentalTime(duration);

    setEndDate(newValue);
    setRentalTime(duration);
    setMaxRentalTime(roundedMax);
    setIsTimeValid(valid);
    setTimeAlert(valid ? "" : Languages[lang].alertRentalTime[1]);

    // đồng bộ orderContext
    setOrder(prev => ({
      ...prev,
      rentalTime: duration,
      maxRentalTime: roundedMax,
      finalEndDate: startDate.add(roundedMax, "hour").toISOString(),
    }));

    getRentalTime(duration);
    getMaxRentalTime(roundedMax);
    getInOutTime(startDate, newValue, startDate.add(roundedMax, "hour"));
    getIsValidTime(valid);
  };

  return (
    <div className="field">
      <label className="label">{topic}</label>
      {arrayList.map((label, index) => (
        <div className="field" key={index}>
          <RadioButton
            label={label}
            value={index}
            selectedValue={selectedValue}
            onChange={changeValue}
            groupName="rentalTimeChoices"
          />
        </div>
      ))}
      <div className="container mt-5">
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <Stack spacing={3}>
            <DatePicker
              label={Languages[lang].labelCheckInTime}
              value={startDate}
              isDisabled={true}
              isTimeValid={true}
              timeAlert=""
              onChange={v => setStartDate(v)}
            />
            <DatePicker
              label={Languages[lang].labelCheckOutTime}
              value={endDate}
              disablePast={true}
              isDisabled={selectedValue.rentalTimeChoices === 0}
              onChange={handleEndDateChange}
              isTimeValid={isTimeValid}
              timeAlert={timeAlert}
            />
          </Stack>
        </LocalizationProvider>
      </div>
    </div>
  );
}
