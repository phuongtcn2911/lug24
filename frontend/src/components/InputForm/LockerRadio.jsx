import { useTranslation } from "react-i18next";

export default function LockerRadio({key, title, sizeDesc, amount, name }) {
    const {t}=useTranslation();
    return (
        <label  key={key} 
                className="
                    flex-1 border rounded-lg p-4 select-none cursor-pointer 
                    bg-white
                    hover:border-yellow-500
                    peer-checked:border-yellow-600 relative">
            <input type="radio" name={name} className="peer sr-only" />
            <div className="flex flex-col text-left">
                <span className="text-2xl font-bold text-gray-800">{title}</span>
                <span className="text-gray-400 text-sm">{sizeDesc}</span>
                <span className="mt-2 text-gray-800 text-sm font-medium">{`Số tủ trống: ${amount}`}</span>
            </div>
           
            <i className="absolute top-5 right-3 w-5 h-5 text-yellow-500 fa-lg fa-solid fa-circle-check hidden peer-checked:block"></i>
            <i className="absolute top-5 right-3 w-5 h-5 text-yellow-500 fa-lg far fa-circle peer-checked:hidden"></i>
        
        </label>
    );

}