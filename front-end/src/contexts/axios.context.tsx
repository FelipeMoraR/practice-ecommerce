import { createContext, ReactNode, useContext } from "react";
import initCustomAxios from "../services/axios.service";
import { UseAuthValidateSessionContext } from "./authValidation.context";
import { AxiosInstance } from "axios";

interface AxiosProps {
    api: AxiosInstance;
}

const AxiosContext = createContext<AxiosProps | undefined>(undefined);

export const UseAxiosContext = () => {
    const axiosContext = useContext(AxiosContext);

    if (!axiosContext) {
        throw new Error('AxiosContext must be used within its provider');
    }

    return axiosContext;
}

export const AxiosContextProvider = ({ children }: {children: ReactNode}) => {
    const { userIsLoged } = UseAuthValidateSessionContext();
    const api = initCustomAxios(import.meta.env.VITE_ENDPOINT_BACKEND, userIsLoged);
    
    return (
        <AxiosContext.Provider value={{ api }}>
            {children}
        </AxiosContext.Provider>
    )
}
