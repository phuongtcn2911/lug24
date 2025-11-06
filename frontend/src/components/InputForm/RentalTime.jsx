import { useContext, useEffect, useRef, useState } from "react";
import RadioButton from "./RadioButton";
import DatePicker from "./DatePicker.jsx";
import { LanguageContext } from "../../data/LanguageContext.jsx";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import { Stack } from "@mui/material";
import { OrderContext } from "../../data/OrderContext.jsx";
import { WorkingTime, Promotion } from "../../data/Data.js";

export default function RentalTime({ arrayList, topic, getMaxRentalTime, getRentalTime, getInOutTime, getIsValidTime }) {
    const [selectedValue, setSelectedValue] = useState({ rentalTimeChoices: 0 });
    const { lang, Languages } = useContext(LanguageContext);
    const [rentalTime, setRentalTime] = useState(Promotion.rentalTime);
    const [maxRentalTime, setMaxRentalTime] = useState(Promotion.rentalTime);
    const [startDate, setStartDate] = useState(roundStartDate());
    const [endDate, setEndDate] = useState(startDate.add(rentalTime, "hour"));
    const [finalEndDate, setFinalEndDate] = useState(startDate.add(maxRentalTime, "hour"));
    const { order, setOrder } = useContext(OrderContext);
    const [timeAlert, setTimeAlert] = useState("");
    const [isTimeValid, setIsTimeValid] = useState(false);
    const hasInit = useRef(false);

    // --- useEffect khởi tạo từ orderContext
    useEffect(() => {
        if (!order || order.rentalTime == null || hasInit.current) return;
        hasInit.current = true;

        const startValue = order.startDate ? dayjs(order.startDate) : roundStartDate();
        let tempRentalTime = order.rentalTime || Promotion.rentalTime;
        let tempMaxRental = order.maxRentalTime || Promotion.rentalTime;
        let tempChoice = tempRentalTime <= Promotion.rentalTime ? 0 : 1;

        let tempEndValue = startValue.add(tempRentalTime, "hour");

        if (tempChoice === 0 && isOutWorkingTime(tempEndValue)) {
            tempChoice = 1;
            tempRentalTime = 6;
            tempMaxRental = 6;
            tempEndValue = startValue.add(tempRentalTime, "hour");

            if (isOutWorkingTime(tempEndValue)) {
                tempEndValue = getNextOpenDay(startValue);
            }
        }

        setSelectedValue({ rentalTimeChoices: tempChoice });
        setRentalTime(tempRentalTime);
        setMaxRentalTime(tempMaxRental);
        setStartDate(startValue);
        setEndDate(tempEndValue);
    }, [order]);

    // --- useEffect tính toán endDate khi rentalTimeChoices thay đổi
    useEffect(() => {
        if (!selectedValue) return;

        const startValue = order.startDate ? dayjs(order.startDate) : roundStartDate();
        let tempEndValue = startValue.add(rentalTime, "hour");

        if (selectedValue.rentalTimeChoices === 1 && isOutWorkingTime(tempEndValue)) {
            tempEndValue = getNextOpenDay(tempEndValue);
        }

        setEndDate(tempEndValue);
        if (isOutWorkingTime(tempEndValue)) {
            setIsTimeValid(false);
            setTimeAlert(Languages[lang].alertRentalTime[1]);
        } else {
            setIsTimeValid(true);
            setTimeAlert("");
        }
    }, [selectedValue]);

    // --- useEffect đồng bộ rentalTime & maxRentalTime vào OrderContext
    useEffect(() => {
        getRentalTime(rentalTime);
        getMaxRentalTime(maxRentalTime);

        setOrder(prev => ({
            ...prev,
            rentalTime,
            maxRentalTime,
        }));
    }, [rentalTime, maxRentalTime]);

    // --- useEffect đồng bộ startDate, endDate, isTimeValid
    useEffect(() => {
        getInOutTime(startDate, endDate,finalEndDate);
        getMaxRentalTime(maxRentalTime);
        getIsValidTime(isTimeValid);
    }, [startDate, endDate, selectedValue, maxRentalTime, isTimeValid]);

    // --- useEffect mới: tự động tính finalEndDate = startDate + maxRentalTime
    useEffect(() => {
        if (!startDate || !maxRentalTime) return;

        const newFinalEndDate = startDate.add(maxRentalTime, "hour");
        setFinalEndDate(newFinalEndDate);

        setOrder(prev => ({
            ...prev,
            finalEndDate: newFinalEndDate,
        }));
    }, [startDate, maxRentalTime]);

    const changeValue = (groupName, value) => {
        setSelectedValue(prev => ({ ...prev, [groupName]: value }));

        const rental = value === 0 ? 4 : 6;
        const maxRental = rental;
        const newEnd = startDate.add(rental, "hour");

        setRentalTime(rental);
        setMaxRentalTime(maxRental);
        setEndDate(newEnd);

        if (newEnd.isBefore(startDate)) {
            setIsTimeValid(false);
            setTimeAlert(Languages[lang].alertRentalTime[0]);
        } else if (isOutWorkingTime(newEnd)) {
            setIsTimeValid(false);
            setTimeAlert(Languages[lang].alertRentalTime[1]);
        } else {
            setIsTimeValid(true);
            setTimeAlert("");
        }
    };

    function handleEndDateChange(newValue) {
        if (!newValue || !newValue.isValid()) return;

        if (newValue.isBefore(startDate)) {
            setIsTimeValid(false);
            setTimeAlert(Languages[lang].alertRentalTime[0]);
        } else if (isOutWorkingTime(newValue)) {
            setIsTimeValid(false);
            setTimeAlert(Languages[lang].alertRentalTime[1]);
        } else {
            setIsTimeValid(true);
            setTimeAlert("");
        }
        setEndDate(newValue);
    }

    function getNextOpenDay(date) {
        let nextOpenDay = date
            .set("hour", WorkingTime.open.hour())
            .set("minute", WorkingTime.open.minute())
            .set("second", 0);

        if (nextOpenDay.isBefore(date) || nextOpenDay.isSame(date)) {
            nextOpenDay = nextOpenDay.add(1, "day");
        }
        return nextOpenDay;
    }

    function roundStartDate() {
        let now = dayjs();
        const roundMinutes = Math.ceil(now.minute() / 15) * 15;
        now = now.set("minute", roundMinutes).set("second", 0);
        return now;
    }

    function isOutWorkingTime(timeValue, isOutTime = 0) {
        if (!timeValue || !timeValue.isValid()) return false;

        const hour = timeValue.hour();
        const minute = timeValue.minute();
        const open = WorkingTime.open;
        const closed = WorkingTime.closed;

        const beforeOpen = hour < open.hour() || (hour === open.hour() && minute < open.minute());
        const afterClosed = hour > closed.hour() || (hour === closed.hour() && minute > closed.minute());

        if (isOutTime === 1) return beforeOpen;
        if (isOutTime === 2) return afterClosed;

        return beforeOpen || afterClosed;
    }

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
                        <div className="field">
                            <DatePicker
                                label={Languages[lang].labelCheckInTime}
                                isDisabled={true}
                                value={startDate}
                                onChange={(newValue) => setStartDate(newValue)}
                                isTimeValid={true}
                                timeAlert={""}
                            />
                        </div>
                        <div className="field">
                            <DatePicker
                                label={Languages[lang].labelCheckOutTime}
                                value={endDate}
                                disablePast={true}
                                isDisabled={selectedValue.rentalTimeChoices === 0}
                                onChange={handleEndDateChange}
                                shouldDisableTime={false}
                                isTimeValid={isTimeValid}
                                timeAlert={timeAlert}
                            />
                        </div>
                    </Stack>
                </LocalizationProvider>
            </div>
        </div>
    );
}


