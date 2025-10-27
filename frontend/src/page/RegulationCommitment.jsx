import { useContext, useState } from "react";
import { Header } from "../components/ExtraPart/Header";
import { LanguageContext } from "../data/LanguageContext";
import { Link } from "react-router-dom";
import RuleComp from "../components/Rule Comp/RuleComp";


export default function RegulationCommitment() {
    const { lang, Languages } = useContext(LanguageContext);
    let subTitleSplit;

    function splitSubTitle() {

        const subVN = "điều khoản và điều kiện";
        const subEN = "Terms and Conditions"
        if (lang == 0) {
            let splitIndex = String(Languages[lang].houseRule[0].subTitle).indexOf(subVN);
            subTitleSplit = [String(Languages[lang].houseRule[0].subTitle).slice(0, splitIndex), subVN];
        }
        else {
            let splitIndex = String(Languages[lang].houseRule[0].subTitle).indexOf(subEN);
            subTitleSplit = [String(Languages[lang].houseRule[0].subTitle).slice(0, splitIndex), subEN];
        }
        // console.log(subTitleSplit);
    }

    return (
        <>
            {splitSubTitle()}
            <Header link="/"></Header>
            <div className="container">
                <p className="title is-1 has-text-left is-spaced">{Languages[lang].houseRule[0].title}</p>
                <p className="subtitle is-5 is-italic has-text-left">
                    {subTitleSplit[0]}
                    <a>{subTitleSplit[1]}</a>
                </p>

                <RuleComp index={1}></RuleComp>
                <RuleComp index={2}></RuleComp>
                <RuleComp index={3}></RuleComp>
                <RuleComp index={4}></RuleComp>



                <Link to="/SendParcel">
                    <button className="button is-warning is-rounded">
                        <span className="icon">
                            <i className="fa-solid fa-handshake"></i>
                        </span>
                        <span>{Languages[lang].btnConfirm}</span>
                    </button>
                </Link>

            </div>







            {/* <div class="columns is-mobile has-text-left is-vcentered">
                    <div className="column ">
                        <div className="columns">
                            <div className="column is-one-third">
                                <img src={RuleImgs[0]}></img>
                            </div>
                            <div className="column">
                                <div className="content is-small">
                                    <p class="title is-5">Vũ khí, đạn dược cháy nổ</p>
                                    <p class="subtitle is-6 is-spaced">Súng, dao, bom, đạn, thuốc nổ và các vật liệu liên quan.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                   <div className="column">
                        <div className="columns">
                            <div className="column is-one-third">
                                <img src={RuleImgs[1]}></img>
                            </div>
                            <div className="column">
                                <div className="content is-small">
                                    <p class="title is-5">Hóa chất nguy hại và ma túy</p>
                                    <p class="subtitle is-6 ">Hóa chất độc hại, chất thải công nghiệp, chất gây ô nhiễm môi trường</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                 <div class="columns is-mobile has-text-left is-vcentered">
                    <div className="column">
                        <div className="columns">
                            <div className="column is-one-third">
                                <img src={RuleImgs[2]}></img>
                            </div>
                            <div className="column">
                                <div className="content is-small">
                                    <p class="title is-5">Ấn phẩm đồi trụy và hàng hóa vi phạm quyền sở hữu trí tuệ</p>
                                    <p class="subtitle is-6">Súng, dao, bom, đạn, thuốc nổ và các vật liệu liên quan.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                   <div className="column">
                        <div className="columns">
                            <div className="column is-one-third">
                                <img src={RuleImgs[3]}></img>
                            </div>
                            <div className="column">
                                <div className="content is-small">
                                    <p class="title is-5">Động/Thực vật hoang dã</p>
                                    <p class="subtitle is-6">Súng, dao, bom, đạn, thuốc nổ và các vật liệu liên quan.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div> */}



            {/* <div className="columns is-mobile has-text-left is-vcentered">
                <div className="column is-one-quarter">
                    <img src={RuleImgs[0]} width={"80%"}></img>
                </div>
                <div className="column">
                    <div className="content is-small">
                        <p class="title">Vũ khí, đạn dược cháy nổ</p>
                        <p class="subtitle">Súng, dao, bom, đạn, thuốc nổ và các vật liệu liên quan.</p>
                    </div>
                </div>
            </div>
            <div className="columns is-mobile has-text-left is-vcentered">
                <div className="column is-one-quarter">
                    <img src={RuleImgs[1]} width={"80%"}></img>
                </div>
                <div className="column">
                    <div className="content is-small">
                        <p class="title">Vũ khí, đạn dược cháy nổ</p>
                        <p class="subtitle">Súng, dao, bom, đạn, thuốc nổ và các vật liệu liên quan.</p>
                    </div>
                </div>
            </div>
            <div className="columns is-mobile has-text-left is-vcentered">
                <div className="column is-one-quarter">
                    <img src={RuleImgs[2]} width={"80%"}></img>
                </div>
                <div className="column">
                    <div className="content is-small">
                        <p class="title ">Vũ khí, đạn dược cháy nổ</p>
                        <p class="subtitle">Súng, dao, bom, đạn, thuốc nổ và các vật liệu liên quan.</p>
                    </div>
                </div>
            </div>
            <div className="columns is-mobile has-text-left is-vcentered">
                <div className="column is-one-quarter ">
                    <img src={RuleImgs[3]} width={"80%"}></img>
                </div>
                <div className="column">
                    <div className="content is-small">
                        <p class="title">Vũ khí, đạn dược cháy nổ</p>
                        <p class="subtitle">Súng, dao, bom, đạn, thuốc nổ và các vật liệu liên quan.</p>
                    </div>
                </div>
            </div> */}








        </>

    );
}