import { BigQuery } from "@google-cloud/bigquery";

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

export function getZaloConfig() {
    const zlAppID = process.env.ZALO_APP_ID;
    const zlToken = process.env.ZALO_TOKEN;
    const zlZNS_API = process.env.ZALO_ZNS_API;
    const zlOTP_TPL_VN = process.env.ZALO_TPL_OTP_VN;
    const zlRECEIPT_TPL_VN = process.env.ZALO_TPL_RECEIPT_VN;
    const zlRECEIPT_TPL_EN = process.env.ZALO_TPL_RECEIPT_EN;
    const zlSecretKey = process.env.ZALO_SECRET_KEY;
    const zlGetAccessTokenAPI = process.env.ZALO_GET_ACCESS_TOKEN_API;
    const zlRefreshToken = process.env.ZALO_REFRESH_TOKEN;
    const zlCodeOA = process.env.ZALO_CODE_OA;
    if (!zlAppID ||
        !zlToken ||
        !zlZNS_API ||
        !zlOTP_TPL_VN ||
        !zlSecretKey ||
        !zlGetAccessTokenAPI ||
        !zlRefreshToken ||
        !zlRECEIPT_TPL_VN ||
        !zlRECEIPT_TPL_EN ||
        !zlCodeOA) {
        throw new Error("Thiếu cấu hình Zalo");
    }

    return { zlAppID, zlToken, zlZNS_API, zlRECEIPT_TPL_VN, zlOTP_TPL_VN, zlRECEIPT_TPL_EN, zlSecretKey, zlGetAccessTokenAPI, zlRefreshToken, zlCodeOA };
}

export function getGmailConfig() {
    const gmailNoreplyID = process.env.EMAIL_NOREPLY;
    const gmailNoreplyPWD = process.env.EMAIL_NOREPLY_PWD;
    const gmailCS = process.env.EMAIL_CS;
    if (!gmailNoreplyID || !gmailNoreplyPWD || !gmailCS) {
        throw new Error("Thiếu cấu hình Gmail");
    }
    return { gmailNoreplyID, gmailNoreplyPWD, gmailCS };
}

export function getSepayConfig() {
    const spMerchantID = process.env.SEPAY_MERCHANT_ID;
    const spSecretKey = process.env.SEPAY_SECRET_KEY;
    if (!spSecretKey || !spMerchantID) {
        throw new Error("Thiếu cấu hình Sepay");
    }
    return { spSecretKey, spMerchantID };
}

export function getBigQueryConfig() {
    const projectID = process.env.GOOGLE_CONSOLE_PRJ_ID;
    const serviceAccount = process.env.GOOGLE_CONSOLE_SERVICE_ACC;

    if (!projectID||!serviceAccount) {
        throw new Error("Thiếu cấu hình Google Console - ProjectID");
    }

    let bigquery=new BigQuery({
            projectId:projectID,
            credentials:JSON.parse(serviceAccount)
    });
    return bigquery;
}

