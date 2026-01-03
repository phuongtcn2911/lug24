import { useEffect } from "react";
import { createPortal } from "react-dom";

export default function ModalBase({ isOpen, onClose, children, disableBackdropClose = false }) {
    useEffect(() => {
        if (!isOpen) return;

        const onEsc = (e) => {
            if (e.key === "Escape") onClose();
        };

        document.addEventListener("keydown", onEsc);
        document.body.style.overflow = "hidden";

        return () => {
            document.removeEventListener("keydown", onEsc);
            document.body.style.overflow = "";
        };
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    return createPortal(
        <div className="fixed inset-0 z-50 flex justify-center items-center">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/50"
                onClick={() => {
                    if (!disableBackdropClose)
                        onClose();
                }}
            />

            {/* Modal */}
            <div className={`relative z-10 max-h-[80vh] overflow-hidden ${isOpen ? "animate-fadeIn" : "animate-fadeOut"}`}
                onClick={(e) => { e.stopPropagation(); }}>
                {children}
            </div>
        </div>,
        document.body
    );
}