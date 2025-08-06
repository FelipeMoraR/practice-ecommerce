// import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './styles/index.css'
import { AuthValidateSessionContextProvider } from './contexts/authValidation.context.tsx'
import { AxiosContextProvider } from './contexts/axios.context.tsx'
import { AuthActionContextProvider } from './contexts/authAction.context.tsx'
import { BrowserRouter } from 'react-router-dom'
import App from './App.tsx'




createRoot(document.getElementById('root')!).render(
      <AuthValidateSessionContextProvider>
        <AxiosContextProvider>
          <AuthActionContextProvider>
            <BrowserRouter>
              <App/>
            </BrowserRouter>
          </AuthActionContextProvider>
        </AxiosContextProvider>
      </AuthValidateSessionContextProvider>
)
