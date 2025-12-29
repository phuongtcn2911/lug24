import { Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";

import * as Transition from "../components/Transition.jsx";
// import { LanguageProvider } from "../data/LanguageContext.jsx";
// import { OrderProvider } from "../data/OrderContext.jsx";
// import RegulationCommitment from "./RegulationCommitment.jsx";

import Home from "./Home.jsx";
import SendParcel from "./SendParcel.jsx";
import ReceiveParcel from "./ReceiveParcel.jsx";
import ConfirmCheckIn from "./ConfirmCheckIn.jsx";
import OrderResult from "./OrderResult.jsx";
import { useContext, useState } from "react";
import { useEffect } from "react";
import api from "../config/axios.js";
import { InitialDataContext } from "../data/InitialDataContext.jsx";


function App() {
    const location = useLocation();
    const {resetInitialData}=useContext(InitialDataContext);

    useEffect(()=>{
        resetInitialData();
    },[])

    return (
// key={location.pathname}
        <AnimatePresence mode="wait">
            <Routes location={location} key={location.pathname}> 
                <Route path="/" element={<Transition.Fade><Home /></Transition.Fade>} />
                {/* <Route path="/RegulationCommitment" element={<Transition.Fade><RegulationCommitment /></Transition.Fade>} /> */}
                <Route path="/SendParcel" element={<Transition.Fade><SendParcel /></Transition.Fade>} />
                <Route path="/ReceiveParcel" element={<Transition.Fade><ReceiveParcel /></Transition.Fade>} />
                <Route path="/ConfirmCheckIn" element={<Transition.Fade><ConfirmCheckIn/></Transition.Fade>} />
                <Route path="/OrderResult" element={<Transition.Fade><OrderResult/></Transition.Fade>}/>
            </Routes>
        </AnimatePresence>


    );
}

export default App;