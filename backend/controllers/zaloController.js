import axios from "axios"
import { config } from "dotenv";
import { getZaloConfig } from "../config.js";
import { macCode } from "../utils/generator.js";
import { getValidAccessToken } from "../utils/zaloService.js";
import { initI18n, dict } from "../routes/i18n.js";

config();
const { zlAppID, zlToken, zlZNS_API, zlOTP_TPL_VN, zlSecretKey, zlGetAccessTokenAPI, zlRECEIPT_TPL_VN ,zlRECEIPT_TPL_EN} = getZaloConfig();
await initI18n();

export async function sendOTPZalo(receiver, otp, lang = "vi") {
  try {
    // const token=await getValidAccessToken();

    const timestamp = Date.now();
    const header = {
      headers: {
        "Content-type": "application/json",
        "access_token": zlToken
      }
    }
    const zaloPhone = "84" + String(receiver.mobile).slice(-9);
    const config = {
      mode: "development",
      phone: zaloPhone,
      template_id: lang === "vi" ? String(zlOTP_TPL_VN) : String(zlOTP_TPL_VN),
      template_data: {
        otp: String(otp)
      },
      tracking_id: `track_${timestamp}`
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

export async function sendReceiptZalo(receipt, lang = "vi") {
  try {
    const timestamp = Date.now();
    const header = {
      headers: {
        "Content-type": "application/json",
        "access_token": zlToken
      }
    }
    const zaloPhone = "84" + String(receipt.customer.mobile).slice(-9);
    const config = {
      mode: "development",
      phone: zaloPhone,
      template_id: lang === "vi" ? zlRECEIPT_TPL_VN : zlRECEIPT_TPL_EN,
      template_data: {
        customerName: receipt.customer.fullName,
        checkIn: new Date(receipt.order.checkIn).toLocaleString(lang==="vi"?"vi-VN":"en-US",{
          day:'2-digit',
          month:'short',
          year:"numeric",
          hour:"2-digit",
          minute:"2-digit",
          hour12:false
        }),
        checkOut: new Date(receipt.order.checkOut).toLocaleString(lang==="vi"?"vi-VN":"en-US",{
          day:'2-digit',
          month:'short',
          year:"numeric",
          hour:"2-digit",
          minute:"2-digit",
          hour12:false
        }),
        lockerSize: receipt.locker.sizeLetter,
        lockerNo: receipt.locker.id,
        orderID: receipt.order.subID,
        loc_Name: dict("locationName"),
        loc_Address: dict("locationAddress"),
        loc_OpenTime: dict("locationWorkingTime.open"),
        loc_CloseTime: dict("locationWorkingTime.closed"),
      },
      tracking_id: `track_${timestamp}`
    };

    const response = await axios.post(zlZNS_API, config, header);
    console.log(response.data);
    return response.data;
  } catch (err) {
    console.error("ZNS error:", err.response?.data || err);
    throw err;
  }

}

