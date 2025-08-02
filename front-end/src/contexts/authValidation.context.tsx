import { createContext, Dispatch, ReactNode, SetStateAction, useContext, useEffect, useState } from "react";
import { AxiosError } from "axios";
import { createCustomAxios } from "../services/axios.service.ts";
import { IUserProps } from "../models/types/user.model.ts";


interface IAuthValidationSessionContextProps {
    userIsLoged: boolean;
    isLoadingValidationSession: boolean;
    errorValidationSession: string | null;
    userData: IUserProps | null;
    setUserData: Dispatch<SetStateAction<IUserProps | null>>;
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
  const [ userData, setUserData ] = useState<IUserProps | null>(null);
  const [ isLoadingValidationSession, setIsLoadingValidationSession ] = useState<boolean>(true);
  const [ errorValidationSession, setErrorValidationSession ] = useState<string | null>(null);
  
  useEffect(() => {
    const api = createCustomAxios(import.meta.env.VITE_ENDPOINT_BACKEND);

    const fetchValidateSession = async () => {
      setIsLoadingValidationSession(true);
      try {
          const responseRefreshToken = await api.get('/sessions/refresh-access-token')
            .catch(error => {
              if (error.response?.status === 404) return null;
              throw error;
            });
          
          if (responseRefreshToken?.status === 200) {
            setUserIsLoged(true);
            setUserData(responseRefreshToken.data.user);
            return;
          }
          // NOTE In case the user has left only the access token
          const responseValidateAccessToken = await api.get('/sessions/validate-access-token');

          if (responseValidateAccessToken.status !== 200) throw new Error('Access token validate wasnt successfull');
          
          setUserIsLoged(true);
          setUserData(responseValidateAccessToken.data.user);
      } catch (error){
          setUserIsLoged(false);
          setUserData(null);
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
