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