import crypto from "crypto";
import { access } from "fs";
import dotenv from "dotenv";

dotenv.config();

// Hàm generateOrderCode
export function generateOrderID() {
  // ví dụ: trả về 12 chữ số ngẫu nhiên
  const randomNumber=Math.floor(Math.random() * 1000000);
  return `LUG${randomNumber.toString().padStart(6, "0")}`;
}

export function generateCustomerID(){
  const randomNumber=Math.floor(Math.random()*1000000);
  return `CUS${randomNumber}`;
}

export function hashCode(sth) {
  return crypto.createHash("sha256").update(String(sth)).digest("hex");
}

export function generateOTP() {
  const otp = Math.floor(100000 + Math.random() * 900000);
  const hashOTP = hashCode(otp);
  return { otp, hashOTP };
}

export function macCode(app_sc,app_id,timestamp,body){
  return crypto.createHmac("sha256",app_sc).update(app_id+timestamp+JSON.stringify(body)).digest("hex");
}

export function generateCodeVerifier(length = 43) {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let verifier = "";
  for (let i = 0; i < length; i++) {
    verifier += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return verifier;
}

export function generateCodeChallenge(verifier) {
  const hash = crypto.createHash("sha256").update(verifier).digest();
  const base64 = hash.toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
  return base64;
}

export function generateVerifierCode() {
  const verifier = generateCodeVerifier();
  const challenge = generateCodeChallenge(verifier);
  return { verifier, challenge };
}

export function signQRCode(data){
  return crypto.createHmac("sha256",process.env.QR_SIGNATURE).update(data).digest("hex");
}


export function verifySignature(text){
  const parts=text.split("&signature=");
  if(parts.length!==2) return false;
  const raw=parts[0];
  const importSignature=parts[1];

  const originalSignature=crypto.createHmac("sha256",process.env.QR_SIGNATURE).update(raw).digest("hex");
  return importSignature===originalSignature;
}


