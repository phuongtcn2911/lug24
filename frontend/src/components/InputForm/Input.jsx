import { useTranslation } from "react-i18next";
import { useState } from "react";
import validator from "validator"

export default function Input({ id, name, label, type, placeholder, value, onBlur, onChange,disable=false,tabIndex=0 }) {
    const { t, i18n } = useTranslation();
    const [error, setError] = useState("");
    const [isFocus, setFocus] = useState(false);

    function checkValidation(e) {

        if (value.trim() === "") {
            setError(t("alertEmpty"));
            return;
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
        onBlur?.(e);
    }

    function focusHandler(){
        setFocus(true);
        setError("");
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
                        ${!isFocus&&value? "border-emerald-500":""}
                        ${error?"border-red-600":isFocus&&!value?"border-gray-500":""}`
                }
                onFocus={focusHandler}
                onBlur={checkValidation}
                onChange={onChange}
                placeholder={placeholder}
                value={value}
                name={name}
                disabled={disable}
                tabIndex={tabIndex} />
            {error && <p className="text-xs text-red-500 italic text-right">{error}</p>}
        </div>
    );
}