// import { useContext, useEffect, useRef, useState } from "react";
// import RadioButton from "./RadioButton";
// import DatePicker from "./DatePicker.jsx";
// import { LanguageContext } from "../../data/LanguageContext.jsx";
// import { LocalizationProvider } from "@mui/x-date-pickers";
// import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
// import dayjs from "dayjs";
// import { Stack } from "@mui/material";
// import { OrderContext } from "../../data/OrderContext.jsx";
// import { WorkingTime } from "../../data/Data.js"
// import { Promotion } from "../../data/Data.js";


// export default function RentalTime({ arrayList, topic, getMaxRentalTime, getRentalTime, getInOutTime, getIsValidTime }) {
//     const [selectedValue, setSelectedValue] = useState({ rentalTimeChoices: 0 });
//     const { lang, Languages } = useContext(LanguageContext);
//     const [rentalTime, setRentalTime] = useState(Promotion.rentalTime);
//     const [maxRentalTime, setMaxRentalTime] = useState(Promotion.rentalTime);
//     const [startDate, setStartDate] = useState(roundStartDate());
//     const [endDate, setEndDate] = useState(startDate.add(rentalTime, "hour"));
//     const [finalEndDate,setFinalEndDate]=useState(startDate.add(maxRentalTime,"hour"));
//     const { order, setOrder } = useContext(OrderContext);
//     const [timeAlert, setTimeAlert] = useState("");
//     const [isTimeValid, setIsTimeValid] = useState(false);
//     const hasInit = useRef(false);


