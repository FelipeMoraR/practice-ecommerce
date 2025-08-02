import { createContext, ReactNode, useContext } from "react";
import { FormLoginValues } from "../models/schemas/index.ts";
import { UseAxiosContext } from "./axios.context.tsx";
import { UseAuthValidateSessionContext } from "./authValidation.context.tsx";
import { IUserProps } from "../models/types/user.model.ts";
import useApi from "../hooks/useApi.ts";

interface IAuthActionContext {
    fetchLoginUser: (data: FormLoginValues) => void;
    isLoadingLogin: boolean;
    errorLogin: string | null; 
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

// TODO set the id device in localstorage
// FIXME using useApi to this, please view me
export const AuthActionContextProvider = ({ children }: {children: ReactNode}) => {    
    const { api } = UseAxiosContext();
    const { setUserIsLoged, setUserData, userIsLoged } = UseAuthValidateSessionContext();
    const { apiIsLoading: isLoadingLogin, errorApi: errorLogin, setErrorApi, callApi } = useApi<IResponseLogin, FormLoginValues>((data) => api.post("/users/login", data), false);

    const fetchLoginUser: (data: FormLoginValues) => void = async (data) => {
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

    return (
        <AuthActionContext.Provider value = {{ fetchLoginUser, isLoadingLogin, errorLogin }}>
            {children}
        </AuthActionContext.Provider>
    )
}

