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

    async function initData() {
        try {
            let localPrice = loadFromStorage("priceList");
            let localCampus = loadFromStorage("campus");

            const isExistLocal = Array.isArray(localPrice) && localPrice.length > 0 && Array.isArray(localCampus) && localCampus.length > 0;


            if (isExistLocal) {
                setPriceList(localPrice);
                setCampus(localCampus);
                console.log("Local tồn tại:", { localPrice, localCampus });
                return;
            }

            const res = await api.get("/api/getInitialData");
            localPrice = res.data?.data?.priceList || [];
            localCampus = res.data?.data?.campus || [];

            console.log("API trả về:", { localPrice, localCampus });

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
        <InitialDataContext.Provider value={{ priceList, campus, setPriceList, setCampus, resetInitialData }}>{children}</InitialDataContext.Provider>
    );



}