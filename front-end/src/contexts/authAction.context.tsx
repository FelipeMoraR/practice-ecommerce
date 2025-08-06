import { createContext, ReactNode, useContext } from "react";
import { FormLoginValues } from "../models/schemas/index.ts";
import { UseAxiosContext } from "./axios.context.tsx";
import { UseAuthValidateSessionContext } from "./authValidation.context.tsx";
import { IUserProps } from "../models/types/user.model.ts";
import useApi from "../hooks/useApi.ts";
import { AxiosResponse } from "axios";

interface IAuthActionContext {
    fetchLoginUser: (data: FormLoginValues) => Promise<void>;
    isLoadingLogin: boolean;
    errorLogin: string | null; 
    fetchLogoutUser: () => Promise<void>; // NOTE Async functions always return implicit a promise
    // fetchLogoutUser: () => void;
    isLoadingLogout: boolean;
    errorLogout: string | null; 
    responseLogout: AxiosResponse<unknown, unknown> | null;
    setErrorLogout: React.Dispatch<React.SetStateAction<string | null>>
}

interface IResponseLogin {
    status: number;
    message: string;
    user: IUserProps | null;
}

const AuthActionContext = createContext<IAuthActionContext | undefined>(undefined);

export const UseAuthActionContext = () => {
    const context = useContext(AuthActionContext);

    if (!context) {
        throw new Error('UseAuthActionContext must be in its provider');
    }

    return context;
}

export const AuthActionContextProvider = ({ children }: {children: ReactNode}) => {    
    const { api } = UseAxiosContext();
    const { setUserIsLoged, setUserData, userIsLoged } = UseAuthValidateSessionContext();
    const { apiIsLoading: isLoadingLogin, errorApi: errorLogin, setErrorApi, callApi } = useApi<IResponseLogin, FormLoginValues>((data) => api.post("/users/login", data), false);
    const { apiIsLoading: isLoadingLogout, callApi: callLogout, errorApi: errorLogout, responseApi: responseLogout, setErrorApi: setErrorLogout } = useApi(() => api.post('/users/logout'));

    const fetchLoginUser: (data: FormLoginValues) => Promise<void> = async (data) => {
        if(userIsLoged) {
            // NOTE Border case
            setErrorApi('You already are logged, logout to use login');
            return;
        }
       
        const response = await callApi(data);

        if (!response) {
            setUserIsLoged(false);
            setUserData(null);
            return;
        }

     
        setUserIsLoged(true);
        setUserData(response.data.user);
        
        
        return;
    };

    const fetchLogoutUser: () => Promise<void> = async () => {
        if(!userIsLoged) {
            setErrorLogout('User must be logged to logout');
            return;
        }
        
        const response = await callLogout();

        if(!response) {
            setErrorLogout('Unexpected error, please try again');
            return;
        }
        
        
        setErrorLogout(null);
        setUserIsLoged(false);
        setUserData(null);
       
        
        return;
    }

    return (
        <AuthActionContext.Provider value = {{ fetchLoginUser, isLoadingLogin, errorLogin, fetchLogoutUser, isLoadingLogout, errorLogout, responseLogout, setErrorLogout }}>
            {children}
        </AuthActionContext.Provider>
    )
}

