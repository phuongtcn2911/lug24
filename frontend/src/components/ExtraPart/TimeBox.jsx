
import { useEffect, useState } from "react";
import {LanguageContext} from "../../data/LanguageContext.jsx";
import { useContext } from "react";
import { FullDateStringByLang,FullVNTimeZoneString } from "../../data/DateStringFormat.jsx";
import { useTranslation } from "react-i18next"

export default function TimeBox() {
    
    // const {lang, Languages } = useContext(LanguageContext);
     const { t, i18n } = useTranslation();

    const [clock, setClock] = useState(new Date());
   
    useEffect(() => {
        const timer = setInterval(() => {
            setClock(new Date());
        }, 1000);

        return () => clearInterval(timer);
    }, []);



    // const formatTime = clock.toLocaleTimeString("vi-VN");
    // const dowIndex = clock.getDay();
    // const dowWord = Languages[lang].dayName[dowIndex];
    
    const formatDate=FullDateStringByLang(clock,i18n.language);
    const formatTime=FullVNTimeZoneString(clock);



    // const formatDate =
    //     `${dowWord}, ${String(clock.getDate()).padStart(2, '0')}/${String(clock.getMonth() + 1).padStart(2, '0')}/${clock.getFullYear()}`



    return (
        <div className="column timeBox  is-5 has-text-right">
            <div>
                <span className="title is-5 pr-3">{formatDate}</span>
            </div>
            <div>
                <span className="subtitle is-6 pr-3">{formatTime}</span>
            </div>
        </div>
    );
}