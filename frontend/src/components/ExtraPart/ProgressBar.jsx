import React, { useContext } from "react"
import { CreditCard, KeyRound, LockKeyholeOpen, LockKeyhole } from "lucide-react";
import "./CSS/ProgressBar.css"
import { PaymentProgressContext } from "../../data/PaymentProgressContext";
import { useTranslation } from "react-i18next";

export default function ProgressBar() {
    const {t, i18n}=useTranslation();
    const {progress}=useContext(PaymentProgressContext);
    
    const steps = [
        { label: t("progressStatus.0"), icon: <CreditCard size={20} /> },
        { label: t("progressStatus.1"), icon: <KeyRound size={20} /> },
        { label: t("progressStatus.2"), icon: <LockKeyholeOpen size={20} /> },
        { label: t("progressStatus.3"), icon: <LockKeyhole size={20} /> },
    ];

    return (

        <fieldset className="group mb-5">
            <div className="p-0 is-vcentered has-text-centered progress-container" data-step={progress.step}>
                {/* Thanh ngang chính */}
                <div className="progress-line"></div>

                <div className="columns m-0 is-mobile is-vcentered">
                    {steps.map((step, index) => {
                        const isActive = index + 1 === progress.step;
                        const isCompleted = index + 1 < progress.step;

                        return (
                            <div key={index} className="column">
                                <div className="is-flex is-flex-direction-column is-align-items-center">
                                    <div
                                        className={`circle ${isCompleted
                                            ? "is-completed"
                                            : isActive
                                                ? "is-active"
                                                : ""
                                            }`}
                                    >
                                        {step.icon}
                                    </div>
                                    <p
                                        className={`mt-2 is-size-7 ${isActive || isCompleted
                                            ? "has-text-warning-dark"
                                            : "has-text-grey-light"
                                            }`}
                                    >
                                        {step.label}
                                    </p>
                                </div>
                            </div>
                        );
                    })}
                </div>


            </div>

        </fieldset>



    );
}