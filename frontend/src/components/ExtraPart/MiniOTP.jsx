import { useState, useRef, useEffect } from "react";
import { Timer } from "../../data/Data";
import { useCountdown } from "../../utils/Countdown";
export default function MiniOTP({ isOpen, closeOTP }) {
    const [otp, setOTP] = useState(["", "", "", "", "", ""]);
    const [isReactive, setIsReactive] = useState(true);
    const [firstLoad,setFirstLoad]=useState(true);

    const validOTPClock = useCountdown(Timer.validOTPDur);
    const resendClock = useCountdown(Timer.resendOTP);


    useEffect(() => {
        if (!isOpen) return;
setIsReactive(true);
        validOTPClock.startCoundown();
    }, [isOpen]);

    useEffect(() => {
        if (validOTPClock.isActive) {
            setIsReactive(false);
        }
        else {
            setIsReactive(true);
        }
    }, [validOTPClock.isActive]);

    const inputsRef = useRef([]);

    let timelapseMin = Math.floor(validOTPClock.time / 60);
    let timelapseSec = validOTPClock.time % 60;

    function resendOTP() {
        if(isReactive){
            setIsReactive(false);
            resendClock.startCoundown();
            validOTPClock.resetCountdown();
            validOTPClock.startCoundown();
            setFirstLoad(false);
        }
    }

    useEffect(() => {
        if (resendClock.isActive) {
            setIsReactive(false);
        }
        else {
            setIsReactive(true);
        }
    }, [resendClock.isActive]);


    const handleInput = (e, index) => {
        const value = e.target.value;
        if (!/^\d?$/.test(value)) return; // chỉ cho nhập 1 chữ số

        const newOtp = [...otp];
        newOtp[index] = value;
        setOTP([...newOtp]);

        // nếu có số thì chuyển focus sang ô kế tiếp
        if (value && index < 5) {
            const nextInput = inputsRef.current[index + 1];
            if (nextInput) {
                setTimeout(() => {
                    nextInput.focus();
                    nextInput.select();
                }, 10);
            }
        }
    };

    const handleKeyDown = (e, index) => {
        if (e.key === "Backspace" && !otp[index] && index > 0) {
            // nếu xoá khi ô trống -> focus về ô trước
            inputsRef.current[index - 1].focus();
            inputsRef.current[index - 1].select();
        }
    };

    return (
        <>
            <div id="otpModal" className={`fixed inset-0 bg-black/40 flex items-center justify-center z-50 ${isOpen ? "" : "hidden"}`}>
                <div className="bg-white w-[400px] rounded-xl p-5 shadow-lg relative">
                    <button
                        className="absolute top-5 right-5 w-8 h-8 rounded-full 
                                flex items-center justify-center
                                bg-gray-100 hover:bg-gray-200
                                text-gray-600 hover:text-black
                                shadow-sm"
                        onClick={closeOTP}
                    >
                        ✕
                    </button>
                    {/* <!-- Title --> */}
                    <h2 className="text-xl font-semibold text-center mb-5">Xác thực OTP</h2>
                    <p className="text-center text-gray-600 text-sm mb-4">
                        Vui lòng nhập mã OTP vừa gửi tới số điện thoại<br />
                        <span className="font-bold text-orange-500">094*****68</span>
                    </p>

                    {/* <!-- OTP Inputs --> */}
                    <div className="flex justify-between gap-3 mb-4">
                        {otp.map((val, index) => (
                            <input
                                key={index}
                                className="inpt otp-input"
                                type="text"
                                maxLength={1}
                                inputMode="numeric"
                                onInput={(e) => handleInput(e, index)}
                                onKeyDown={(e) => handleKeyDown(e, index)}
                                onFocus={(e) => e.target.select()}
                                ref={(el) => (inputsRef.current[index] = el)}
                            />
                        ))}
                    </div>

                    {/* <!-- Resend row --> */}
                    <div className="flex justify-between items-baseline text-sm mb-3">
                        {/* <button id="resendBtn" class="text-red-600 font-medium flex items-center gap-1"> */}
                        {/* </button> */}
                        <a className={`flex items-baseline group 
                        ${isReactive ? "" : "cursor-not-allowed "}`} onClick={() => resendOTP()}>
                            <i className={`fa-solid fa-rotate text-lg mr-2 
                                ${isReactive ?
                                    "text-orange-500 transition-transform duration-300 group-hover:rotate-[120deg]" :
                                    "text-gray-400"}`}></i>
                            <span className={`${isReactive ? "text-orange-500" : "text-gray-400"}`}>{`Gửi lại mã ${!isReactive&&!firstLoad ? "(" + resendClock.time + ")" : ""}`}</span>

                        </a>
                        <span className="text-gray-500">Mã sẽ hết hạn sau <span id="expire" className="font-bold text-orange-500">{`${String(timelapseMin).padStart(2, '0')}:${String(timelapseSec).padStart(2, '0')}`}</span></span>
                    </div>

                    {/* <!-- Buttons --> */}
                    <div className="flex justify-center">
                        <button className="w-56 px-4 py-2 bg-yellow-400 text-white rounded-lg hover:bg-yellow-500">
                            Xác nhận
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
}