import FaceVerify from "../ExtraPart/FaceVerify";
import FaceVerifyGuide from "../ExtraPart/FaceVerifyGuide";
import ModalBase from "./ModalBase";
import { useEffect, useState, useContext } from "react";


export default function ModalFaceRecognize({ isOpen, onClose, onCapture,disableBackdropClose }) {
    const [step, setStep] = useState(1);

    useEffect(() => {
        if (isOpen) {
            setStep(1)
        }
    }, [isOpen]);
    return (
        <ModalBase isOpen={isOpen} onClose={onClose} disableBackdropClose={disableBackdropClose}>
            <div className="h-full flex flex-col overflow-hidden">
                <div
                    key={step}
                    className="w-full transition-transform duration-300 animate-slideInRight">
                    {
                        step === 1 ?
                            <FaceVerifyGuide onClick={() => setStep(2)}></FaceVerifyGuide> :
                            <FaceVerify isOpen={isOpen}
                                onClose={onClose}
                                onCapture={onCapture}
                            ></FaceVerify>
                    }
                </div>
            </div>
        </ModalBase>
    );
}