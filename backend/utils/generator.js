import crypto from "crypto";

// Hàm generateOrderCode
export function generateOrderCode() {
  // ví dụ: trả về 12 chữ số ngẫu nhiên
  return Math.floor(Math.random() * 1000000000000)
    .toString()
    .padStart(12, "0");
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
