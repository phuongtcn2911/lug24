import { useContext, useEffect, useState } from "react";
import { LockerStatus, Timer } from "../../data/Data"
import { LanguageContext } from "../../data/LanguageContext";
import { useNavigate } from "react-router-dom";
import { OrderContext } from "../../data/OrderContext";
import { PaymentProgressContext } from "../../data/PaymentProgressContext";
import axios from "axios";
import api from "../../config/axios";
import { useTranslation } from "react-i18next";

export default function LockerStatusScreen() {
    const { lang, Languages } = useContext(LanguageContext);
    const {t,i18n}=useTranslation();
    const { order, resetOrder } = useContext(OrderContext);
    const [secs, setSecs] = useState(Timer.lockerStatusDur);
    const { progress, changeStep, changeStatus } = useContext(PaymentProgressContext);
    const [title, setTitle] = useState(t("lockerStatus",{returnObjects:true,lockerNo:order.locker.id})[progress.status].title);


    const nav = useNavigate();


    useEffect(() => {
        if (progress.status == 1) {
            const timer = setInterval(() => {
                setSecs((prev) => (prev > 0 ? prev - 1 : 0));
            }, 1000);
            return () => clearInterval(timer);
        }
        else {
            // Gọi async đúng cách
            if (!order || !order.locker.id) return;

            (async () => {
                const response = await openLocker(order.locker.id);
                if (response.code !== 0) {
                    console.warn("Từ phía server <-> frontend: Không thể mở tủ:", response.message);
                }
            })();
        }
    }, [progress.status]);

    useEffect(() => {
        if (secs == 0) {
            console.log("Status: ", progress.status);
            if (progress.status == 1) {
                resetOrder();
                nav("/");
            }
            else if (progress.status == 0 || progress.status == 2) {
                nav("/ConfirmCheckIn");
            }
        }
    }, [secs, nav]);

    function getBackStatus(statusNo) {
        if (!order) return;

        (async () => {
            const response = await sendReceipt(order, order.customer.email ? "Email" : "Zalo");
            if (response.code !== 0) {
                console.warn("Từ phía server <-> frontend: Không thể gửi mail", response.message);
            }
        })();
        changeStep(4);
        changeStatus(statusNo);
    }

    async function openLocker(lockerID) {
        try {
            const res = await api.post('api/openBox', { boxNo: lockerID });
            // const res = await axios.post("http://localhost:5000/api/openBox", { boxNo: lockerID });
            console.log(res.data);
            return res.data;
        } catch (err) {
            console.error("Phía server trả lời: Không thể mở tủ", err.message);
            return { code: -1, message: "Cannot open a box" };
        }
    }

    // useEffect(() => {

    //     const editTitle = String(title).replace("#", "#" + order.locker.id);
    //     setTitle(editTitle);

    // }, []);

    async function sendReceipt(obj, contactType) {
        var orderOBJ = {
            order: obj,
            contactType: contactType,
            lang:lang==0?"vi":"en",
        };

        try {
            const res = await api.post('api/sendReceipt', { obj: orderOBJ });
            // const res = await axios.post("http://localhost:5000/api/sendReceipt", { obj: orderOBJ });
            console.log(res.data);
            return res.data;
        } catch (err) {
            console.error("Phía server trả lời: Không thể gửi hóa đơn về mail", err.message);
            return { code: -1, message: "Cannot send receipt mail" };
        }
    }

    return (
        <>
            <p className="title is-2 mt-3 has-text-info has-text-centered has-text-weight-bold is-spaced">
                {String(title).toUpperCase()}
            </p>
            <p className="subtitle is-5 has-text-gray has-text-weight-bold">{t("lockerStatus",{returnObjects:true})[progress.status].note[0]}<br />{t("lockerStatus",{returnObjects:true})[progress.status].note[1]}</p>
            {progress.status == 1 ?
                (
                    <p className="subtitle is-7 is-italic has-text-gray">{t("labelTransition",{timelapse:secs})}</p>
                ) : null}
            <div className="image-section">
                <img
                    src={LockerStatus[progress.status]}
                    alt="order-status"
                    className="orderStatus-image"
                />
            </div>
            {progress.status == 0 ?
                (<a onClick={() => getBackStatus(1)}>Demo thành công</a>) :
                null}
        </>
    );

}