export function getSmartLockerConfig() {
    const apiURL = process.env.SMARTLOCKER_API;
    const apiKey = process.env.SMARTLOCKER_TOKEN;
    const deviceNo = process.env.DEVICE_NO;
    const apiSelfURL = process.env.SMARTLOCKER_SELF_API;

    if (!apiURL || !apiKey || !deviceNo) {
        throw new Error("Thiếu cấu hình API hoặc DEVICE_NO");
    }

    return { apiURL, apiKey, deviceNo, apiSelfURL };
}
