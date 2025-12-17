import { useTranslation } from "react-i18next";
import LockerRadio from "./LockerRadio";
import { useContext, useState, useMemo } from "react";
import DatePicker from "./DatePicker.jsx";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { Stack } from "@mui/material";
import { InitialDataContext } from "../../data/InitialDataContext.jsx";

export default function ChooseLocker() {
    const { t, i18n } = useTranslation();
    const { getLockersInfo, getALockerBySize } = useContext(InitialDataContext);

    const lockerPriceList = useMemo(() => {
        const result = getLockersInfo();
        console.log(result);
        return result;
    }, [getLockersInfo]);

    return (

        <div className="h-full flex flex-col">
            <h2 className="title-font sm:text-2xl text-xl font-medium text-gray-900 mb-5 text-left">
                Chọn tủ
            </h2>
            <h3 class="mb-2 text-left text-lg font-medium text-gray-900 ">Kích thước tủ</h3>
            <div className="flex gap-3 mb-5">
                {
                    lockerPriceList?.map(function(e,index){
                        return(<LockerRadio key={index} title={`${t("sizeUnit")} ${e.size}`} sizeDesc={t("sizeDescription."+index)} amount="2" name="locker"
                        ></LockerRadio>);
                    })
                }
            </div>
            <h3 className="mb-3 text-left text-lg font-medium text-gray-900 ">Thời gian thuê</h3>
            <ul class="w-full bg-white border border-default rounded-base rounded-lg">
                <li class="w-full border-b border-default">
                    <div class="flex items-center ps-3">
                        <input id="list-radio-license"
                            type="radio"
                            value={1}
                            name="rentalOption"
                            className="w-4 h-4 text-neutral-primary border-default-medium bg-neutral-secondary-medium rounded-full 
                        checked:border-brand 
                        focus:ring-2 focus:outline-none focus:ring-brand-subtle border border-default appearance-none"/>
                        <label for="list-radio-license"
                            className="w-full py-3 select-none ms-2 text-base font-medium text-heading text-left">Giá dùng thử: 4 giờ</label>
                    </div>
                </li>
                <li class="w-full ">
                    <div class="flex items-center ps-3">
                        <input id="list-radio-id"
                            type="radio" value={2}
                            name="rentalOption"
                            className="w-4 h-4 text-neutral-primary border-default-medium bg-neutral-secondary-medium rounded-full checked:border-brand focus:ring-2 focus:outline-none focus:ring-brand-subtle border border-default appearance-none" />
                        <label for="list-radio-id"
                            className="w-full py-3 select-none ms-2 text-base font-medium text-heading text-left">Chọn giờ lấy hàng</label>
                    </div>
                </li>
            </ul>

            <div className="w-full mt-2 mb-5">
                <LocalizationProvider dateAdapter={AdapterDayjs}
                    adapterLocale={i18n.language === "vi-VN" ? "vi" : "en"}>
                    <Stack spacing={1}>
                        <DatePicker
                            label={t("labelCheckInTime")}
                            // value={startDate}
                            isDisabled={true}
                            isTimeValid={true}
                            timeAlert=""
                        // onChange={v => setStartDate(v)}
                        />
                        <DatePicker
                            label={t("labelCheckOutTime")}
                            // value={endDate}
                            disablePast={true}
                        // isDisabled={selectedValue.rentalTimeChoices === 0}
                        // onChange={handleEndDateChange}
                        // isTimeValid={isTimeValid}
                        // timeAlert={timeAlert}
                        />
                    </Stack>
                </LocalizationProvider>
            </div>
            <h3 className="mb-2 text-left text-lg font-medium text-gray-900 ">Phương thức thanh toán</h3>
            <ul class="items-center w-full text-sm font-medium text-heading bg-neutral-primary-soft border border-default rounded-lg sm:flex">
                <li class="w-full border-b border-default sm:border-b-0 sm:border-r">
                    <div class="flex items-center ps-3">
                        <input id="horizontal-list-radio-license" type="radio" value="" name="list-radio" class="w-4 h-4 text-neutral-primary border-default-medium bg-neutral-secondary-medium rounded-full checked:border-brand focus:ring-2 focus:outline-none focus:ring-brand-subtle border border-default appearance-none" />
                        <label for="horizontal-list-radio-license" class="w-full py-3 select-none ms-2 text-sm font-medium text-heading">Quét mã</label>
                    </div>
                </li>
                <li class="w-full border-b border-default sm:border-b-0 sm:border-r">
                    <div class="flex items-center ps-3">
                        <input id="horizontal-list-radio-id" type="radio" value="" name="list-radio" class="w-4 h-4 text-neutral-primary border-default-medium bg-neutral-secondary-medium rounded-full checked:border-brand focus:ring-2 focus:outline-none focus:ring-brand-subtle border border-default appearance-none" />
                        <label for="horizontal-list-radio-id" class="w-full py-3 select-none ms-2 text-sm font-medium text-heading">Zalo Pay</label>
                    </div>
                </li>
                <li class="w-full border-b border-default sm:border-b-0 sm:border-r">
                    <div class="flex items-center ps-3">
                        <input id="horizontal-list-radio-military" type="radio" value="" name="list-radio" class="w-4 h-4 text-neutral-primary border-default-medium bg-neutral-secondary-medium rounded-full checked:border-brand focus:ring-2 focus:outline-none focus:ring-brand-subtle border border-default appearance-none" />
                        <label for="horizontal-list-radio-military" class="w-full py-3 select-none ms-2 text-sm font-medium text-heading">Tap thẻ</label>
                    </div>
                </li>
            </ul>
        </div>
    );
}