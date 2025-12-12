export function DateStringFormat(date,lang="vi") {
    let formatString = "-";
    if (date != null) {
        const dateValue = new Date(date);
        formatString = dateValue.toLocaleString(lang==="vi"?"vi-VN":"en-US", {
            timezone: "Asia/Ho_Chi_Minh",
            weekday: "long",
            year: "numeric",
            month: "short",
            day: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
            hour12: true,
        });
    }
    return formatString;
}

export function FullDateStringByLang(date, lang="vi"){
    let formatString="-";
    if(date!=null)
    {
        const dateValue=new Date(date);
        formatString=dateValue.toLocaleString(
            lang==="vi"?"vi-VN":"en-US",
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

export function DateStringFormatWithoutWeekDay(date,lang="vi") {
    let formatString = "-";
    if (date != null) {
        const dateValue = new Date(date);
        formatString = dateValue.toLocaleString(lang==="vi"?"vi-VN":"en-US", {
            timezone: "Asia/Ho_Chi_Minh",
            year: "numeric",
            month: "short",
            day: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
            hour12: true,
        });
    }
    return formatString;
}