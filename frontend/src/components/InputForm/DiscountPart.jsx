import { useContext, useEffect, useState } from "react";
import { LanguageContext } from "../../data/LanguageContext";

export default function DiscountPart({ getDiscountPrice,savedValue, transmitData }) {
    const { lang, Languages } = useContext(LanguageContext);
    const [errMessg, checkErrMessg] = useState();
    const [inputValue, setInputValue] = useState();

    function changeHandler(e) {
        const newValue = e.target.value;
        setInputValue(newValue);
    }

    useEffect(function(){
        setInputValue(savedValue||"");
    },[savedValue]);


    function checkValidDiscountCode(e) {
        e.preventDefault();
        let discountPrice;
        if (inputValue == "FREE1h") {
            checkErrMessg();
            discountPrice=-30000;
            
        }
        else {
            checkErrMessg(Languages[lang].alertInvalid);
            discountPrice=0;
        }
        transmitData(inputValue);

        if (getDiscountPrice != undefined) {
            getDiscountPrice({ discountPrice:discountPrice });
        }
    }



    return (
        <div className="section-box">
            <div className="columns is-mobile">
                <div className="column custom is-full">
                    <p className="title is-6">{Languages[lang].labelPromoCode}</p>
                    <div className="field has-addons mb-0">
                        <div className="control is-expanded">
                            <input className="input"
                                type="text"
                                placeholder="Input your promo code"
                                onChange={changeHandler}
                                value={inputValue}></input>
                        </div>
                        <div className="control">
                            <button
                                onClick={checkValidDiscountCode}
                                className="button is-warning">
                                {Languages[lang].btnEnterPromoCode}
                            </button>
                        </div>
                    </div>
                    <p className="help is-danger">
                        {errMessg}
                    </p>
                </div>
            </div>
        </div>
    );

}