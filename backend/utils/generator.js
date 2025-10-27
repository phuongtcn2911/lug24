const crypto=require("crypto");

// Hàm generateOrderCode
function generateOrderCode() {
  // ví dụ: trả về 12 chữ số ngẫu nhiên
  return Math.floor(Math.random() * 1000000000000)
    .toString()
    .padStart(12, '0');
}

function hashCode(sth){
    return crypto.createHash("sha256").update(String(sth)).digest("hex");
}

function generateOTP(){
    const otp=Math.floor(100000+Math.random()*900000);
    const hashOTP=hashCode(otp);
    return {otp,hashOTP};
}

module.exports={generateOrderCode,hashCode,generateOTP};