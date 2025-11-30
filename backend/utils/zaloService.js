import axios from "axios";
import dotenv from "dotenv";
import { getZaloConfig } from "../config.js";
import { generateCodeChallenge } from "./generator.js";

dotenv.config();
const { zlAppID, zlToken, zlZNS_API, zlOTP_TPL_VN, zlSecretKey, zlGetAccessTokenAPI, zlRefreshToken, zlCodeOA } = getZaloConfig();

let accessToken = null;
let tokenExpiry = null;

// async function getAccessToken() {
//     try {
//         console.log("App ID: ", zlAppID);
//         const res = await axios.post(
//             zlGetAccessTokenAPI,
//             {
//                 app_id: Number(zlAppID),
//                 grant_type: "refresh_token",
//                 refresh_token: zlRefreshToken
//             },
//             {
//                 headers: { "Content-Type": "application/json" }
//             }
//         );

//         const data = res.data;

//         if (data.access_token) {
//             accessToken = data.access_token;
//             tokenExpiry = Date.now() + (data.expires_in - 60) * 1000; // refresh trước 60s
//             console.log("Access Token:", accessToken);
//             console.log("Expires in:", data.expires_in, "seconds");
//             return accessToken;
//         } else {
//             console.error("Lỗi lấy access token:", data);
//             throw new Error(JSON.stringify(data));
//         }
//     }
//     catch (err) {
//         console.error("Lỗi lấy Access Token:", err.response?.data || err.message);
//         throw err;
//     }
// }

export async function generateZaloAuthURL(appId, redirectUri, state) {
    // try {
    const { verifier, challenge } = generateVerifierCode();

    const params = new URLSearchParams({
        app_id: appId,
        redirect_uri: redirectUri,
        response_type: "code",
        scope: "openid", // hoặc "ZNS" nếu cần
        state: state || Date.now().toString(),
        code_challenge: challenge,
        code_challenge_method: "S256"
    });

    const url = `https://oauth.zaloapp.com/v4/oa/permission?${params.toString()}`;
    return { url, verifier };
}

export async function getAccessToken(authCode, codeVerifier) {
    try {
        const res = await axios.post(
            "https://oauth.zaloapp.com/v4/oa/access_token",
            new URLSearchParams({
                app_id: APP_ID,
                grant_type: "authorization_code",
                code: authCode,
                code_verifier: codeVerifier
            }),
            {
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                    "secret_key": SECRET_KEY
                }
            }
        );

        const data = res.data;
        if (data.access_token) {
            accessToken = data.access_token;
            tokenExpiry = Date.now() + (data.expires_in - 60) * 1000; // refresh trước 60s
            return accessToken;
        } else {
            throw new Error(JSON.stringify(data));
        }
    } catch (err) {
        console.error("Lỗi lấy Access Token:", err.response?.data || err.message);
        throw err;
    }
}

export async function refreshAccessToken() {
    try {
        const res = await axios.post(
            zlGetAccessTokenAPI,
            {
                app_id: Number(zlAppID),
                grant_type: "refresh_token",
                refresh_token: zlRefreshToken
            },
            {
                headers:
                {
                    "Content-Type": "application/json"
                }
            }
        );

        const data = res.data;
        if (data.access_token) {
            accessToken = data.access_token;
            tokenExpiry = Date.now() + (data.expires_in - 60) * 1000;
            console.log("Access Token mới: ", accessToken);
            return accessToken;
        }
        else {
            throw new Error(JSON.stringify(data));
        }
    }
    catch (err) {
        console.error("Lỗi refresh access token:", err.response?.data || err.message);
        throw err;
    }
}

export async function getValidAccessToken() {
  if (!accessToken) return await refreshAccessToken();
  if (tokenExpiry && Date.now() >= tokenExpiry) return await refreshAccessToken();
  return accessToken;
}



