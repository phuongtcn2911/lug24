import { useState, useContext } from "react";
import { LanguageContext } from "../../data/LanguageContext.jsx";
import { useTranslation } from "react-i18next";

import validator from "validator"

export default function TextInput({ label, type, value, placeholder, transmitData }) {
    // const [inputValue, setInputValue] = useState("");
    // const { lang, Languages } = useContext(LanguageContext);
    const { t, i18n } = useTranslation();
    const [isTouched, setTouched] = useState(false);
    const [className, setClassName] = useState("input");
    const [error,setError]=useState("");

     function validate() {
        setTouched(true);

        if (value.trim() === "") {
            setClassName("input is-danger");
            setError(t("alertEmpty"));
            return;
        }

        if (type === "email" && !validator.isEmail(value)) {
            setClassName("input is-danger");
            setError(t("alertEmailInvalid"));
            return;
        }

        if (type === "tel" && !validator.isMobilePhone(value, "vi-VN")) {
            setClassName("input is-danger");
            setError(t("alertPhoneInvalid"));
            return;
        }

        // Hợp lệ
        setClassName("input is-success");
        setError("");
    }

   
    function handleChange(e) {
        transmitData(e.target.value);
    }

    function onClick() {
        setClassName("input");
        setError("");
    }

    return (
        <div className="field">
            <label className="label">{label}</label>
            <div className="field-body">
                <div className="field">
                    <div className="control">
                        <input
                            onBlur={validate}
                            onChange={handleChange}
                            onClick={onClick}
                            className={className}
                            type={type}
                            placeholder={placeholder}
                            value={value}
                        />
                    </div>
                    {isTouched && error&& (
                        <p className="help is-danger">{error}</p>
                    )}
                </div>
            </div>
        </div>
    );
}