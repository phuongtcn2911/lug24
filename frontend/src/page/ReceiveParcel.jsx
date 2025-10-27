import { useContext } from "react";
import { LanguageContext } from "../data/LanguageContext.jsx";

function ReceiveParcel() {
  const { lang, Languages } = useContext(LanguageContext);

  return (
    <h1>{Languages[lang].receiveParcel}</h1>
  )
}

export default ReceiveParcel;