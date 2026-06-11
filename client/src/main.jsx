import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './app/App.jsx'
// import { Provider } from 'react-redux'
import Providers from './app/providers.jsx'

createRoot(document.getElementById('root')).render(
  // <StrictMode>
    <Providers>
      <App />
    </Providers>
  // </StrictMode>,
)
