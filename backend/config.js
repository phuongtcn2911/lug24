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

export function getZaloConfig()
{
    const zlAppID=process.env.ZALO_APP_ID;
    const zlToken=process.env.ZALO_TOKEN;
    const zlZNS_API=process.env.ZALO_ZNS_API;
    const zlOTP_TPL_VN=process.env.ZALO_TPL_OTP_VN;
    const zlSecretKey=process.env.ZALO_SECRET_KEY;
    const zlGetAccessTokenAPI=process.env.ZALO_GET_ACCESS_TOKEN_API;
     if (!zlAppID || !zlToken || !zlZNS_API ||!zlOTP_TPL_VN||!zlSecretKey||!zlGetAccessTokenAPI) {
        throw new Error("Thiếu cấu hình Zalo");
    }

    return { zlAppID, zlToken, zlZNS_API,zlOTP_TPL_VN, zlSecretKey,zlGetAccessTokenAPI};
}

export function getGmailConfig()
{


}
