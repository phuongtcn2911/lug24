import { useContext, useState } from "react";
import { useTranslation } from "react-i18next";
import { VoucherContext } from "../../data/VoucherContext";

export default function PromotionItem({ id, name, value, voucherCode, voucherTitle, voucherExpireDate, note }) {
    const [checked, setChecked] = useState(false);
    const {addItem,removeItem}=useContext(VoucherContext);
    const {t}=useTranslation();


    function onChangeHandler(e){
        const status=e.target.checked;
        if(status){
            addVoucherToList(e);
        }
        else{
            removeVoucherFromList(e);
        }
        setChecked(status);
    }

    function addVoucherToList(e){
        
        const code = e.target.value;
        const result=addItem(code);

        if(result==false){

        }
    }

    function removeVoucherFromList(e){
        const code =e.target.value;
        removeItem(code);
    }
    return (
        <>
            <div className=" mt-4 bg-white border border-gray-300 rounded-lg ">
                <input type="checkbox" id={id}
                    name={name}
                    value={value}
                    className="hidden peer"
                    checked={checked}
                    onChange={onChangeHandler}
                    required />
                <label
                    htmlFor={id}
                    className=" inline-flex items-center w-full  px-3 py-2
                                        rounded-base
                                        cursor-pointer hover:bg-neutral-secondary-medium
                                        peer-checked:bg-brand-softer peer-checked:border-brand-subtle
                                        peer-checked:text-fg-brand-strong"
                >

                    <div className="flex items-center justify-center w-9 h-9 rounded bg-brand-soft text-fg-brand-strong">
                        <i className="fa-solid fa-ticket fa-2x -rotate-45"></i>
                    </div>

                    <div className="ms-5 flex-1 my-1">
                        <div className="w-full  text-base font-semibold text-yellow-500 mb-0">{voucherCode}</div>
                        <div className="w-full text-sm mt-0">{voucherTitle}</div>
                        <div className="w-full text-xs text-emerald-500">{`${t("labelExpiredDate")}: ${voucherExpireDate == null ? t("labelUnlimited") : voucherExpireDate}`}</div>


                    </div>
                    {
                        checked ? (
                            <i className="text-yellow-500 fa-lg fa-solid fa-circle-check" />
                        ) : (
                            <i className="text-yellow-500 fa-lg far fa-circle"></i>
                        )
                    }
                </label>

            </div>
            <div className="w-full text-xs font-italic text-yellow-600 mt-1 mb-4">{note}</div>

        </>
    );
}