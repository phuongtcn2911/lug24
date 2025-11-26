import { useState } from "react";
import { InputOrderCode } from "../../data/Data";
export function InputOrder() {

    const [error, setError] = useState();
    const [value, setValue] = useState("");
    const [isValid, setIsValid]=useState(false);

    function checkChangedValue(e){
        let text=e.target.value;
        if(text.length==0)
        {
            setValue();
        }
        else if(text.length)
        {

        }


    }

    // function setIsValid(e)
    // {

    // }

    return (
        <div id="mobile" className="h-full bg-white tab-content block p-4 content-center">
            <img src={InputOrderCode} className="object-cover mx-auto my-4" alt="inputCode"  ></img>
            <div className="relative w-96 mx-auto">
                <input
                    type="text"
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                    maxLength={9}
                    placeholder="Nhập mã đặt tủ"
                    className={`peer block transition-all duration-200
                        text-xl w-96 border rounded-lg px-4 mx-auto my-3 placeholder-gray-500 
                        focus:ring-1 focus:ring-emerald-500 outline-none
                        focus:h-16
                        focus:placeholder-transparent
                        ${value?"h-16 pt-3 uppercase font-semibold":"h-12 pt-3"}`}
                />
                <label className={`absolute left-3 top-2 text-emerald-500 text-xs transition-all pointer-events-none
                peer-focus:opacity-100 peer-focus:top-2 peer-focus:left-4
                ${value?
                    "top-2 left-4 opacity-100"
                    :
                    "top-5 left-10 opacity-0"
                }`}
            >Mã đặt tủ</label>
            </div>

            <button
                className="w-72 bg-gray-300 text-white py-2 my-2 rounded-lg cursor-not-allowed">
                Nhận OTP để mở tủ
            </button>
        </div>
    );
}