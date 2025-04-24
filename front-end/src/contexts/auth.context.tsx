import { createContext, ReactNode, useContext, useEffect, useState } from "react";
import { FormLoginValues } from "../models/schemas";
import { AxiosError } from "axios";
import { UseAxiosContext } from "./axios.context.tsx";

// TODO this is temporal because user it will have more info
interface UserProps {
    id: string;
    username: string;
}

interface AuthContextProps {
    userIsLoged: boolean;
    isLoadingLogin: boolean;
    userData: UserProps;
    errorLogin: string | null;
    fetchLoginUser: (data: FormLoginValues) => Promise<void>
  }

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const UseAuthContext = () => {
  const authContext = useContext(AuthContext);

  if (!authContext) {
    throw new Error('UseAuthContext must be in its provider');
  }

  return authContext;
};

export const AuthContextProvider = ({ children }: { children: ReactNode }) => {
  const [ userIsLoged, setUserIsLoged ] = useState<boolean>(false);
  const [ isLoadingLogin, setIsLoadingLogin ] = useState<boolean>(false);
  const [ errorLogin, setErrorLogin ] = useState<string | null>(null);

  const [ userData, setUserData ] = useState<UserProps>({
    id: '',
    username: ''
  })
  const { api } = UseAxiosContext();

  const fetchLoginUser: (data: FormLoginValues) => Promise<void> = async (data) => {
    setIsLoadingLogin(true);
    setErrorLogin(null);

    try {
      const response = await api.post("/users/login", data);
      
      if (response.status !== 200) throw new Error('FetchLoginUser wasnt successfull');

      setUserIsLoged(true);
      setUserData(response.data.user);
        
      return;
    } catch (error) {
      setUserIsLoged(false);

      if (error instanceof AxiosError) {
        console.error("Error in fetchLoginUser::: ", error.response);
        setErrorLogin(error.response?.data.message);

        return;
      }
  
      console.error("Unexpected error: ", error);
      setErrorLogin('Something went wrong, please try again later');

      return;
    } finally {
      setIsLoadingLogin(false);
    }
  };

  const fetchGetSessionInfo = async () => {
    setIsLoadingLogin(false);
    setErrorLogin(null);

    try {
        const response = await api.get('/sessions/get-session-info');
        
        if (response.status !== 200) throw new Error('fetchGetSessionInfo wasnt successfull');
        console.log('response => ', response.data.user)
        setUserIsLoged(true);
        setUserData(response.data.user);

        return;
    } catch (error){
        setUserIsLoged(false);

        if(error instanceof AxiosError) {
            console.error('Axios error => ', error.response);
            setErrorLogin(error.response?.data.message);
            return
        }
        console.error("Unexpected error: ", error);
        setErrorLogin('Something went wrong, please try again later');

        return;
    } finally{
        setIsLoadingLogin(false);
    }
  }

  useEffect(() => {
    fetchGetSessionInfo();
  }, [])

  return (
    <AuthContext.Provider
      value={{ userIsLoged, isLoadingLogin, userData, errorLogin, fetchLoginUser }}
    >
      {children}
    </AuthContext.Provider>
  );
};
