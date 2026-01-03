import { useContext, useEffect, useState } from "react";
import { Header } from "../components/ExtraPart/Header";
import CurrencyFormat from "../utils/CurrencyFormat";
import * as DateStringFormat from "../utils/DateStringFormat";
import { useTranslation } from "react-i18next";
import { OrderContext } from "../data/OrderContext";
import { SizeIMG } from "../data/Data";
import { InitialDataContext } from "../data/InitialDataContext";
import api from "../config/axios";
import { useNavigate } from "react-router-dom";
import ModalFaceRecognize from "../components/Modal/ModalFaceRecognize";
import { useRef } from "react";

export default function ConfirmCheckIn() {
    const { t, i18n } = useTranslation();
    const { order, updateOrder, setOrder } = useContext(OrderContext);
    const { campus, loading } = useContext(InitialDataContext);
    const [isOpenFaceRec, setOpenFaceRec] = useState(false);
    const [isProcessLoading, setProcessLoading] = useState(false);
    const [error, setError] = useState("");
    const [isRedirecting, setIsRedirecting] = useState(false);

    const navigate = useNavigate();
    const orderRef = useRef(order);

    useEffect(() => {
        // console.log("Order: ", order);
        orderRef.current = order;
    }, [order]);

    useEffect(() => {
        const getAvailableLocker = async () => {
            try {
                const res = await api.get('api/getAvailableLocker', { params: { size: order.locker.sizeLetter } });
                const locker = res?.data?.data?.rows?.[0];

                console.log("Get available box:", locker);
                updateOrder("locker", "id", locker?.LOCKER_ID);
                updateOrder("locker", "no", locker?.LOCKER_NO);

            } catch (err) {
                console.log("Frontend nhận api getAvalableLocker không thành công", err);
            }
        };

        if (order.locker.id === undefined) {
            getAvailableLocker();
        }
    }, [order.locker.id, order.locker.no]);

    useEffect(() => {
        if (order.transaction.checkoutURL) {
            setIsRedirecting(true);
            window.location.href = order.transaction.checkoutURL;
        }
        // return <p>Đang chuyển đến trang thanh toán SePay...</p>;
    }, [order.transaction.checkoutURL]);

    function editInfo(e) {
        e.preventDefault();
        navigate("/sendParcel");
    }

    function showFaceRecognize(e) {
        e.preventDefault();

        setOpenFaceRec(true);
    }

    async function getCapturedFile(img) {
        try {
            setProcessLoading(true);
            console.log("Ảnh nhận được:", img);

            let customerID;
            let receiverID;

            //Insert khách hàng
            if (order.isDifferentPerson) {
                [customerID, receiverID] = await Promise.all([
                    insertCustomer(order.customer),
                    insertCustomer(order.receiver)
                ]);
            }
            else {
                customerID = receiverID = await insertCustomer(order.customer);
            }

            orderRef.current = {
                ...orderRef.current,
                customer: {
                    ...orderRef.current.customer,
                    id: customerID,
                },
                receiver: {
                    ...orderRef.current.receiver,
                    id: receiverID
                }

            }

            //Thiết lập mô tả giao dịch
            const description = `${t("defaultBankingMsg")} ${order.order.id}`;
            orderRef.current.transaction.description = description;
            updateOrder("transaction", "description", description);

            setOrder(orderRef.current);
            console.log("OrderRef:",orderRef);

            //Insert hóa đơn - Tình trạng đã book
            const uuid = await insertOrder(orderRef.current);
            console.log("UUID sau khi insert order: ", uuid);
        
            orderRef.current.order.uuid = uuid;
            updateOrder("order", "uuid", uuid);


            // //Upload ảnh - lấy URL
            const res = await uploadImg(img, uuid, customerID);
            if (!res.success) return;

            const imgURL = res?.imgURL;
            orderRef.current.customer.imageURL = imgURL;
            updateOrder("customer", "imageURL", imgURL);

            //Insert Transact
            await createTransactLog(uuid, 0, 1, customerID, imgURL);
            console.log("Người dùng đã thêm Transact log: BOOKING");

            //Update trạng thái đơn hàng sau khi ghi transact
            await updateOrderStatus(uuid, 0);
            console.log("Cập nhật trạng thái đơn hàng: BOOKED");

            const response = await makeSepayTransaction(orderRef.current);

            if (response?.code !== 1) {
                orderRef.current.transaction.checkoutURL = response?.checkout_url;
                updateOrder("transaction", "checkoutURL", response?.checkout_url);
                // navigate("/OrderResult");
                return;
            }
            else {
                setError(response_stp3?.message);
                return;
            }
        }
        catch (err) {
            setError("Có lỗi khi tạo đơn hàng! Vui lòng thử lại sau!");
            console.log(err);
            //Nếu có lỗi xảy ra thì cancel đơn hàng
            await createTransactLog(orderRef.current.order.uuid, -1, 2, null);
            console.log("Hệ thống đã thêm Transact log: CANCEL");
        }
        finally {
            setProcessLoading(false);
        }
    }

    async function insertCustomer(customer) {
        try {
            // console.log(customer);
            const res = await api.post("api/insertCustomer", { customer });
            const customerID = res.data?.customerID;
            // console.log(customerID);
            return customerID;
        } catch (err) {
            console.error("Không thể thêm khách hàng", err.message);
            return { code: -1, message: "Insert customer failed" };
        }
    }

    async function insertOrder(order) {
        try {
            console.log("Thông số khi insert order:",order);
            const res = await api.post("api/insertOrder", { order });
            console.log(res.data);
            return res.data?.uuid;

        } catch (err) {
            console.error("Không thể thêm đơn hàng", err.message);
            return res.json({ code: -1, message: "Insert order failed", uuid: undefined });
        }
    }

    async function uploadImg(file, orderID, customerID, type = "live") {
        const formData = new FormData();
        formData.append("image", file);
        formData.append("orderID", orderID);
        formData.append("customerID", customerID);
        formData.append("type", type);

        const res = await api.post("/api/uploadImage", formData, {
            headers: {
                "Content-Type": "multipart/form-data"
            }
        });
        console.log(res.data);
        return res.data;
    }

    async function createTransactLog(orderID, actionID, roleID, actorID, imgURL = null) {
        const transact = {
            uuid: orderID,
            actionID: actionID,
            actorType: roleID,
            actorID: actorID,
            imageURL: imgURL
        }

        const res = await api.post("/api/createTransactLog", { transact });
    }

    async function updateOrderStatus(uuid, ordStatusID) {
        const obj = {
            uuid: uuid,
            ordStatusID: ordStatusID
        };
        const res = await api.post("/api/updateOrderStatus", { obj });
    }

    async function makeSepayTransaction(obj) {
        try {
            console.log("BackEnd nhận OBJ để thiết lập chuyển cho Sepay: ", obj)
            const res = await api.post('api/createPaymentSePay', { obj });
            console.log("Transact: ", res.data);
            return res.data;
        } catch (err) {
            console.error("FrontEnd nhận phản hồi từ BackEnd: Không tạo được giao dịch", err.message);
            return { code: -1, message: "Network error" };
        }
    }






    return (
        <>
            <Header isBackEnable={true} link={"/"} />
            {isRedirecting && (
                <div className="notification is-info">
                    {t("sepayTransitionNoti")}
                </div>
            )}
            <div className="level">
                <div className="level-left">
                    <h1 className="text-heading text-2xl" >
                        <span className="font-bold">{t("legendOrder")} </span>
                        <span className="font-semibold">{order.order.id ? `#${order.order.id}` : "-"}</span>
                    </h1>
                </div>
                <div className="level-right">
                    <p >
                        <span className="text-base font-normal">{t("labelOrderDate")}</span>
                        <span className="text-base font-semibold"> {DateStringFormat.FullDateStringByLang(Date.now(), i18n.language)}</span>
                    </p>
                </div>
            </div>
            <div className="w-full max-w-6xl backdrop-blur-xs bg-white/70 mx-auto rounded-xl border border-gray-200 shadow-sm mb-5">
                {/* ROW 1 */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 p-5">
                    {/* Delivery + Contact */}
                    <div className="grid grid-cols-1 text-sm ">
                        <div className="mb-3">
                            <p className="font-semibold text-lg text-gray-900 text-left mb-3">{t("labelSenderInfo")}</p>
                            <p className="mb-1 text-gray-900 text-left text-base font-semibold uppercase">{order.customer.fullName ? order.customer.fullName : "-"}</p>
                            <p className="mb-1 text-gray-600 text-left text-sm"><span className="font-medium">{t("labelIdentityNo")}: </span>{order.customer.identityCard ? order.customer.identityCard : "-"}</p>
                            {
                                order.customer.authMethod === "Email" ?
                                    <p className="mb-1 text-gray-600 text-left text-sm"><span className="font-medium">{t("labelEmail")}: </span>{order.customer.email ? order.customer.email : "-"}</p>
                                    :
                                    <p className="mb-1 text-gray-600 text-left text-sm"><span className="font-medium">{t("labelMobile")}: </span>{order.customer.mobile ? order.customer.mobile : "-"}</p>
                            }
                            <p className="mb-1 text-gray-600 text-left text-sm"><span className="font-medium">{t("labelOTPMethod")}: </span>{order.customer.authMethod ? order.customer.authMethod : "-"}</p>
                        </div>

                    </div>
                    <div className="grid grid-cols-1 text-sm ">
                        <div className="mb-3">
                            <p className="font-semibold text-lg text-gray-900 text-left mb-3">{t("labelReceiverInfo")}</p>
                            <p className="mb-1 text-gray-900 text-left text-base font-semibold uppercase">{order.receiver.fullName ? order.receiver.fullName : "-"}</p>
                            <p className="mb-1 text-gray-600 text-left text-sm"><span className="font-medium">{t("labelIdentityNo")}: </span>{order.receiver.identityCard ? order.receiver.identityCard : "-"}</p>
                            {
                                order.receiver.authMethod === "Email" ?
                                    <p className="mb-1 text-gray-600 text-left text-sm"><span className="font-medium">{t("labelEmail")}: </span>{order.receiver.email ? order.receiver.email : "-"}</p>
                                    :
                                    <p className="mb-1 text-gray-600 text-left text-sm"><span className="font-medium">{t("labelMobile")}: </span>{order.receiver.mobile ? order.receiver.mobile : "-"}</p>
                            }
                            <p className="mb-1 text-gray-600 text-left text-sm"><span className="font-medium">{t("labelOTPMethod")}: </span>{order.receiver.authMethod ? order.receiver.authMethod : "-"}</p>
                        </div>
                        <div className="grid grid-flow-col justify-items-end">
                            <button className="w-42 mt-2 bg-yellow-400 hover:underline" onClick={editInfo}>{t("btnChangeInfo")}</button>
                        </div>
                    </div>
                </div>


                {/* DIVIDER */}
                <div className="border-t border-gray-200"></div>

                {/* ROW 2 */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12 p-5">
                    <div className="flex gap-4 md:col-span-2">
                        <img
                            src={order.locker.sizeLetter == "L" ? SizeIMG.sizeL : SizeIMG.sizeS}
                            alt=""
                            className="w-32 h-32 rounded-lg bg-gray-100 object-cover"
                        />

                        <div className="text-left place-self-center">
                            <h3 className="font-black text-gray-900 text-3xl">{`${t("sizeUnit")} ${order.locker.sizeLetter ? order.locker.sizeLetter : "-"}`}</h3>
                            <p className="text-sm text-gray-500">{order.locker.sizeIndex ? t("sizeDescription." + (order.locker.sizeIndex - 1)) : "-"}</p>
                            <p className="flex gap-2 mt-3 text-base font-semibold text-gray-500 ">
                                <span>{`${t("labelLockerID")}: `}</span>
                                {
                                    order.locker.id ?
                                        <span>{`#${order.locker.no}`}</span> :
                                        <span class="loading loading-spinner loading-sm align-baseline"></span>
                                }
                            </p>
                        </div>
                    </div>
                    <div className="flex gap-4 md:col-span-2">
                        <div className="text-left place-self-center">
                            <p className="font-semibold text-lg text-gray-900 text-left">{t("labelCheckInTime")}</p>
                            <p className="mb-3 text-gray-600 text-left text-sm">  {DateStringFormat.DateStringFormat(order.order.checkIn, i18n.language)}</p>
                            <p className="font-semibold text-lg text-gray-900 text-left">{t("labelCheckOutTime")}</p>
                            <p className="mb-3 text-gray-600 text-left text-sm">  {DateStringFormat.DateStringFormat(order.order.finalCheckOut, i18n.language)}</p>
                        </div>
                    </div>
                </div>
            </div >
            <div className="w-full max-w-6xl mx-auto rounded-xl backdrop-blur-xs bg-gray-100/85  border border-gray-200 shadow-sm">
                <div className="grid grid-cols-1 gap-12 md:grid-cols-2 p-5">
                    {/* Delivery + Contact */}
                    <div className="flex grid-cols-1">
                        <div>
                            <p className="font-semibold text-lg text-gray-900 text-left mb-3">{t("labelCampus")}</p>
                            <p className="mb-1 text-gray-900 text-left text-base font-semibold">{campus?.LOCATION_NAME}</p>
                            <p className="mb-1 text-gray-600 text-left text-sm">
                                {/* <span className="font-medium">{`${t("labelCampusAddress")}: `} </span> */}
                                <span>{campus?.ADDRESS}</span>
                            </p>
                            <p className="mb-1 text-gray-600 text-left text-sm">
                                <span className="font-medium">{`${t("labelMobile")}`}</span><br />
                                <span>{campus?.HOTLINE}</span>
                            </p>
                            <p className="mb-1 text-gray-600 text-left text-sm">
                                <span className="font-medium">{`${t("labelWorkingTime")}`}</span><br />
                                <span>{`${campus?.OPEN_TIME} - ${campus?.CLOSE_TIME}`}</span>
                            </p>
                        </div>

                    </div>

                    <div className="flex flex-col h-full grid-cols-1">
                        <div className="mt-auto">
                            <div className="level my-1">
                                <div className="level-left">
                                    <p className="text-gray-900 text-left text-base font-semibold">{t("labelSubTotal")}</p>
                                </div>
                                <div className="level-right">
                                    <p className="text-gray-600 text-left text-base">{CurrencyFormat(order.order.subTotal)}</p>
                                </div>
                            </div>
                            <div className="border-t border-gray-200 my-2"></div>
                            <div className="level my-1">
                                <div className="level-left">
                                    <p className="mb-1 text-gray-900 text-left text-base font-semibold">{t("labelDiscount")}</p>
                                </div>
                                <div className="level-right">
                                    <p className="mb-1 text-gray-600 text-left text-base">{CurrencyFormat(order.order.discountPrice)}</p>
                                </div>
                            </div>
                            <div className="border-t border-gray-200 my-2"></div>
                            <div className="level my-1">
                                <div className="level-left">
                                    <p className="mb-1 text-gray-900 text-left text-base font-semibold">{t("labelTax")}</p>
                                </div>
                                <div className="level-right">
                                    <p className="mb-1 text-gray-600 text-left text-base">{CurrencyFormat(order.order.tax)}</p>
                                </div>
                            </div>
                            <div className="border-t border-gray-200 my-2"></div>
                            <div className="level my-1">
                                <div className="level-left">
                                    <p className="mb-1 text-gray-900 text-left text-lg font-bold">{t("labelTotal")}</p>
                                </div>
                                <div className="level-right">
                                    <p className="mb-1 text-gray-900 text-left text-lg font-semibold">{CurrencyFormat(order.order.total)}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div >
            <div className="grid grid-flow-col justify-items-end">
                <button
                    type="button"
                    className={`mt-5 bg-yellow-400 gap-3 flex items-center
                                ${isProcessLoading ? "cursor-not-allowed" : ""}`}
                    onClick={showFaceRecognize}
                    disabled={isProcessLoading}>
                    {isProcessLoading ?
                        <span className="flex gap-3">
                            <span class="loading loading-spinner"></span>
                            {t("btnIsProcessing")}
                        </span>
                        :
                        t("btnCheckout")
                    }
                </button>
            </div>

            <ModalFaceRecognize
                isOpen={isOpenFaceRec}
                onClose={() => setOpenFaceRec(false)}
                onCapture={(file) => getCapturedFile(file)}
            // disableBackdropClose={true}
            ></ModalFaceRecognize >

        </>
    )
}