//     useEffect(() => {
//         if (!order || order.rentalTime == null || hasInit.current) return;

//         hasInit.current = true;

//         const startValue = order.startDate ? dayjs(order.startDate) : roundStartDate();
//         let tempRentalTime = order.rentalTime || Promotion.rentalTime;
//         let tempMaxRental = order.maxRentalTime || Promotion.rentalTime;
//         let tempChoice = tempRentalTime <= Promotion.rentalTime ? 0 : 1;

//         let tempEndValue = startValue.add(tempRentalTime, "hour");

//         if (tempChoice === 0 && isOutWorkingTime(tempEndValue)) {
//             tempChoice = 1;
//             tempRentalTime = 6;
//             tempMaxRental = 6;
//             tempEndValue = startValue.add(tempRentalTime, "hour");

//             if (isOutWorkingTime(tempEndValue)) {
//                 tempEndValue = getNextOpenDay(startValue);
//             }
//         }

//         setSelectedValue({rentalTimeChoices: tempChoice});

//         setRentalTime(tempRentalTime);
//         setMaxRentalTime(tempMaxRental);
//         setStartDate(startValue);
//         setEndDate(tempEndValue);
        

//         if (isOutWorkingTime(tempEndValue)) {
//             setIsTimeValid(false);
//             setTimeAlert(Languages[lang].alertRentalTime[1]);
//         } else {
//             setIsTimeValid(true);
//             setTimeAlert("");
//         }
//     }, [order]);

//     useEffect(function () {
//         if (selectedValue == null) return;
//         const startValue = order.startDate ? dayjs(order.startDate) : roundStartDate();
//         let tempEndValue = startValue.add(rentalTime, "hour");

//         if (selectedValue.rentalTimeChoices === 1&& isOutWorkingTime(tempEndValue)) {

//             if (isOutWorkingTime(tempEndValue)) {
//                    tempEndValue = getNextOpenDay(tempEndValue);
//             }

//             setEndDate(tempEndValue);

//             if (isOutWorkingTime(tempEndValue)) {
//                 setIsTimeValid(false);
//                 setTimeAlert(Languages[lang].alertRentalTime[1]);
//             } else {
//                 setIsTimeValid(true);
//                 setTimeAlert("");
//             }
//         }
//     }, [selectedValue]);

//     useEffect(function () {
//         console.log(rentalTime);
//         getRentalTime(rentalTime);
//         getMaxRentalTime(maxRentalTime)
//         if (order.rentalTime !== rentalTime) {
//             setOrder(prev => ({
//                 ...prev,
//                 rentalTime: rentalTime,
//                 maxRentalTime: maxRentalTime,
//             }));
//         }
//     }, [rentalTime, maxRentalTime]);

//     // Tự động tính rentalTime mỗi khi startDate hoặc endDate thay đổi
//     useEffect(function () {
//         if (endDate) {
//             if (isTimeValid === true) {
//                 if (selectedValue.rentalTimeChoices === 1) {
//                     const totalMinutes = endDate.diff(startDate, "minute");
//                     console.log(totalMinutes);
//                     const hours = Math.round(totalMinutes / 60);
//                     setRentalTime(hours);

//                     const remainderHour = hours % 12;
//                     let roundedRemainderHour = 0;
//                     if (remainderHour == 0) roundedRemainderHour = remainderHour;
//                     else if (remainderHour > 1 && remainderHour <= 6) roundedRemainderHour = 6;
//                     else roundedRemainderHour = 12;
//                     const maxStorageHours = Math.floor(hours / 12) * 12 + roundedRemainderHour;
//                     setMaxRentalTime(maxStorageHours);
//                 }
//                 else {
//                     setRentalTime(Promotion.rentalTime);
//                     setMaxRentalTime(Promotion.rentalTime);
//                 }
//             }
//             else {
//                 setRentalTime(0);
//                 setMaxRentalTime(0);
//             }
//         }
//         getInOutTime(startDate, endDate);
//         getMaxRentalTime(maxRentalTime);
//         getIsValidTime(isTimeValid);
//     }, [startDate, endDate, selectedValue]);

//     // Hàm tiện ích tính ngày mở cửa tiếp theo
//     function getNextOpenDay(date) {
//         let nextOpenDay = date
//             .set("hour", WorkingTime.open.hour())
//             .set("minute", WorkingTime.open.minute())
//             .set("second", 0);

