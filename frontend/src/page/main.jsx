import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from "react-router-dom";
import './CSS/index.css'
import App from './App.jsx'
import { OrderProvider } from '../data/OrderContext.jsx';
import { TimerProvider } from '../data/TimerContext.jsx';
import { PaymentProgressProvider } from '../data/PaymentProgressContext.jsx';
import "../i18n.js";
import { InitialDataProvider } from '../data/InitialDataContext.jsx';
import 'flowbite'
createRoot(document.getElementById('root')).render(
  // <StrictMode>

  <BrowserRouter>
    <InitialDataProvider>
      <TimerProvider>
        <OrderProvider>
          <PaymentProgressProvider>
            <App />
          </PaymentProgressProvider>
        </OrderProvider>
      </TimerProvider>
    </InitialDataProvider>
  </BrowserRouter>


  // </StrictMode >,
)
