
import './ExtraPart.css'
import {LanguageContext} from '../../data/LanguageContext.jsx'
import  TimeBox from './TimeBox.jsx'
import { useContext } from 'react'
import {Flags} from '../../data/Data.js'


export default function ExtraPart() {
    const { lang,flag, Languages,changeLanguage } = useContext(LanguageContext);


    return (

        <div className="columns is-mobile is-vcentered is-gapless is-centered">
            <div className="column is-1">
                <button className="iconButton" onClick={changeLanguage}>
                    <img src={flag=="flagVN"?Flags.flagVN:Flags.flagEN}></img>
                </button>
            </div>

            <div className="column is-6 marquee has-background-grey-lighter">
                <span className="title is-2 is-bold ">{Languages[lang].greetings}</span>
            </div>
           

            <TimeBox/>
        </div>
    );
}