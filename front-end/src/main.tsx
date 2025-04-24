// import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './styles/global.css'
import { AxiosContextProvider } from './contexts/axios.context.tsx'
import { AuthContextProvider } from './contexts/auth.context.tsx'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
    <AxiosContextProvider>
      <AuthContextProvider>
        <App />
      </AuthContextProvider>
    </AxiosContextProvider>
)
