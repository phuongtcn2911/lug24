
import { Link } from 'react-router-dom';
import { AnimatePresence, motion } from "framer-motion";
import { useContext } from 'react';

import './CSS/App.css';
import * as Data from '../data/Data.js'

import AnimatedButton from '../components/AnimatedButton/AnimatedButton.jsx';
import ExtraPart from '../components/ExtraPart/ExtraPart.jsx';
import DevButton from '../components/DevButton.jsx';
import VideoBox from '../components/ExtraPart/VideoBox.jsx';
import { TimerContext } from '../data/TimerContext.jsx';
import { OrderContext } from '../data/OrderContext.jsx';
import { useTranslation } from 'react-i18next';




function Home() {
  const {startTimer,resetTimer}=useContext(TimerContext);
  const {resetOrder}=useContext(OrderContext);
   const { t, i18n } = useTranslation();

  function startNewSession(){
    resetTimer();
    resetOrder();
  }

  return (
    <div className=''>
      <img id="imgLogo" src={Data.Logo} width="60%"></img>

      <section className="my-3">
        <ExtraPart />
      </section>

      <section>
        <div className="videoFrame" style={{alignContent:"center"}}>
          <VideoBox/>

        </div>

      </section>

      <section>
        <menu id="buttonList">
          <ul>
            <Link to="/SendParcel">
              <AnimatedButton
                imgLink={Data.AnimatedButtons[0].imgLink}
                color={Data.AnimatedButtons[0].color}
                clickEvent={()=>startNewSession()}
              >{t("sendParcel")}</AnimatedButton>
            </Link>

            <Link to="/ReceiveParcel">
              <AnimatedButton
                imgLink={Data.AnimatedButtons[1].imgLink}
                color={Data.AnimatedButtons[1].color}
              >{t("receiveParcel")}</AnimatedButton>
            </Link>

          </ul>
        </menu>
      </section>

      <section>
        <DevButton />
      </section>


    </div>
  )
}

export default Home
