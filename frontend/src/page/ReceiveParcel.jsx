import { useContext, useState } from "react";
import { LanguageContext } from "../data/LanguageContext.jsx";
import { Header } from "../components/ExtraPart/Header.jsx";
import TextInput from "../components/InputForm/TextInput.jsx";
import { folder_Gap } from "../data/Data.js"
import { InputOrder } from "../components/ExtraPart/InputOrder.jsx";
import { ScanOrder } from "../components/ExtraPart/ScanOrder.jsx";
import { data } from "react-router-dom";
import { useTranslation } from "react-i18next";

function ReceiveParcel() {
  // const { lang, Languages } = useContext(LanguageContext);
  const [ activeTab, setActiveTab ] = useState("keyIn");
  const [ phone, setPhone ] = useState();
  const {t,i18n}=useTranslation();




  

  return (
    <>
      <Header link="/" isBackEnable={true}></Header>

      <div className="p-8 bg-gray-100">
        <div className="flex w-full">
          <button
            className={`flex-1 tab-btn px-4 py-3 font-medium round rounded-tl-xl rounded-tr-xl rounded-bl-none rounded-br-none focus:outline-none focus:ring-0 focus:border-transparent
              ${activeTab==="keyIn"?
                "bg-white text-orange-600":
                "bg-gray-200 text-gray-600"}`}
            onClick={()=>{setActiveTab("keyIn")}}>
           {t("labelInputCodeID")}
          </button>

          <button
             className={`flex-1 tab-btn px-4 py-3 font-medium round rounded-tl-xl rounded-tr-xl rounded-bl-none rounded-br-none focus:outline-none focus:ring-0 focus:border-transparent
              ${activeTab==="scan"?
                "bg-white text-orange-600":
                "bg-gray-200 text-gray-600"}`}
            onClick={()=>{setActiveTab("scan")}}>
            {t("labelScanCodeID")}

          </button>
        </div>

        {activeTab=="keyIn"?<InputOrder/>:<ScanOrder/>}  

        <div className="flex items-center my-3">
          <div className="flex-1 h-px bg-gray-300"></div>
          <span className="px-4 text-gray-500 text-lg">
             {t("labelOtherMethod")}
          </span>
          <div className="flex-1 h-px bg-gray-300"></div>
        </div>

        <div className="flex items-center justify-center">
          <button className="w-48 h-28 bg-white rounded-xl shadow flex flex-col items-center p-3">
            <i className="fa-regular fa-id-badge text-6xl mb-2"></i>
            <span className="text-base font-normal text-gray-600">
              {t("btnFaceRecognize")}
            </span>
          </button>

        </div>

      </div>







    </>

  )
}

export default ReceiveParcel;