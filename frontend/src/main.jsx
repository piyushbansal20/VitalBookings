import { createRoot } from 'react-dom'
import { StrictMode } from 'react'
import App from './App'
import './index.css'
import { BrowserRouter} from "react-router-dom";
import AppContextProvider from "./context/AppContext.jsx";

createRoot(document.getElementById('root')).render(
<BrowserRouter>
<AppContextProvider>
  <App />
</AppContextProvider>
</BrowserRouter>
)
