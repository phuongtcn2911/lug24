import { useTranslation } from "react-i18next";
import Input from "../InputForm/Input";
import ModalBase from "./ModalBase";
import { useContext, useEffect, useRef, useState } from "react";
import PromotionItem from "../InputForm/PromotionItem";
import { InitialDataContext } from "../../data/InitialDataContext";
import { OrderContext } from "../../data/OrderContext";


export default function ModalPromotion({ isOpen, onClose }) {
    const { t, i18n } = useTranslation();
    const { loading, vouchers } = useContext(InitialDataContext);
    const { order } = useContext(OrderContext);


    const inputRef = useRef(null);
    return (
        <ModalBase isOpen={isOpen} onClose={onClose}>
            <div className="bg-gray-100 p-5 w-[400px] border border-gray-300 rounded-lg 
                max-h-[80vh] overflow-hidden flex flex-col">

                {/* Header */}
                <div className="flex items-center justify-between shrink-0 pb-4">
                    <h3 className="text-lg font-medium text-heading ">
                        Thêm khuyến mãi
                    </h3>
                    <button
                        onClick={onClose}
                        className="w-8 h-10 flex items-center justify-center rounded-full
                        bg-gray-300 
                        hover:bg-neutral-tertiary"
                    >✕</button>
                </div>
                <div class="relative flex h-10 w-full min-w-[200px] max-w-[24rem]">
                    <button
                        class="!absolute right-1 top-1 z-10 select-none rounded bg-yellow-500 py-1.55 px-4 
                    text-center align-middle font-sans text-xs font-bold uppercase text-white 
                    transition-all hover:shadow-lg hover:shadow-yellow-500/40 
                    focus:opacity-[0.85] focus:shadow-none active:opacity-[0.85] active:shadow-none 
                    peer-placeholder-shown:pointer-events-none peer-placeholder-shown:bg-blue-gray-500 peer-placeholder-shown:opacity-50 peer-placeholder-shown:shadow-none"
                        type="button"
                        data-ripple-light="true"
                    // onClick={() => inputCodeHandler()}
                    // disabled={isEmptyCode}
                    >
                        {t("btnApply")}
                    </button>
                    <input
                        ref={inputRef}
                        type="text"
                        className=" peer h-full w-full rounded-[7px]
                            border border-gray-300
                            placeholder-shown:border-t-blue-gray-200
                            bg-white
                            px-3 py-3 pr-20
                            text-sm text-blue-gray-700
                            focus:border-2 focus:border-yellow-500 focus:border-t-transparent
                            outline-none"
                        placeholder=" "
                        // onChange={() => changeCodeHandler()}
                        // onFocus={() => setError("")}
                        required
                    />
                    <label className="  before:content[' '] after:content[' '] pointer-events-none 
                                        absolute left-0 -top-1.5 flex h-full w-full 
                                        select-none text-[11px] font-normal leading-tight text-blue-gray-400 
                                        transition-all before:pointer-events-none 
                                        before:mt-[6.5px] before:mr-1 before:box-border before:block before:h-1.5 before:w-2.5 before:rounded-tl-md before:border-t before:border-l before:border-blue-gray-200 before:transition-all 
                                        after:pointer-events-none after:mt-[6.5px] after:ml-1 after:box-border after:block after:h-1.5 after:w-2.5 after:flex-grow 
                                        after:rounded-tr-md after:border-t after:border-r after:border-blue-gray-200 after:transition-all 
                                        peer-placeholder-shown:text-sm peer-placeholder-shown:leading-[3.75] peer-placeholder-shown:text-blue-gray-500 
                                        peer-placeholder-shown:before:border-transparent 
                                        peer-placeholder-shown:after:border-transparent 
                                        peer-focus:text-[11px] peer-focus:leading-tight peer-focus:text-yellow-500 
                                        peer-focus:before:border-t-2 peer-focus:before:border-l-2 peer-focus:before:!border-yellow-500 
                                        peer-focus:after:border-t-2 peer-focus:after:border-r-2 peer-focus:after:!border-yellow-500 
                                        peer-disabled:text-transparent peer-disabled:before:border-transparent peer-disabled:after:border-transparent 
                                        peer-disabled:peer-placeholder-shown:text-blue-gray-500">
                        {t("labelPromoCode")}
                    </label>
                </div>
                {/* {error && <p className="text-xs text-red-500 italic text-right">{error}</p>} */}
                <div className="divider mt-3"></div>

                {/* Body */}
                <div className="space-y-2 text-body flex-1 overflow-y-auto pr-3">
                    {loading ?
                        <span className="loading loading-dots loading-lg"></span>
                        :

                        vouchers?.map(function (item, key) {
                            {
                                if (item.IS_PUBLIC === 1) {
                                    return (
                                        <PromotionItem
                                            key={key}
                                            id={`voucItem_${key}`}
                                            name="voucherItem"
                                            value={item.VOUCHER_ID}
                                            voucherCode={item.VOUCHER_ID}
                                            voucherTitle={item.CAMPAIGN_TITLE}
                                            voucherExpireDate={item.EXPIRED_DATE}
                                            note={item.CAMPAIGN_DESCRIPTION} />
                                    );
                                }
                            }
                        })
                    }

                </div>

                {/* Footer */}
                <div className="flex justify-end gap-2 border-default pt-2 shrink-0">
                    <button
                        onClick={onClose}
                        className="px-3 rounded-xl bg-gray-200 text-sm w-24">
                        {t("btnCancel")}
                    </button>
                    <button
                        onClick={onClose}
                        className="px-3 rounded-xl text-sm w-24 bg-brand text-white bg-yellow-500"
                    >
                        {t("btnApply")}
                    </button>
                </div>
            </div>

            <link
                rel="stylesheet"
                href="https://unpkg.com/@material-tailwind/html@latest/styles/material-tailwind.css"
            />

            <script src="https://unpkg.com/@material-tailwind/html@latest/scripts/ripple.js"></script>
        </ModalBase>
    );
}