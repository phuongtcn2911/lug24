import { useContext } from "react";
import { Header } from "../components/ExtraPart/Header";
import CurrencyFormat from "../utils/CurrencyFormat";
import * as DateStringFormat from "../utils/DateStringFormat";
import { useTranslation } from "react-i18next";
import { OrderContext } from "../data/OrderContext";
import { SizeIMG } from "../data/Data";
import { InitialDataContext } from "../data/InitialDataContext";

export default function ConfirmCheckIn() {
    const { t, i18n } = useTranslation();
    const { order } = useContext(OrderContext);
    const { campus,loading } = useContext(InitialDataContext);

    return (
        <>
            <Header isBackEnable={true} link={"/SendParcel"} />
            <div className="level">
                <div className="level-left">
                    <h1 className="text-heading text-2xl" >
                        <span className="font-bold">{t("legendOrder")} </span>
                        <span className="font-semibold">{order.order.subId ? `#${order.order.subId}` : "-"}</span>
                    </h1>
                </div>
                <div className="level-right">
                    <p >
                        <span className="text-base font-normal">{t("labelOrderDate")}</span>
                        <span className="text-base font-semibold"> {DateStringFormat.FullDateStringByLang(Date.now(), i18n.language)}</span>
                    </p>
                </div>
            </div>
            <div className="w-full max-w-6xl mx-auto rounded-xl border border-gray-200 bg-white shadow-sm mb-5">
                {/* ROW 1 */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 p-5">
                    {/* Delivery + Contact */}
                    <div className="grid grid-cols-1 text-sm ">
                        <div className="mb-3">
                            <p className="font-semibold text-lg text-gray-900 text-left mb-3">Thông tin người gửi</p>
                            <p className="mb-1 text-gray-900 text-left text-base font-semibold">{order.customer.fullName ? order.customer.fullName : "-"}</p>
                            <p className="mb-1 text-gray-600 text-left text-sm"><span className="font-medium">CCCD: </span>{order.customer.identityCard ? order.customer.identityCard : "-"}</p>
                            {
                                order.customer.authMethod === "Email" ?
                                    <p className="mb-1 text-gray-600 text-left text-sm"><span className="font-medium">Email: </span>{order.customer.email ? order.customer.email : "-"}</p>
                                    :
                                    <p className="mb-1 text-gray-600 text-left text-sm"><span className="font-medium">Điện thoại: </span>{order.customer.mobile ? order.customer.mobile : "-"}</p>
                            }
                            <p className="mb-1 text-gray-600 text-left text-sm"><span className="font-medium">Phương thức gửi xác thực: </span>{order.customer.authMethod ? order.customer.authMethod : "-"}</p>
                        </div>

                    </div>
                    <div className="grid grid-cols-1 text-sm ">
                        <div className="mb-3">
                            <p className="font-semibold text-lg text-gray-900 text-left mb-3">Thông tin người nhận</p>
                            <p className="mb-1 text-gray-900 text-left text-base font-semibold">{order.receiver.fullName ? order.receiver.fullName : "-"}</p>
                            <p className="mb-1 text-gray-600 text-left text-sm"><span className="font-medium">CCCD: </span>{order.receiver.identityCard ? order.receiver.identityCard : "-"}</p>
                            {
                                order.receiver.authMethod === "Email" ?
                                    <p className="mb-1 text-gray-600 text-left text-sm"><span className="font-medium">Email: </span>{order.receiver.email ? order.receiver.email : "-"}</p>
                                    :
                                    <p className="mb-1 text-gray-600 text-left text-sm"><span className="font-medium">Điện thoại: </span>{order.receiver.mobile ? order.receiver.mobile : "-"}</p>
                            }
                            <p className="mb-1 text-gray-600 text-left text-sm"><span className="font-medium">Phương thức gửi xác thực: </span>{order.receiver.authMethod ? order.receiver.authMethod : "-"}</p>
                        </div>
                        <div className="grid grid-flow-col justify-items-end">
                            <button className="w-42 mt-2 bg-yellow-400 hover:underline">Thay đổi thông tin</button>
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
                            <p className="mt-3 text-base font-semibold text-gray-500">{`${t("labelLockerID")}: ${order.locker.id ? `#${order.locker.id}` : "-"}`}</p>
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
            <div className="w-full max-w-6xl mx-auto rounded-xl bg-gray-100 border border-gray-200 shadow-sm">
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
                                <span className="font-medium">{`${t("labelMobile")}`}</span><br/>
                                <span>{campus?.HOTLINE}</span>
                            </p>
                            <p className="mb-1 text-gray-600 text-left text-sm">
                                <span className="font-medium">{`${t("labelWorkingTime")}`}</span><br/>
                                <span>{`${campus?.OPEN_TIME} - ${campus?.CLOSE_TIME}`}</span>
                            </p>
                        </div>

                    </div>
     
                    <div className="flex flex-col h-full grid-cols-1">
                        <div  className="mt-auto">
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
                <button className=" mt-5 bg-yellow-400">Xác thực thanh toán</button>

            </div>

        </>
    )
}