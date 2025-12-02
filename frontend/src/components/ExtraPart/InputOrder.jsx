import { useState } from "react";
import { InputOrderCode } from "../../data/Data";
import { useTranslation } from "react-i18next";
export function InputOrder() {

    const [error, setError] = useState("");
    const [value, setValue] = useState("");
    const { t, i18n } = useTranslation();



    function checkError(e) {
        let text = e.target.value;
        if (text.length === 0) {
            setError("Mã đặt tủ không được để trống. Xem mã đặt tủ trong email/zalo");
        }
        else if (text.length < 9) {
            setError("Mã đặt tủ gồm 9 kí tự có dạng LUG000000");
        }
        else {
            setError("");
        }

    }


    return (
        <div className="h-full bg-white tab-content block p-4 content-center">
            <img src={InputOrderCode} className="object-cover w-96 mx-auto my-4" alt="inputCode"  ></img>
            <div className="relative w-96 mx-auto">
                <input
                    type="text"
                    value={value}
                    onChange={(e) => {setValue(e.target.value);checkError(e);}}
                   
                    onFocus={(e)=>setValue(e.target.value)}
                    maxLength={9}
                    placeholder={t("plchldInputCodeID")}
                    className={`peer block transition-all duration-200
                        text-xl w-96 rounded-lg px-4 mx-auto mt-3 mb-1 placeholder-gray-500 
                        border border-gray-300
                        border-t border-l border-r border-gray-300
                        focus:ring-0 focus:outline-none
                        focus:h-16
                        focus:placeholder-transparent
                        ${value ? "h-16 pt-2 uppercase font-semibold" : "h-12 pt-2"}
                        ${error ? "border-b-4 border-b-red-600" : "border-b-1 border-b-gray-300"}`}
                />
                <label className={`absolute left-3 top-2 text-emerald-500 text-xs transition-all pointer-events-none
                peer-focus:opacity-100 peer-focus:top-2 peer-focus:left-4
                ${value ?
                        "top-2 left-4 opacity-100"
                        :
                        "top-5 left-10 opacity-0"
                    }`}
                >{t("orderInfo.0")}</label>
                <p className="text-xs text-red-500 italic mb-3 text-left mx-4">{error}</p>
            </div>

            <button
                className={`w-72  py-2 my-2 rounded-lg text-white
                ${!error?"bg-yellow-400":"bg-gray-300  cursor-not-allowed"} `}>
                {t("btnSendOTP")}
            </button>
        </div>
    );
}