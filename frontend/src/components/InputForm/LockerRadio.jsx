import { useContext, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { InitialDataContext } from "../../data/InitialDataContext";

export default function LockerRadio({ title, sizeDesc, amount, name, value, onChange, checked, disabled }) {
    const { t } = useTranslation();
    const [lockerPriceList, setLockerPriceList] = useState([]);
    const { priceList, getLockersInfo, loading } = useContext(InitialDataContext);

    useEffect(() => {
        if (priceList.length > 0) {
            setLockerPriceList(getLockersInfo());
        }
    }, [priceList]);

    return (
        <label
            className={`
                    flex-1 border rounded-lg p-4 select-none relative
                    backdrop-blur-xs bg-white/85
                    ${!disabled ? "cursor-pointer hover:border-yellow-500 peer-checked:border-yellow-600" :
                    "cursor-not-allowed opacity-50"
                }`}>
            <input type="radio"
                name={name}
                className="peer sr-only"
                value={value}
                onChange={onChange}
                checked={checked}
                disabled={disabled} />
            <div className="flex flex-col text-left">
                <span className="text-2xl font-bold text-gray-800">{title}</span>
                <span className="text-gray-400 text-sm">{sizeDesc}</span>
                <span className="mt-2 text-gray-800 text-sm font-medium">{`${t("labelAvailableBoxes")}: ${amount}`}</span>
            </div>
            {!disabled && (
                <i className={` absolute top-5 right-3 w-5 h-5 text-yellow-500 
                            fa-lg fa-solid fa-circle-check 
                            hidden peer-checked:block `}></i>
            )}
            <i className={` absolute top-5 right-3 w-5 h-5 text-yellow-500 
                            fa-lg far fa-circle 
                            ${!disabled ? "peer-checked:hidden" : ""}`}></i>
        </label>
    );

}