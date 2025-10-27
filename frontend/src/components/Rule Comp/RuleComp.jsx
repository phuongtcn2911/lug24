import { useContext } from "react";
import { LanguageContext } from "../../data/LanguageContext";
import { RuleImgs } from "../../data/Data"

export default function RuleComp({ index }) {
    const { lang, Languages } = useContext(LanguageContext);

    return (
        <div className="columns is-mobile has-text-left is-vcentered">
            <div className="column is-one-quarter">
                <img src={RuleImgs[index-1]} width={"80%"}></img>
            </div>
            <div className="column">
                <p className="title is-3">{Languages[lang].houseRule[index].title}</p>
                <p className="subtitle is-5">{Languages[lang].houseRule[index].subTitle}</p>
            </div>
        </div>
    );
}