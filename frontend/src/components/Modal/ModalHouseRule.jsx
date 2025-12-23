import { useTranslation } from "react-i18next";
import ModalBase from "./ModalBase";
export default function ModalHouseRule({ isOpen, onClose }) {
    const { t } = useTranslation();

    return (
        <>
            <ModalBase isOpen={isOpen} onClose={onClose}>
                <div className="bg-yellow-50 w-[650px] p-5 border border-yellow-500 rounded-lg 
                max-h-[80vh] overflow-hidden flex flex-col">
                    {/* Header */}
                    <div className="flex items-center justify-between shrink-0 pb-4">
                        <h1 className="text-3xl font-medium text-heading ">
                            {t("terms.title")}
                        </h1>
                        <button
                            onClick={onClose}
                            className="w-4 h-8 flex items-center justify-center rounded-full
                        bg-yellow-300 
                        hover:bg-yellow-400"
                        >✕</button>
                    </div>

                    <div className="divider">

                    </div>


                    {/* Body */}
                    <div className="space-y-2 text-body flex-1 overflow-y-auto pr-3">
                        {t("terms.contents", { returnObjects: true }).map(function (e, i) {
                            return (
                                <div className="mb-2" key={"p" + i}>
                                    {e.chapter.split(": ").map(function (title, i) {
                                        return (<h2 className={`my-3 text-xl ${i === 0 ? "font-black" : "font-medium"} text-heading inline-block border-b-4 border-yellow-400`}>
                                            {`${i !== 0 && title !== "" ? `: ${title}` : title}`}
                                        </h2>);
                                    })}
                                    <ul className="space-y-1 ps-10 text-body list-disc list-outside marker:mr-5 text-justify">
                                        {e.content.map(function (subE, subI) {
                                            //Trường hợp Điều 4, đầu dòng 2 có chia mục con thì phát sinh lệnh này
                                            if (i == 3 && subI == 2 || i == 4 && subI % 2 != 0) {
                                                let smallArr = new Array();

                                                smallArr.push(subE.map(function (smallSubE, smallSubI) {
                                                    return (
                                                        <li key={"x" + smallSubI}>{smallSubE}</li>
                                                    );
                                                }));
                                                return (<ol key={"z" + subI} className=" mt-2 space-y-1 list-decimal list-inside">
                                                    {smallArr}
                                                </ol>);
                                            }
                                            else
                                                return (
                                                    <li key={"s" + subI} className={i == 4 ? "font-semibold" : ""}>{subE}</li>

                                                );
                                        })}
                                    </ul>
                                </div>

                            );
                        })}

                    </div>

                    <div className="divider"></div>

                    {/* Footer */}
                    <div className="flex justify-end gap-2 border-default pt-2 shrink-0">

                        <div className="block">
                            <div class="flex items-center">
                                {/* <input id="link-checkbox" type="checkbox" value="" className="w-4 h-4 border border-default-medium rounded-xs bg-neutral-secondary-medium focus:ring-2 focus:ring-brand-soft" /> */}
                                <label for="link-checkbox" className="select-none px-3 ms-2 text-sm font-medium text-heading text-justify">
                                    <span>{t("msgConfirm.0")} </span>
                                    <span><strong>{t("msgConfirm.1")} </strong></span>
                                    <span>{t("msgConfirm.2")} </span>
                                    <span><strong>{t("msgConfirm.3")}</strong> </span>
                                    <span>{t("msgConfirm.4")} </span>
                                </label>
                            </div>
                        </div>

                        <button className="button is-warning is-rounded"
                        // disabled={!isAgreement}
                        // onClick={handleBooking}
                        >
                            <span className="icon">
                                <i class="fa-solid fa-clipboard-check"></i>
                            </span>
                            <span>{t("btnConfirm")}</span>
                        </button>

                        {/* <button
                            onClick={onClose}
                            className="px-3 rounded-xl bg-gray-200 text-sm w-24">
                            {t("btnCancel")}
                        </button>
                        <button
                            onClick={onClose}
                            className="px-3 rounded-xl text-sm w-24 bg-brand text-white bg-yellow-500"
                        >
                            {t("btnApply")}
                        </button> */}
                    </div>
                </div>

            </ModalBase>
        </>
    );
}