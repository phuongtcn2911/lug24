import QRCode from "qrcode";
import { signQRCode } from "./generator.js";

export async function generateQRCode(obj) {
  try {
    const jsonOBJ = JSON.stringify(obj);
    const qrDataURL = await QRCode.toDataURL(jsonOBJ, {
      errorCorrectionLevel: "M",
      width: 300,
      margin: 2,
      color: {
        dark: "#000000",
        light: "#ffffff",
      },
    });
    return qrDataURL;
  } catch (err) {
    console.error("Lỗi tạo QR:", err);
    return null;
  }
}

export async function generateQRCodeWithSignature(orderID) {
  try {
    const timestamp = Date.now();
    const data = `orderID=${orderID}&time=${timestamp}`;
    const signature = signQRCode(data);

    const qrData = `${data}&signature=${signature}`;
    const qrImgURL = await QRCode.toDataURL(qrData, {
      errorCorrectionLevel: "H",
      width: 300,
      margin: 4,
      type: "image/jpeg",
      color: {
        dark: "#363E44",
        light: "#FFFFFF"
      },
    });
    return { data: qrData, imgURL: qrImgURL };
  } catch (err) {
    console.error("Lỗi tạo QR: ", err);
    return null;
  }
}