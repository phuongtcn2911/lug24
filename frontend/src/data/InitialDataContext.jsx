import { createContext, useEffect, useState } from "react";
import api from "../config/axios";

export const InitialDataContext = createContext();

export function InitialDataProvider({ children }) {
    const [priceList, setPriceList] = useState([]);
    const [campus, setCampus] = useState(null);
    const [vouchers, setVouchers]=useState([]);
    const [availableBoxes,setAvailableBoxes]=useState([]);
    const [loading, setLoading] = useState(true);


    function saveToStorage(key, value) {
        localStorage.setItem(key, JSON.stringify(value));
    }

    function loadFromStorage(key) {
        const rawData = localStorage.getItem(key);
        return rawData ? JSON.parse(rawData) : null;
    }

    function filterTrialPrice(isTrial) {
        var items = priceList?.filter(function (e) {
            const priceID = e.PRICE_LIST_ID;
            return String(priceID).match(isTrial ? /^PP4H/ : /^PBUS/);
        }).map(function (e) {
            return {
                priceID: e.PRICE_LIST_ID,
                size: e.SIZE,
                price: e.UNIT_PRICE,
                tax: e.TAX_RATE
            }
        });
        return items;
    }

    function getLockersInfo() {
        var lockers = priceList?.reduce(function (storage, item) {
            const classifiedSize = item.SIZE;
            const index = storage.findIndex(function (item) { return item.size === classifiedSize; })

            if (index === -1) {
                storage.push({
                    size: classifiedSize,
                    availableBoxes:0,
                    priceInfo: []
                });
            }

            storage[storage.length - 1].priceInfo.push({
                priceID: item.PRICE_LIST_ID,
                unitPrice: item.UNIT_PRICE,
                tax: item.TAX_RATE,
                timeAllowance: String(item.PRICE_LIST_ID).startsWith("PBUS") ? 1 : 4,
            });

            const amt=availableBoxes.find(function(item){
                return item.SIZE===classifiedSize;
            })?.AMOUNT;

            storage[storage.length-1].availableBoxes=amt;

            return storage;
        }, []);
        return lockers;
    }

    function getALockerBySize(size) {
        var locker = priceList?.reduce(function (storage, item) {
            const classifiedSize = item.SIZE;

            if (classifiedSize === size) {
                storage.priceInfo.push({
                    priceID: item.PRICE_LIST_ID,
                    unitPrice: item.UNIT_PRICE,
                    tax: item.TAX_RATE,
                    timeAllowance: String(item.PRICE_LIST_ID).startsWith("PBUS") ? 1 : 4,
                });
            }

            return storage;
        }, { size: size, priceInfo: [] });
        return locker;
    }

    function getLockerPriceInfo(isTrial, size) {
        var items = priceList?.filter(function (e) {
            return String(e.PRICE_LIST_ID).match(isTrial ? /^PP4H/ : /^PBUS/) && e.SIZE === size;
        }).map(function () {
            return {
                priceID: e.PRICE_LIST_ID,
                size: e.SIZE,
                price: e.UNIT_PRICE,
                tax: e.TAX_RATE
            }
        });
    }

    async function initData() {
        try {
            setLoading(true);
            let localPrice = loadFromStorage("priceList");
            let localCampus = loadFromStorage("campus");
            let localAvailableBoxes=loadFromStorage("availableBoxes");
            let localVouchers=loadFromStorage("vouchers");

            const isExistLocal =    Array.isArray(localPrice) && localPrice.length > 0 && 
                                    Array.isArray(localCampus) && localCampus.length > 0&&
                                    Array.isArray(localAvailableBoxes) && localAvailableBoxes.length > 0&&
                                    Array.isArray(localVouchers) && localVouchers.length > 0;


            if (isExistLocal) {
                setPriceList(localPrice);
                setCampus(localCampus);
                setAvailableBoxes(localAvailableBoxes);
                setVouchers(localVouchers);
                // console.log("Local tồn tại:", { localPrice, localCampus,localAvailableBoxes });
                return;
            }

            const res = await api.get("/api/getInitialData");
            localPrice = res.data?.data?.priceList || [];
            localCampus = res.data?.data?.campus?.[0] || [];
            localAvailableBoxes=res.data?.data?.availableLockers||[];
            localVouchers=res.data?.data?.vouchers||[];
            

            // console.log("API trả về:", { localPrice, localCampus,localAvailableBoxes });

            setPriceList(localPrice);
            setCampus(localCampus);
            setAvailableBoxes(localAvailableBoxes);
            setVouchers(localVouchers);

            saveToStorage("priceList", localPrice);
            saveToStorage("campus", localCampus);
            saveToStorage("availableBoxes",localAvailableBoxes);
            saveToStorage("vouchers",localVouchers);

        } catch (err) {
            console.log("Khởi tạo toàn trang thất bại", err);
        } finally{
            setLoading(false);
        }
    }

    useEffect(() => {
        initData();
    }, []);

    function getUnitPriceByPriceListID(priceListID){
        if(!priceList.length)return 0;
        const priceItem=priceList.find(function(item){
            return item.PRICE_LIST_ID===priceListID;
        })
        const price=priceItem?priceItem.UNIT_PRICE:0;
        return price;
    }
     function getTaxRateByPriceListID(priceListID){
        if(!priceList.length)return 0;
        const priceItem=priceList.find(function(item){
            return item.PRICE_LIST_ID===priceListID;
        })
        const taxRate=priceItem?priceItem.TAX_RATE:0;
        return taxRate;
    }

    function resetInitialData() {
        localStorage.removeItem("priceList");
        localStorage.removeItem("campus");
        localStorage.removeItem("availableBoxes");
        localStorage.removeItem("vouchers");
        initData();
    }

    return (
        <InitialDataContext.Provider value={{ 
            priceList, campus,vouchers,loading, 
            setPriceList, setCampus, setVouchers,resetInitialData, filterTrialPrice, 
            getLockerPriceInfo, getLockersInfo, getALockerBySize,
            getUnitPriceByPriceListID,getTaxRateByPriceListID}}>{children}</InitialDataContext.Provider>
    );



}