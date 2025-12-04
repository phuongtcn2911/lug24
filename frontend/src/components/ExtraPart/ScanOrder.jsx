import { BrowserMultiFormatReader } from "@zxing/browser"
import { useEffect, useRef, useState } from "react"
import { detect_QR, beepSound, } from "../../data/Data"
import { Loader2 } from "lucide-react";
import api from "../../config/axios";
import { useTranslation } from "react-i18next";
export function ScanOrder() {
    const videoRef = useRef(null);
    const [result, setResult] = useState("");
    const [isDetected, setIsDetected] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isValidQR, setIsValidQR] = useState(false);
    const [error, setError] = useState("");
    const { t, i18n } = useTranslation();

    const codeReaderRef = useRef(null);
    const detectedRef = useRef(false);
    const beep = useRef(new Audio(beepSound));
    let lastLog = useRef(0);

    useEffect(() => {
        startScan();
        return () => {
            stopCamera();
        }
    }, []);

    function startScan() {
        if (videoRef.current) {
            const codeReader = new BrowserMultiFormatReader();
            codeReaderRef.current = codeReader;

            const constraints = {
                video: {
                    width: { ideal: 320 },
                    height: { ideal: 320 },
                    facingMode: "environment",
                    advanced: [{ focusMode: "continuous" }]
                },
            };


            codeReader.decodeFromConstraints(constraints, videoRef.current, handleDecode);

        }
    }

    //Callback xử lý kết quả quét
    async function handleDecode(result, err) {
        if (detectedRef.current) return;

        const now = Date.now();
        if (result && !detectedRef.current && now - lastLog.current > 200) {
            if (beep.current) {
                beep.current.currentTime = 0;
                beep.current.play().catch(e => console.log("Không phát được âm thanh:", e));
            }

            detectedRef.current = true;
            lastLog.current = now;

            const text = result.getText();
            
            // setResult(text);
            setIsLoading(true);
            await checkContentQR(text);
            
            setIsDetected(true);

            // stopCamera();
        }
        if (err && err.name !== "NotFoundException") {
            if (now - lastLog.current > 2000) {
                lastLog.current = now;
                console.warn("Không thấy mã...");
            }
        }

    }

    function stopCamera() {
        if (videoRef.current?.srcObject) {
            const stream = videoRef.current.srcObject;
            const tracks = stream.getTracks();
            tracks.forEach(track => track.stop());
            videoRef.current.srcObject = null;
        }
    }

    function resetScan() {
        setIsDetected(false);
        detectedRef.current = false;
        setResult("");
        setError("");
        stopCamera();
        startScan();
    }

    async function checkContentQR(text) {

        new Promise(resolve => setTimeout(resolve, 3000));
        const res = await api.post("api/readQRCode", { obj: text });
        console.log(res);
        //Giao tiếp vs backend có kết quả lưu trong data
        if (res.status === 200) {
            const statusResult = res.data.code;
            if (statusResult === -1) {
                setError(t("scanQRInvalidNoti"));
            }
            else if (statusResult === 1) {
                const qrData = res.data.data;
                setResult(qrData.orderID);
                setError("");
            }
        }
        setIsLoading(false);
    }

    return (

        <div id="internet" className="h-full bg-white tab-content block p-4 content-center">

            <div className="relative size-72 mx-auto flex justify-center items-center">
                <video
                    ref={videoRef}
                    className={`size-64 object-cover rounded-xl transition-all duration-500
                    ${isDetected ? "blur-md brightness-75" : ""}`}
                    autoPlay muted playsInline>
                </video>
                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="relative w-56 h-56 border-2 border-white/40 ">
                        <span className="absolute top-0 left-0 w-8 h-1 bg-white"></span>
                        <span className="absolute top-0 left-0 w-1 h-8 bg-white"></span>

                        <span className="absolute top-0 right-0 w-8 h-1 bg-white"></span>
                        <span className="absolute top-0 right-0 w-1 h-8 bg-white"></span>

                        <span className="absolute bottom-0 left-0 w-8 h-1 bg-white"></span>
                        <span className="absolute bottom-0 left-0 w-1 h-8 bg-white"></span>

                        <span className="absolute bottom-0 right-0 w-8 h-1 bg-white"></span>
                        <span className="absolute bottom-0 right-0 w-1 h-8 bg-white"></span>

                        <div className="absolute inset-x-0 top-0 h-0.5 bg-emerald-300 animate-scan"></div>
                        {isLoading == true ?
                            <div className="absolute inset-0 flex items-center justify-center">
                                <Loader2 className="h-12 w-12 animate-spin text-white" />
                            </div>
                            :
                            isDetected ?
                                <img
                                    src={detect_QR} // đường dẫn ảnh bạn muốn
                                    alt="Detected"
                                    className="absolute inset-0 w-24 h-24 mx-auto my-auto object-contain animate-detect cursor-pointer"
                                    onClick={() => resetScan()}
                                /> : ""
                        }


                        {/* {isDetected && (
                            <img
                                src={detect_QR} // đường dẫn ảnh bạn muốn
                                alt="Detected"
                                className="absolute inset-0 w-24 h-24 mx-auto my-auto object-contain animate-detect cursor-pointer"
                                onClick={() => resetScan()}
                            />
                        )} */}
                    </div>
                </div>

            </div>
            {/* <p className="text-xs italic mb-3 text-center mx-4">{error}</p> */}
            <div className="relative w-96 mx-auto my-3">
                <input
                    type="text"
                    placeholder={!error ? t("plchldScanCodeID") : t("scanQRInvalidNoti")}
                    className={`text-center w-72 h-12 px-4 rounded-lg mx-auto border border-gray-300 placeholder-gray-500 focus:ring-0 focus:outline-none
                        ${result ? "text-xl uppercase font-semibold border-b-4 border-b-emerald-600" :
                            error ? "text-lg border-b-4 border-b-red-600 placeholder-red-500" : "text-lg "}`}
                    value={result}
                    readOnly
                />
            </div>

            <button
                className={`py-2 rounded-lg text-white
                ${isDetected ? "bg-yellow-400" : "bg-gray-300 cursor-not-allowed"} `}>
                {t("btnSendOTP")}
            </button>
        </div>
    )
}