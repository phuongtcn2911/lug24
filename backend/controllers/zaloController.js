import axios from "axios"
import { config } from "dotenv";
import { getZaloConfig } from "../config.js";
import { macCode } from "../utils/generator.js";

config();
const { zlAppID, zlToken, zlZNS_API, zlOTP_TPL_VN, zlSecretKey, zlGetAccessTokenAPI } = getZaloConfig();

// async function getAccessToken() {
//   const body = {
//     app_id: zlAppID,
//     app_secret: zlSecretKey,
//     grant_type: "client_credentials",
//   };
//   const header = {
//     headers: {
//       "Content-Type": "application/json"
//     }
//   }
//   const res = await axios.post(zlGetAccessTokenAPI, body, header);
//   console.log("Access Token Response:", res.data);
//   return res.data.access_token;
// }

export async function sendOTPZalo(receiver, otp, lang = "vi") {
  try {
    const timestamp = Date.now();
    const header = {
      headers: {
        "Content-type": "application/json",
        "access_token": zlToken
      }
    }
    const config = {
      mode:"development",
      phone: receiver.mobile,
      template_id: lang === "vi" ? String(zlOTP_TPL_VN) : String(zlOTP_TPL_VN),
      template_data: {
        otp: String(otp)
      },
      tracking_id:`track_${timestamp}`
    };

    console.log("ZNS Header: ", header);
    console.log("ZNS Body: ", config);
    const response = await axios.post(zlZNS_API, config, header);
    console.log(response.data);
    return response.data;

  } catch (err) {
    console.error("ZNS error:", err.response?.data || err);
    throw err;
  }
}

