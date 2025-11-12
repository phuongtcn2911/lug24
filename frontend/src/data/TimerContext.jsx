import { createContext, useContext, useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Timer } from "./Data";

export const TimerContext = createContext();

export const TimerProvider = ({ children }) => {
    const [remaining, setRemaining] = useState(checkStoredRemainingTimer);
    const [isActive, setIsActive] = useState(false);
    const navigate = useNavigate();
    const timerRef = useRef(null);


    const startTimer = () => setIsActive(true);
    const stopTimer = () => setIsActive(false);
    const resetTimer = () => setRemaining(Timer.sessionDur);

    function checkStoredRemainingTimer() {
        const storeTimer = sessionStorage.getItem("remainingTimer");
        if (storeTimer) {
            return JSON.parse(storeTimer);
        }
        else {
            return Timer.sessionDur;
        }
    }

    useEffect(() => {
        sessionStorage.setItem("remainingTimer", JSON.stringify(remaining));
    }, [remaining]);


    useEffect(() => {
        if (isActive) {
            timerRef.current = setInterval(() => {
                setRemaining((prev) => (prev > 0 ? prev - 1 : 0));
            }, 1000);
        }
        else {
            clearInterval(timerRef.current);
        }
        return () => clearInterval(timerRef.current);
    }, [isActive]);

    useEffect(() => {
        if (remaining === 0 && isActive) {
            stopTimer();
            resetTimer();
            navigate("/");
        }
    }, [remaining, isActive, navigate]);


    return (
        <TimerContext.Provider value={{ remaining, setRemaining, isActive, startTimer, stopTimer, resetTimer }}>
            {children}
        </TimerContext.Provider>
    );
};

// export const useCountdown = () => useContext(TimerContext);