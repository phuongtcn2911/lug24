
import './ExtraPart.css'
import TimeBox from './TimeBox.jsx'
import {useState } from 'react'
import { Flags } from '../../data/Data.js'
import { useTranslation } from "react-i18next"




export default function ExtraPart() {
    // const { lang,flag, Languages,changeLanguage } = useContext(LanguageContext);
    const { t, i18n } = useTranslation();
    const [flag, setFlag] = useState(i18n.language==="vi"?Flags.flagVN:Flags.flagEN);

    function changeLanguage() {
        const currentLang=i18n.language;
        if(currentLang==="vi"){
            i18n.changeLanguage("en");
            setFlag(Flags.flagEN);
        }
        else{
            i18n.changeLanguage("vi");
            setFlag(Flags.flagVN);
        }
    }




    return (

        <div className="columns is-mobile is-vcentered is-gapless is-centered">
            <div className="column is-1">
                <button className="iconButton" onClick={changeLanguage}>
                    <img src={flag}></img>
                </button>
            </div>

            <div className="column is-6 marquee has-background-grey-lighter">
                <span className="title is-2 is-bold ">{t("greetings")}</span>
            </div>


            <TimeBox />
        </div>
    );
}