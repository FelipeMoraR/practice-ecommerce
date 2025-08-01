import { createContext, ReactNode, useContext, useState } from "react";
import { FormLoginValues } from "../models/schemas/index.ts";
import { AxiosError } from "axios";
import { UseAxiosContext } from "./axios.context.tsx";
import { UseAuthValidateSessionContext } from "./authValidation.context.tsx";

interface IAuthActionContext {
    fetchLoginUser: (data: FormLoginValues) => void;
    isLoadingLogin: boolean;
    errorLogin: string | null; 
}

const AuthActionContext = createContext<IAuthActionContext | undefined>(undefined);

export const UseAuthActionContext = () => {
    const context = useContext(AuthActionContext);

    if (!context) {
        throw new Error('UseAuthActionContext must be in its provider');
    }

    return context;
}

// TODO set the id device in localstorage

export const AuthActionContextProvider = ({ children }: {children: ReactNode}) => {
    const [ isLoadingLogin, setIsLoadingLogin ] = useState<boolean>(false);
    const [ errorLogin, setErrorLogin ] = useState<string | null>(null);
    
    const { api } = UseAxiosContext();
    const { setUserIsLoged, setUserData, userIsLoged } = UseAuthValidateSessionContext();

    const fetchLoginUser: (data: FormLoginValues) => void = async (data) => {
        if(userIsLoged) {
            setErrorLogin('You already are logged, logout to use login');
            return;
        }
        try {
            setIsLoadingLogin(true);
            setErrorLogin(null);
            const response = await api.post("/users/login", data);
            
            if (response.status !== 200) throw new Error('FetchLoginUser wasnt successfull');

            setUserIsLoged(true);
            setUserData(response.data.user);
        } catch (error) {
            setUserIsLoged(false);
            setUserData(null);
            if (error instanceof AxiosError) {
                console.error("Error in fetchLoginUser::: ", error.response);
                setErrorLogin(error.response?.data.status === 400 ? 'Invalid email or password' : error.response?.data.message);

                return;
            }
        
            console.error("Unexpected error: ", error);
            setErrorLogin('Something went wrong, please try again later');
        } finally {
            setIsLoadingLogin(false);
        }
    };

    return (
        <AuthActionContext.Provider value = {{ fetchLoginUser, isLoadingLogin, errorLogin }}>
            {children}
        </AuthActionContext.Provider>
    )
}

