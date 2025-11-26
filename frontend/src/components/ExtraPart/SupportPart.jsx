import { useTranslation } from "react-i18next";

export default function SupportPart() {
    const {t,i18n}=useTranslation();
    return (
        <fieldset className="group has-text-centered">
            <legend>{t("supportPart.title")}</legend>
            <nav className="level is-mobile">
                <div className="level-item has-text-centered">
                    <div>
                        <p className="heading">{t("supportPart.hotline.title")}</p>
                        <p className="title">{t("supportPart.hotline.value")}</p>
                    </div>
                </div>
                  <div className="level-item has-text-centered">
                    <div>
                        <p className="heading">{t("supportPart.website.title")}</p>
                        <p className="title">{t("supportPart.website.value")}</p>
                    </div>
                </div>
                 <div className="level-item has-text-centered">
                    <div>
                        <p className="heading">{t("supportPart.zalo.title")}</p>
                        <p className="title">{t("supportPart.zalo.value")}</p>
                    </div>
                </div>
            </nav>
        </fieldset>
    );

}


