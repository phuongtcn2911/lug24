import i18next from "i18next";
import Backend from "i18next-fs-backend";
import middleware from "i18next-http-middleware";
import path from "path";
import { fileURLToPath } from "url";

const _filename=fileURLToPath(import.meta.url);
const _dirname=path.dirname(_filename);

 i18next.use(Backend).use(middleware.LanguageDetector).init({
    fallbackLng:"vi",
    backend:{
        loadPath:path.join(_dirname,"../locales/{{lng}}/{{ns}}.json"),
    },
    preload:["vi","en"],
    ns:["otpMail","receiptMail","translation"],
    defaultNS:"translation",
});

export default i18next;
export {middleware};