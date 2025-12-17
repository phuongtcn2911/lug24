import { createContext, useEffect, useState } from "react";
import api from "../config/axios";

export const InitialDataContext = createContext();

export function InitialDataProvider({ children }) {
    const [priceList, setPriceList] = useState([]);
    const [campus, setCampus] = useState([]);


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
            const classifiedSize=item.SIZE;
            const index=storage.findIndex(function(item)
            {return item.size===classifiedSize;})

            if (index===-1) {
                storage.push({
                    size:classifiedSize,
                    priceInfo:[]
                });
            }

            storage[storage.length-1].priceInfo.push({
                priceID: item.PRICE_LIST_ID,
                unitPrice: item.UNIT_PRICE,
                tax: item.TAX_RATE,
                timeAllowance: String(item.PRICE_LIST_ID).startsWith("PBUS") ? 1 : 4,
            });

            return storage;
        },[]);
        return lockers;
    }

    function getALockerBySize(size)
    {
        var locker=priceList?.reduce(function(storage,item){
            const classifiedSize=item.SIZE;

            if(classifiedSize===size){
                storage.priceInfo.push({
                    priceID:item.PRICE_LIST_ID,
                    unitPrice:item.UNIT_PRICE,
                    tax:item.TAX_RATE,
                    timeAllowance:String(item.PRICE_LIST_ID).startsWith("PBUS") ? 1 : 4,
                });
            }

            return storage;
        },{size:size,priceInfo:[]});
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
            let localPrice = loadFromStorage("priceList");
            let localCampus = loadFromStorage("campus");

            const isExistLocal = Array.isArray(localPrice) && localPrice.length > 0 && Array.isArray(localCampus) && localCampus.length > 0;


            if (isExistLocal) {
                setPriceList(localPrice);
                setCampus(localCampus);
                // console.log("Local tồn tại:", { localPrice, localCampus });
                return;
            }

            const res = await api.get("/api/getInitialData");
            localPrice = res.data?.data?.priceList || [];
            localCampus = res.data?.data?.campus || [];

            // console.log("API trả về:", { localPrice, localCampus });

            setPriceList(localPrice);
            setCampus(localCampus);

            saveToStorage("priceList", localPrice);
            saveToStorage("campus", localCampus);

        } catch (err) {
            console.log("Có vấn đề rồi:", err);
        }


    }

    useEffect(() => {

        initData();
    }, []);

    function resetInitialData() {
        localStorage.removeItem("priceList");
        localStorage.removeItem("campus");
        initData();
    }

    return (
        <InitialDataContext.Provider value={{ priceList, campus, setPriceList, setCampus, resetInitialData, filterTrialPrice, getLockerPriceInfo, getLockersInfo,getALockerBySize }}>{children}</InitialDataContext.Provider>
    );



}