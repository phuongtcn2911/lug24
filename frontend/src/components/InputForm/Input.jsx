import { useTranslation } from "react-i18next";
import { useState } from "react";
import validator from "validator"

export default function Input({ id, name, label, type, placeholder, storeData, onBlur, disable = false, tabIndex = 0 }) {
    const { t, i18n } = useTranslation();
    const [error, setError] = useState("");
    const [isFocus, setFocus] = useState(false);
    const [input,setInput]=useState(storeData);

    function checkValidation(e) {
        const value=e.target.value;

        if (value.trim() === "") {
            setError(t("alertEmpty"));
            return;
        }
        if (type === "text") {
            const field = e.target.name.split(".")?.[1];
            if (field === "identityCard"&&!isIdentityCard(value)) {
                setError(t("alertIDCardInvalid"));
                return;
            }
        }
        if (type === "email" && !validator.isEmail(value)) {
            setError(t("alertEmailInvalid"));
            return;
        }
        if (type === "tel" && !validator.isMobilePhone(value, "vi-VN")) {
            setError(t("alertPhoneInvalid"));
            return;
        }
        setError("");
        setFocus(false);
        onBlur?.(e,error);
    }

    function focusHandler() {
        setFocus(true);
        setError("");
    }

    function changeHandler(e){
        setInput(e.target.value);
        // onChange?.(e);
    }

    function isIdentityCard(value){
        //Danh sách 3 chữ số đầu CCCD mã của 63 tỉnh thành Việt Nam
        const provinceCode=String(value).slice(0,3);
        const idLength=String(value).length;

        const provinceList=["001","002","004","006","008","010","011","012","014","015","017","019","020","022","023","025","026","027"
            ,"030","031","033","034","035","036","037","038","040","042","044","045","046","048","049","051","052","054","056","058","060"
            ,"062","064","066","067","068","070","072","074","075","077","079","080","082","083","084","086","087","089","091","092","093"
            ,"094","095","096"];

            return idLength===12&&provinceList.includes(provinceCode);
    }



    return (
        <div>
            <label for={id} className="block text-sm font-medium text-heading text-left mb-1">{label}</label>
            <input type={type}
                id={id}
                className={`bg-neutral-secondary-medium  text-heading text-sm rounded-lg block w-full px-3 py-2.5 mb-1 
                        focus:ring-0 focus:outline-none
                        border-1 border-gray-300
                        placeholder:text-body placeholder:text-gray-400
                        ${!isFocus && storeData ? "border-emerald-500" : ""}
                        ${error ? "border-red-600" : isFocus && !storeData ? "border-gray-500" : ""}`
                }
                onFocus={focusHandler}
                onBlur={checkValidation}
                onChange={changeHandler}
                placeholder={placeholder}
                value={input}
                name={name}
                disabled={disable}
                tabIndex={tabIndex} />
            {error && <p className="text-xs text-red-500 italic text-right">{error}</p>}
        </div>
    );
}