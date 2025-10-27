import { useContext, useEffect, useState } from "react";
import { OrderStatus,Timer } from "../../data/Data"
import { LanguageContext } from "../../data/LanguageContext";
import { useNavigate } from "react-router-dom";
import { OrderContext } from "../../data/OrderContext";
import { PaymentProgressContext } from "../../data/PaymentProgressContext";

export default function OrderStatusScreen() {
    const { lang, Languages } = useContext(LanguageContext);
    const { resetOrder } = useContext(OrderContext);
    const [secs, setSecs] = useState(Timer.ordStatusDur);
    const { progress,changeStep } = useContext(PaymentProgressContext);

    const nav = useNavigate();


    useEffect(() => {
        const timer = setInterval(() => {
            setSecs((prev) => (prev > 0 ? prev - 1 : 0));
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    useEffect(() => {
        if (secs == 0) {
            console.log("Order status: ",progress.status);
            if(progress.status==1){
                changeStep(2);
            }
            else if(progress.status==0||progress.status==2){
                nav("/ConfirmCheckIn");
            }
            else {
                resetOrder();
                nav("/");
            }
        }
    }, [secs, nav]);

    // function changeStep(stepNo) {
    //     setProgress((prev) => {
    //         return { ...prev, step: stepNo };
    //     });
    // }


    return (
        <>
            <p className="title is-4 mt-3 has-text-info has-text-centered has-text-weight-bold">
                {String(Languages[lang].orderStatus[progress.status]).toUpperCase()}
            </p>
            <p className="subtitle is-7 is-italic has-text-gray">{`${Languages[lang].labelTransition[0]} ${secs} ${Languages[lang].labelTransition[1]}`}</p>
            <div className="image-section">
                <img
                    src={OrderStatus[progress.status]}
                    alt="order-status"
                    className="orderStatus-image"
                />
            </div>

        </>
    );

}