export function DateStringFormat(date) {
    let formatString = "-";
    if (date != null) {
        const dateValue = new Date(date);
        formatString = dateValue.toLocaleString("vi-VN", {
            timezone: "Asia/Ho_Chi_Minh",
            weekday: "long",
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
            hour12: true,
        });
    }
    return formatString;
}

export function FullDateStringByLang(date, langIndex=0){
    let formatString="-";
    if(date!=null)
    {
        const dateValue=new Date(date);
        formatString=dateValue.toLocaleString(
            langIndex===0?"vi-VN":"en-US",
            {
                timezone:"Asia/Ho_Chi_Minh",
                year:"numeric",
                month:"short",
                day:"2-digit",
                weekday:"long",
            }
        );

    }
    return formatString;
}

export function FullVNTimeZoneString(clock){
    let formatString="--:--:--";
    if(clock!=null)
    {
        const timerValue=new Date(clock);
        formatString=timerValue.toLocaleTimeString(
            "vi-VN",
            {
                timeZone:"Asia/Ho_Chi_Minh",
                hour:"2-digit",
                minute:"2-digit",
                second:"2-digit",
                hour12:false,
            }
        );

    }
    return formatString;
}

export function DateStringFormatWithoutWeekDay(date) {
    let formatString = "-";
    if (date != null) {
        const dateValue = new Date(date);
        formatString = dateValue.toLocaleString("vi-VN", {
            timezone: "Asia/Ho_Chi_Minh",
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
            hour12: true,
        });
    }
    return formatString;
}