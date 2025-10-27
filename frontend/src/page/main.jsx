import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from "react-router-dom";
import './CSS/index.css'
import App from './App.jsx'
import { LanguageProvider } from '../data/LanguageContext.jsx';
import { OrderProvider } from '../data/OrderContext.jsx';
import { TimerProvider } from '../data/TimerContext.jsx';
createRoot(document.getElementById('root')).render(
  // <StrictMode>

  <BrowserRouter>
    <TimerProvider>
      <LanguageProvider>
        <OrderProvider>
          <App />
        </OrderProvider>
      </LanguageProvider>
    </TimerProvider>
  </BrowserRouter>


  // </StrictMode >,
)
