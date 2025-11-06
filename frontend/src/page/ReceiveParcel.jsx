import { useContext } from "react";
import { LanguageContext } from "../data/LanguageContext.jsx";
import { Header } from "../components/ExtraPart/Header.jsx";

function ReceiveParcel() {
  const { lang, Languages } = useContext(LanguageContext);

  return (
    <>
    <Header link="/" isBackEnable={true}></Header>
    <h1>{Languages[lang].labelUpdate}</h1>
    </>
    
  )
}

export default ReceiveParcel;