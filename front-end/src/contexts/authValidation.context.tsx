import { createContext, Dispatch, ReactNode, SetStateAction, useContext, useEffect, useState } from "react";
import { AxiosError } from "axios";
import { createCustomAxios } from "../services/axios.service.ts";

// TODO this is temporal because user it will have more info
interface UserProps {
    id: string;
    username: string;
}

interface IAuthValidationSessionContextProps {
    userIsLoged: boolean;
    isLoadingValidationSession: boolean;
    errorValidationSession: string | null;
    userData: UserProps | null;
    setUserData: Dispatch<SetStateAction<UserProps>>;
    setUserIsLoged: Dispatch<SetStateAction<boolean>>;
}

const AuthValidateSessionContext = createContext<IAuthValidationSessionContextProps | undefined>(undefined);

export const UseAuthValidateSessionContext = () => {
  const context = useContext(AuthValidateSessionContext);

  if (!context) {
    throw new Error('AuthValidateSessionContext must be in its provider');
  }

  return context;
};

export const AuthValidateSessionContextProvider = ({ children }: { children: ReactNode }) => {
  const [ userIsLoged, setUserIsLoged ] = useState<boolean>(false);
  const [ isLoadingValidationSession, setIsLoadingValidationSession ] = useState<boolean>(false);
  const [ errorValidationSession, setErrorValidationSession ] = useState<string | null>(null);
  const [ userData, setUserData ] = useState<UserProps>({
    id: '',
    username: ''
  });
  
  const api = createCustomAxios(import.meta.env.VITE_ENDPOINT_BACKEND);

  const fetchValidateSession = async () => {
    try {
        const response = await api.get('/sessions/refresh-access-token');
        
        if (response.status !== 200) throw new Error('fetchValidateSession wasnt successfull');
        setUserIsLoged(true);
    } catch (error){
        setUserIsLoged(false);

        if (error instanceof AxiosError) {
            console.error('Axios error => ', error);
            setErrorValidationSession(error.response?.data.message);
            return
        }
        console.error("Unexpected error: ", error);
        setErrorValidationSession('Something went wrong, please try again later');
    } finally{
        setIsLoadingValidationSession(false);
    }
  }

  // TODO DELETE THIS B RO
  const fetchGetInfoUserSession = async () => {
    try {
        const response = await api.get('/sessions/get-session-info');
        
        if (response.status !== 200) throw new Error('fetchGetInfoUserSession wasnt successfull');
        setUserData(response.data.body.username);
    } catch (error){
        setUserIsLoged(false);

        if (error instanceof AxiosError) {
            console.error('Axios error => ', error);
            setErrorValidationSession(error.response?.data.message);
            return
        }
        console.error("Unexpected error: ", error);
        setErrorValidationSession('Something went wrong, please try again later');
    } finally{
        setIsLoadingValidationSession(false);
    }
  }

  // NOTE This will be mounted just one time
  useEffect(() => {
    console.log('lol')
    fetchValidateSession();
  }, []);

  return (
    <AuthValidateSessionContext.Provider
      value={{ userIsLoged, isLoadingValidationSession, errorValidationSession, userData, setUserData, setUserIsLoged}}
    >
      {children}
    </AuthValidateSessionContext.Provider>
  );
};
