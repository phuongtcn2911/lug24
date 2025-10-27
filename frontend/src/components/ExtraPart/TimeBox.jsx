
import { useEffect, useState } from "react";
import {LanguageContext} from "../../data/LanguageContext.jsx";
import { useContext } from "react";

export default function TimeBox() {
    const {lang, Languages } = useContext(LanguageContext);

    const [clock, setClock] = useState(new Date());
   
    useEffect(() => {
        const timer = setInterval(() => {
            setClock(new Date());
        }, 1000);

        return () => clearInterval(timer);
    }, []);



    const formatTime = clock.toLocaleTimeString("vi-VN");
    const dowIndex = clock.getDay();

   
    const dowWord = Languages[lang].dayName[dowIndex];

    const formatDate =
        `${dowWord}, ${String(clock.getDate()).padStart(2, '0')}/${String(clock.getMonth() + 1).padStart(2, '0')}/${clock.getFullYear()}`



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