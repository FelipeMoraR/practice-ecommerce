import { createContext, ReactNode, useContext, useEffect, useRef } from "react";
import { FormLoginValues } from "../models/schemas/index.ts";
import { UseAxiosContext } from "./axios.context.tsx";
import { UseAuthValidateSessionContext } from "./authValidation.context.tsx";
import { IUserProps } from "../models/types/user.model.ts";
import useApi from "../hooks/useApi.ts";
import { AxiosResponse } from "axios";
import { useNavigate } from "react-router-dom";
import { IErrorApi } from "../models/types/api.model.ts";

interface IAuthActionContext {
    fetchLoginUser: (data: FormLoginValues) => Promise<void>;
    isLoadingLogin: boolean;
    errorLogin: IErrorApi | null; 
    fetchLogoutUser: () => Promise<void>; // NOTE Async functions always return implicit a promise
    setErrorLogin: React.Dispatch<React.SetStateAction<IErrorApi | null>>
    // fetchLogoutUser: () => void;
    isLoadingLogout: boolean;
    errorLogout: IErrorApi | null; 
    responseLogout: AxiosResponse<unknown, unknown> | null;
    setErrorLogout: React.Dispatch<React.SetStateAction<IErrorApi | null>>
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
    const navigate = useNavigate();
    const { setUserIsLoged, setUserData, userIsLoged } = UseAuthValidateSessionContext();
    const { apiIsLoading: isLoadingLogin, errorApi: errorLogin, setErrorApi: setErrorLogin, callApi } = useApi<IResponseLogin, FormLoginValues>((data) => api.post("/users/login", data), false);
    const { apiIsLoading: isLoadingLogout, callApi: callLogout, errorApi: errorLogout, responseApi: responseLogout, setErrorApi: setErrorLogout } = useApi(() => api.post('/users/logout'));
    const shouldNavigateAfterLogout = useRef<boolean>(false); // NOTE To solve the race condition problem

    useEffect(() => {
        if (shouldNavigateAfterLogout.current && !userIsLoged) {
            shouldNavigateAfterLogout.current = false;
            navigate('/', { replace: true });
        }
    }, [navigate, userIsLoged]);

    const fetchLoginUser: (data: FormLoginValues) => Promise<void> = async (data) => {
        if(userIsLoged) {
            // NOTE Border case
            setErrorLogin({
                status: 500,
                error: 'You already are logged, logout to use login'
            });
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
        navigate('/profile');
        
        return;
    };

    const fetchLogoutUser: () => Promise<void> = async () => {
        if(!userIsLoged) {
            setErrorLogout({
                status: 500,
                error: 'User must be logged to logout'
            });
            return;
        }
        
        const response = await callLogout();

        if(!response) {
            setErrorLogout({
                status: 500,
                error: 'Unexpected error, please try again'
            });
            return;
        }
        
        shouldNavigateAfterLogout.current = true;

        setErrorLogout(null);
        setUserIsLoged(false);
        setUserData(null);
        
        return;
    }

    return (
        <AuthActionContext.Provider value = {{ fetchLoginUser, isLoadingLogin, errorLogin, setErrorLogin, fetchLogoutUser, isLoadingLogout, errorLogout , responseLogout, setErrorLogout }}>
            {children}
        </AuthActionContext.Provider>
    )
}