//         if (nextOpenDay.isBefore(date) || nextOpenDay.isSame(date)) {
//             nextOpenDay = nextOpenDay.add(1, "day");
//         }

//         console.log("Next open day calculated:", nextOpenDay.format());
//         return nextOpenDay;
//     }

//     //Cách làm tròn thời gian lên mốc 15 phút
//     function roundStartDate() {
//         let now = dayjs();
//         const roundMinutes = Math.ceil(now.minute() / 15) * 15;
//         now = now.set("minute", roundMinutes);
//         now = now.set("second", 0);
//         return now;
//     }

//     const changeValue = (groupName, value) => {
//         setSelectedValue(prev => ({
//             ...prev,
//             [groupName]: value,
//         }));
//         const rentalTime = value == 0 ? 4 : 6;
//         const maxRentalTime = rentalTime;
//         const newEndDate = startDate.add(rentalTime, "hour");

//         setRentalTime(rentalTime);
//         setMaxRentalTime(maxRentalTime);
//         setEndDate(newEndDate);

//         if (newEndDate.isBefore(startDate)) {
//             setIsTimeValid(false);
//             setTimeAlert(Languages[lang].alertRentalTime[0]);
//         } else if (isOutWorkingTime(newEndDate)) {
//             setIsTimeValid(false);
//             setTimeAlert(Languages[lang].alertRentalTime[1]);
//         } else {
//             setIsTimeValid(true);
//             setTimeAlert("");
//         }

//         console.log("Rental Time: " + rentalTime);
//     };

//     function handleEndDateChange(newValue) {
//         if (!newValue || !newValue.isValid()) return;

//         const outOfWorkingStatus = isOutWorkingTime(newValue);

//         if (newValue.isBefore(startDate)) {
//             setIsTimeValid(false);
//             setTimeAlert(Languages[lang].alertRentalTime[0]);
//         }
//         else if (outOfWorkingStatus) {
//             setIsTimeValid(false);
//             setTimeAlert(Languages[lang].alertRentalTime[1]);
//         }
//         else {
//             setIsTimeValid(true);
//             setTimeAlert("");
//         }
//         setEndDate(newValue);
//     }


//     function isOutWorkingTime(timeValue, isOutTime = 0) {
//         if (!timeValue || !timeValue.isValid()) return false;
//         const hour = timeValue.hour();
//         const minute = timeValue.minute();

//         const open = WorkingTime.open;
//         const closed = WorkingTime.closed;

//         const beforeOpen = hour < open.hour() || hour === open.hour() && minute < open.minute();
//         const afterClosed = hour > closed.hour() || hour === closed.hour() && minute > closed.minute();

//         if (isOutTime === 1) {
//             return beforeOpen;
//         }
//         else if (isOutTime === 2) {
//             return afterClosed;
//         }

//         return beforeOpen || afterClosed;
//     }




//     // }


//     return (
//         <>
//             <div className="field">
//                 <label className="label">{topic}</label>

//                 {arrayList.map(function (label, index) {
//                     return (
//                         <div className="field" key={index}>
//                             <RadioButton label={label}
//                                 value={index}
//                                 selectedValue={selectedValue}
//                                 onChange={changeValue}
//                                 key={index}
//                                 groupName="rentalTimeChoices"
//                             ></RadioButton>
//                         </div>
//                     );
//                 })}

//                 {/* {selectedValue.rentalTimeChoices == 1 ? ( */}
//                 <div className="container mt-5" >
//                     <LocalizationProvider dateAdapter={AdapterDayjs}>
//                         <Stack spacing={3}>
//                             <div className="field">
//                                 <DatePicker
//                                     label={Languages[lang].labelCheckInTime}
//                                     isDisabled={true}
//                                     value={startDate}
//                                     onChange={(newValue) => setStartDate(newValue)}
//                                     isTimeValid={true}
//                                     timeAlert={""}
//                                 ></DatePicker>
//                             </div>
//                             <div className="field">
//                                 <DatePicker label={Languages[lang].labelCheckOutTime}
//                                     value={endDate}
//                                     disablePast={true}
//                                     isDisabled={selectedValue.rentalTimeChoices === 0}
//                                     // maxDateTime={dayjs().add(48, "hour").endOf("hour")}
//                                     onChange={handleEndDateChange}
//                                     shouldDisableTime={false}
//                                     isTimeValid={isTimeValid}
//                                     timeAlert={timeAlert}
//                                 ></DatePicker>
//                             </div>

//                         </Stack>


//                     </LocalizationProvider>

//                 </div>
//                 {/* ) : null} */}
//             </div>
//         </>
//     );
// }