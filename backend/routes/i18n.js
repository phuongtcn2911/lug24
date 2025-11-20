// backend/utils/i18n.js
import i18next from "i18next";

// import JSON trực tiếp (ESM + Node >= 18)
import otpMailVi from "../locales/vi/otpMail.json" assert { type: "json" };
import receiptMailVi from "../locales/vi/receiptMail.json" assert { type: "json" };
import translationVi from "../locales/vi/translation.json" assert { type: "json" };

import otpMailEn from "../locales/en/otpMail.json" assert { type: "json" };
import receiptMailEn from "../locales/en/receiptMail.json" assert { type: "json" };
import translationEn from "../locales/en/translation.json" assert { type: "json" };

// Khởi tạo i18next với resources nhúng trực tiếp
i18next.init({
  resources: {
    vi: {
      otpMail: otpMailVi,
      receiptMail: receiptMailVi,
      translation: translationVi,
    },
    en: {
      otpMail: otpMailEn,
      receiptMail: receiptMailEn,
      translation: translationEn,
    },
  },
  fallbackLng: "vi",
  defaultNS: "translation",
  ns: ["otpMail", "receiptMail", "translation"],
  interpolation: {
    escapeValue: false, // cần cho HBS để render HTML
  },
});

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