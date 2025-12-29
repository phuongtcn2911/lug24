import { useEffect, useRef, useState } from "react";
import * as faceapi from "face-api.js";
import { beepSound } from "../../data/Data"
import { Loader2 } from "lucide-react";

export default function FaceVerify({ isOpen, onClose, onCapture }) {
    const videoRef = useRef(null);
    const canvasRef = useRef(null);
    const streamRef = useRef(null);
    const beep = useRef(new Audio(beepSound));

    const [captured, setCaptured] = useState(false);
    const [hint, setHint] = useState("Đưa khuôn mặt vào khung");

    /* =======================
      CONFIG KHUNG CHUẨN
   ======================= */
    const FRAME = {
        width: 208,   // w-52
        height: 256,  // h-64
        tolerance: 35
    };

    /* =======================
       1. Load face-api model
    ======================= */
    useEffect(() => {
        const loadModels = async () => {
            await faceapi.nets.tinyFaceDetector.loadFromUri("/models");
        };
        loadModels();
    }, []);

    /* =======================
       2. Start / Stop camera
    ======================= */
    useEffect(() => {
        if (!isOpen) return;

        startCamera();

        return () => {
            stopCamera();
        };
    }, [isOpen]);

    /* =======================
      RESET STATE
   ======================= */
    useEffect(() => {
        if (isOpen) {
            setCaptured(false);
            setHint("Đưa khuôn mặt vào khung");
        }
    }, [isOpen]);

    /* =======================
       4. Auto detect face
    ======================= */
    /* =======================
       AUTO DETECT + GỢI Ý
    ======================= */
    useEffect(() => {
        if (!isOpen) return;

        const detect = async () => {
            const video = videoRef.current;
            if (!video) return;
            if (!faceapi.nets.tinyFaceDetector.isLoaded) return;
            if (video.videoWidth === 0) return;
            if (captured) return;

            const detections = await faceapi.detectAllFaces(
                video,
                new faceapi.TinyFaceDetectorOptions({
                    inputSize: 416,
                    scoreThreshold: 0.6
                })
            );

            if (detections.length === 0) {
                setHint("Không thấy khuôn mặt");
                return;
            }

            if (detections.length > 1) {
                setHint("Chỉ để một khuôn mặt trong khung");
                return;
            }

            const box = detections[0].box;
            console.log("FACE BOX:", box.width, box.height);
            const message = analyzeFace(box);
            setHint(message);

            if (message === "Giữ nguyên, đang nhận diện…") {

                capture();
            }
        };

        const interval = setInterval(detect, 400);
        return () => clearInterval(interval);
    }, [isOpen, captured]);

    /* =======================
      PHÂN TÍCH GỢI Ý
   ======================= */
    const analyzeFace = (box) => {
        const video = videoRef.current;
        if (!video) return "Đang khởi động camera…";

        const videoW = video.videoWidth;
        const videoH = video.videoHeight;

        // TÂM KHUNG OVAL (giữa video)
        const frameCenterX = videoW / 2;
        const frameCenterY = videoH / 2;

        const faceCenterX = box.x + box.width / 2;
        const faceCenterY = box.y + box.height / 2;

        const dx = faceCenterX - frameCenterX;
        const dy = faceCenterY - frameCenterY;

        // Kiểm tra khoảng cách
        if (box.width < FRAME.width * 0.75) {
            return "Đưa khuôn mặt lại gần hơn";
        }

        if (dx > FRAME.tolerance) return "Dịch sang trái một chút";
        if (dx < -FRAME.tolerance) return "Dịch sang phải một chút";

        if (dy > FRAME.tolerance) return "Hạ khuôn mặt xuống";
        if (dy < -FRAME.tolerance) return "Nâng khuôn mặt lên";

        return "Giữ nguyên, đang nhận diện…";
    };

    /* =======================
       CAMERA HANDLER
    ======================= */
    const startCamera = async () => {
        try {

            if (!videoRef.current) {
                requestAnimationFrame(startCamera);
                return;
            }

            stopCamera();

            const stream = await navigator.mediaDevices.getUserMedia({
                video: {
                    facingMode: "user",
                    width: 540,
                    height: 720
                }
            });

            streamRef.current = stream;

            // ✅ check lại lần nữa
            if (!videoRef.current) return;

            videoRef.current.srcObject = stream;
            await videoRef.current.play();

        } catch (err) {
            console.error("Camera error:", err);
        }
    };

    const stopCamera = () => {
        if (streamRef.current) {
            streamRef.current.getTracks().forEach(track => track.stop());
            streamRef.current = null;
        }

        if (videoRef.current) {
            videoRef.current.srcObject = null;
        }
    };

    /* =======================
       AUTO CAPTURE
    ======================= */
    const capture = () => {
        if (captured) return;
        setCaptured(true);

        console.log("📸 CAPTURE TRIGGERED");

        const video = videoRef.current;
        const canvas = canvasRef.current;

        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;

        const ctx = canvas.getContext("2d");
        ctx.drawImage(video, 0, 0);

        canvas.toBlob(blob => {
            const file = new File([blob], "face.jpg", { type: "image/jpeg" });
            onCapture(file);
            if (beep.current) {
                beep.current.currentTime = 0;
                beep.current.play().catch(e => console.log("Không phát được âm thanh:", e));
            }

            // delay để thấy hiệu ứng chụp
            setTimeout(() => {
                onClose();
            }, 3000);

        }, "image/jpeg", 0.9);
    };

    if (!isOpen) return null;

    return (
        <div className="bg-gray-50 p-5 border border-gray-300 rounded-lg overflow-hidden">

            <div className="relative w-full h-[420px] bg-black rounded-lg overflow-hidden">

                {/* Camera */}
                <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    className="w-full h-full object-cover"
                />

                {/* Face frame */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className={`w-52 h-64 rounded-full opacity-80 border-8
                        ${!captured ? "border-white-400" : "border-emerald-500"}
                        `} />
                    {captured ?
                        <div className="absolute inset-0 flex items-center justify-center">
                            <Loader2 className="h-12 w-12 animate-spin text-white" />
                        </div> :
                        null}
                </div>



                <canvas ref={canvasRef} className="hidden" />
            </div>
            {/* GỢI Ý REALTIME */}
            <div className="w-full h-12 mt-5 flex bg-yellow-300 border border-2 rounded-lg border-yellow-400 items-center justify-center">
                <span className="text-heading text-lg font-semibold">{hint}</span>
            </div>
        </div>

    );
}