import { useContext } from "react";
import { LanguageContext } from "../../data/LanguageContext";
import { TimerContext } from "../../data/TimerContext.jsx";
import * as Data from "../../data/Data.js";
import { Link, useNavigate } from "react-router-dom";
import { cancelTransaction } from "../ExtraPart/Payment.jsx";
import { OrderContext } from "../../data/OrderContext.jsx";

export function Header({ link, isBackEnable }) {
    const { lang, Languages,resetLanguage } = useContext(LanguageContext);
    const { remaining, stopTimer, resetTimer } = useContext(TimerContext);
    const { order, resetOrder } = useContext(OrderContext);

    const navigate=useNavigate();

    function resetNewSS() {
        if (link === "/") {
            stopTimer();
            resetTimer();
            resetLanguage();
            if (order?.orderID) {
                (async () => {
                    const response = await cancelTransaction(order.orderID);
                    console.log("Hủy giao dịch:", response);
                    resetOrder();
                })();
            }
        }
        navigate(link);
    }

    return (
        <section>
            <div className="level">
                <div className="level-left">
                    <div className="level-item">
                        {isBackEnable == true ?
                            
                                <button className="button is-warning"
                                    onClick={resetNewSS}>
                                    <span className="icon">
                                        <i className="fa-solid fa-circle-left"></i>
                                    </span>
                                    <span>{Languages[lang].btnBack}</span>
                                </button>
                         
                            : null}
                    </div>
                </div>
                <div className="level-right">
                    <div class="tags has-addons ">
                        <span class="tag is-dark is-large ">
                            <span className="icon">
                               <i class="fa-solid fa-clock"></i>
                            </span>
                            <span className="is-size-6 has-text-weight-medium">{Languages[lang].labelSessionDuration}</span>
                        </span>
                        <span class="tag is-warning is-large ">
                            <span className="is-size-6 has-text-weight-medium">{remaining}</span>
                        </span>
                    </div>
                </div>
            </div>
            <div>
                {/* {isBackEnable == true ?
                    (<div style={{ justifySelf: "flex-start" }}>
                        <Link to={link}>
                            <button className="button is-warning"
                                onClick={resetNewSS}>
                                <span className="icon">
                                    <i className="fa-solid fa-circle-left"></i>
                                </span>
                                <span>{`${Languages[lang].btnBack} (${remaining})`}</span>
                            </button>
                        </Link>
                    </div>) : null} */}


                <div className="my-5">
                    <img id="imgLogo" src={Data.Logo} width="40%"></img>
                </div>
            </div>
        </section >

    );

}