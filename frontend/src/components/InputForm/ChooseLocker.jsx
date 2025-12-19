import { useTranslation } from "react-i18next";
import LockerRadio from "./LockerRadio";
import { useContext, useState, useMemo, useEffect } from "react";


import { InitialDataContext } from "../../data/InitialDataContext.jsx";
import PaymentMethods from "../ExtraPart/PaymentMethods.jsx";
import RentalTime from "./RentalTime.jsx";
import { OrderContext } from "../../data/OrderContext.jsx";

export default function ChooseLocker() {
    const { t, i18n } = useTranslation();
    const [lockerPriceList, setLockerPriceList] = useState([]);
    const { priceList, getLockersInfo, loading } = useContext(InitialDataContext);
    const { order, setOrder,updateOrder } = useContext(OrderContext);
    const [ draft, setDraft ] = useState({
        locker: {
            id: "",
            sizeIndex: "",
            sizeLetter: ""
        },
        order: {
            priceListID: "",
            id: "",
            subId: "",
            rentalTimeChoice: "",
            rentalTime: "",
            maxRentalTime: "",
            checkIn: "",
            checkOut: "",
            finalCheckOut: "",
            discountCodes: [],
            discountPrice: 0,
            subTotal: 0,
            tax: 0,
            total: 0
        }
    });
   
    useEffect(() => {
        if (priceList.length > 0) {
            setLockerPriceList(getLockersInfo());
        }
    }, [priceList]);

    useEffect(() => {
        console.log(lockerPriceList);
        
    }, [lockerPriceList]);

    function changeSize(e){
        const [group,indexField,letterField]=e.target.name.split(".");
        const amount=e.target.availableBoxes;
        let sizeLetter=null;
        let sizeIndex=null;
        
        if(amount!==0){
            sizeLetter=e.target.value;

            if(sizeLetter=="S")sizeIndex=1;
            else if(sizeLetter=="M")sizeIndex=2;
            else if(sizeLetter=="L")sizeIndex=3;
            else if(sizeLetter=="XL")sizeIndex=4;
        }


        updateOrder(group,letterField,e.target.value);
        updateOrder(group,indexField,sizeIndex);

        setDraft(prev=>({
            ...prev,
            locker:{
                ...prev.locker,
                sizeIndex,
                sizeLetter
            }
        }));
    }

    useEffect(()=>{console.log(draft)},[draft]);



    return (

        <div className="h-full flex flex-col">
            <h2 className="title-font sm:text-2xl text-xl font-medium text-gray-900 mb-5 text-left">
                {t("headerChooseLocker")}
            </h2>
            <h3 class="mb-2 text-left text-lg font-medium text-gray-900 ">{t("labelLockerSize")}</h3>
            <div className="flex gap-3 mb-5">
                {
                    loading ?
                        <span class="loading loading-dots loading-xl"></span>
                        :
                        lockerPriceList?.map(function (e, index) {
                            return (
                                <LockerRadio
                                    key={index}
                                    name="locker.sizeIndex.sizeLetter"
                                    title={`${t("sizeUnit")} ${e.size}`}
                                    sizeDesc={t("sizeDescription." + index)}
                                    amount={e.availableBoxes}
                                    value={e.size}
                                    checked={draft.locker.sizeLetter===e.size||order.locker.sizeLetter===e.size}                                    
                                    onChange={changeSize}
                                    disabled={e.availableBoxes===0?true:false}
                                ></LockerRadio>);
                        })
                }
            </div>
            <RentalTime></RentalTime>
            <PaymentMethods></PaymentMethods>
        </div>
    );
}