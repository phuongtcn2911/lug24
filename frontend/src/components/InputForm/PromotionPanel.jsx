import { useTranslation } from "react-i18next";
import VoucherBadge from "./VoucherBadge";
import { useContext, useEffect, useRef, useState } from "react";
import ModalPromotion from "../Modal/ModalPromotion";
import { VoucherContext } from "../../data/VoucherContext";

export default function PromotionPanel() {
    const { voucherList, addItem, removeItem,errorVoucher,validLoading } = useContext(VoucherContext);
    const { t } = useTranslation();
    const [isEmptyCode, setIsEmptyCode] = useState(true);
    const [error, setError] = useState();
    const inputRef = useRef(null);
    const [isOpenDialog, setIsOpenDialog] = useState(false);

    useEffect(()=>{
       setError(errorVoucher);
    },[errorVoucher]);

    async function submitCodeHandler() {
        const value = inputRef.current.value.replace(/\s+/g, "").toUpperCase();

        if (await addItem(value) == false) {
            return;
        }

        inputRef.current.value = "";
        inputRef.current.focus();
        setIsEmptyCode(true);
        setError("");
    }

    function focusInputHandler(){
        setError("");
        setIsEmptyCode(true);
        inputRef.current.value="";
    }


    function removeCodeHandler(code) {
        removeItem(code);
    }

    function changeCodeHandler() {
        if (inputRef.current.value !== "") {
            setIsEmptyCode(false);
        }
        else {
            setIsEmptyCode(true);
        }
    }


    return (
        <>
            <h3 className="my-2 text-left text-lg font-medium text-gray-900 ">
                <span>{`${t("labelPromoCode")} `}</span>
                <i class="fa-solid fa-circle-info text-emerald-500 cursor-pointer" onClick={() => setIsOpenDialog(true)}></i>
            </h3>

            <div class="relative flex h-10 w-full min-w-[200px] max-w-[24rem]">
                <button
                    className="!absolute right-1 top-1 z-10 select-none rounded bg-yellow-500 py-1.55 px-4 
                    text-center align-middle font-sans text-xs font-bold uppercase text-white 
                    transition-all hover:shadow-lg hover:shadow-yellow-500/40 
                    focus:opacity-[0.85] focus:shadow-none active:opacity-[0.85] active:shadow-none 
                    disabled:cursor-not-allowed disabled:bg-gray-300
                    peer-placeholder-shown:pointer-events-none peer-placeholder-shown:bg-blue-gray-500 peer-placeholder-shown:opacity-50 peer-placeholder-shown:shadow-none"
                    type="button"
                    data-ripple-light="true"
                    onClick={() => submitCodeHandler()}
                    disabled={isEmptyCode||validLoading}
                >
                    {validLoading?<span className="loading loading-spinner loading-xs"></span>:t("btnApply")}
                </button>
                <input
                    ref={inputRef}
                    type="text"
                    class=" peer h-full w-full rounded-[7px]
                            border border-gray-300
                            placeholder-shown:border-t-blue-gray-200
                            bg-transparent
                            px-3 py-3 pr-20
                            text-sm text-blue-gray-700
                            focus:border-2 focus:border-yellow-500 focus:border-t-transparent
                            outline-none"
                    placeholder=" "
                    onChange={() => changeCodeHandler()}
                    onFocus={() => focusInputHandler()}
                    required
                />
                <label class="before:content[' '] after:content[' '] pointer-events-none 
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
            {errorVoucher && <p className="text-xs text-red-500 italic text-right">{error}</p>}

            <div className="my-3 flex flex-wrap gap-2">
                {voucherList.map(function (item) {
                    return (
                        <VoucherBadge key={item} vcCode={item} removeHandler={removeCodeHandler}></VoucherBadge>
                    )
                })}
            </div>

            <link
                rel="stylesheet"
                href="https://unpkg.com/@material-tailwind/html@latest/styles/material-tailwind.css"
            />

            <script src="https://unpkg.com/@material-tailwind/html@latest/scripts/ripple.js"></script>

            <ModalPromotion isOpen={isOpenDialog} onClose={() => setIsOpenDialog(false)}></ModalPromotion>
        </>);
}