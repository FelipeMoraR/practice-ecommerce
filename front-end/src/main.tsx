// import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './styles/global.css'
import { AuthValidateSessionContextProvider } from './contexts/authValidation.context.tsx'
import { AxiosContextProvider } from './contexts/axios.context.tsx'
import { AuthActionContextProvider } from './contexts/authAction.context.tsx'
import App from './App.tsx'


createRoot(document.getElementById('root')!).render(
    <AuthValidateSessionContextProvider>
      <AxiosContextProvider>
        <AuthActionContextProvider>
          <App />
        </AuthActionContextProvider>
      </AxiosContextProvider>
    </AuthValidateSessionContextProvider>
)
