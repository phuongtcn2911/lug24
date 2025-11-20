// backend/utils/i18n.js
import i18next from "i18next";
import fs from "fs";
import path from "path";

// Hàm load JSON từ file, đường dẫn tuyệt đối từ root
function loadLocaleJSON(lng, ns) {
  try {
    // Vercel sẽ chạy từ thư mục gốc repo
    const filePath = path.resolve('./backend/locales', lng, `${ns}.json`);
    const content = fs.readFileSync(filePath, "utf8");
    return JSON.parse(content);
  } catch (err) {
    console.error(`Cannot load locales/${lng}/${ns}.json`, err);
    return {};
  }
}

// Khởi tạo i18next
i18next.init({
  fallbackLng: "vi",
  lng: "vi", // mặc định
  ns: ["otpMail", "receiptMail", "translation"],
  defaultNS: "translation",
  resources: {
    vi: {
      otpMail: loadLocaleJSON("vi", "otpMail"),
      receiptMail: loadLocaleJSON("vi", "receiptMail"),
      translation: loadLocaleJSON("vi", "translation"),
    },
    en: {
      otpMail: loadLocaleJSON("en", "otpMail"),
      receiptMail: loadLocaleJSON("en", "receiptMail"),
      translation: loadLocaleJSON("en", "translation"),
    },
  },
});

// Hàm lấy translator cố định theo ngôn ngữ
export function getTranslator(lang = "vi") {
  return i18next.getFixedT(lang);
}

export default i18next;

// import i18next from "i18next";
// import Backend from "i18next-fs-backend";
// import middleware from "i18next-http-middleware";
// import path from "path";
// import { fileURLToPath } from "url";

// const _filename=fileURLToPath(import.meta.url);
// const _dirname=path.dirname(_filename);

//  i18next.use(Backend).use(middleware.LanguageDetector).init({
//     fallbackLng:"vi",
//     backend:{
//         loadPath:path.resolve('.',"locales/{{lng}}/{{ns}}.json"),
//     },
//     preload:["vi","en"],
//     ns:["otpMail","receiptMail","translation"],
//     defaultNS:"translation",
// });

// export default i18next;
// export {middleware};