import { useCallback, useRef, useState } from "react";

export function useCountdown(clock=60){
    const [time, setTime]=useState(clock);
    const [isActive,setIsActive]=useState(false);
    const timerRef=useRef(null);

    const startCoundown=useCallback((duration=clock)=>{
        if(timerRef.current) {
            clearInterval(timerRef.current);
        }

        setTime(duration);
        setIsActive(true);

        timerRef.current=setInterval(()=>{
            setTime(prev=>{
                if(prev<=1){
                    clearInterval(timerRef.current);
                    timerRef.current=null;
                    setIsActive(false);
                    return 0;
                }
                return prev-1;
            });
        },1000);
    },[clock]);

    const stopCountdown=()=>{
        if(timerRef.current){
            clearInterval(timerRef.current);
            timerRef.current=null;
        }
        setIsActive(false);
    }

    const resetCountdown=()=>{
        stopCountdown();
        setTime(clock);
    }

    return {time, isActive,startCoundown,stopCountdown,resetCountdown}

}