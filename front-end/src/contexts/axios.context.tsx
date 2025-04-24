import { createContext, ReactNode, useContext } from "react";
import initAxios from "../services/axios.service";
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

export const AxiosContextProvider = ({ children }: {children :ReactNode}) => {
    // TODO use .env for this
    const api = initAxios('http://localhost:3000/api');

    return (
        <AxiosContext.Provider value={{api}}>
            {children}
        </AxiosContext.Provider>
    )
}
