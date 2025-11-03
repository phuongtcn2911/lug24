const QRCode = require("qrcode");



async function generateQRCode(obj) {
    try {
        const jsonOBJ = JSON.stringify(obj);
        const qrDataURL= await QRCode.toDataURL(jsonOBJ, { 
            errorCorrectionLevel:"M",
            width:300,
            margin:2,
            color:{
                dark:'#000000',
                light:'#ffffff',
            }
         });
         return qrDataURL;
    }
    catch (err) {
        console.error('Lỗi tạo QR:', err);
        return null;
    }

}

module.exports = { generateQRCode }