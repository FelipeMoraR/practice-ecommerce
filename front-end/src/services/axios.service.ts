import axios, { AxiosInstance, InternalAxiosRequestConfig } from "axios";

const setupLoggedInterceptors = (axiosInstance: AxiosInstance) => {
    axiosInstance.interceptors.request.use(
        (config: InternalAxiosRequestConfig) => config,
        (error) => Promise.reject(error)
    )

    axiosInstance.interceptors.response.use(
        (response) => response,
        async (error) => {
            const originalRequest = error.config;
            
            // NOTE Verify if there are a red error;
            if (!error.response) {
                return Promise.reject(error);
            }
            
            // NOTE Avoit infinite loop
            if(originalRequest.retry) return Promise.reject(error);
            
            if (error.response?.status === 401) {
                console.log('Unauth token, drinking water....');
                originalRequest.retry = true;
                try {
                    await axiosInstance.get('/sessions/refresh-access-token');
                    
                    return axiosInstance(originalRequest);
                } catch (refreshError) {
                    console.error('Error refreshing token interceptor::: ', refreshError);
                    return Promise.reject(refreshError);
                }
            }

            return Promise.reject(error);
        }
    )
}

export const createCustomAxios: (baseURL: string) => AxiosInstance = (baseURL)  => {
    const axiosInstance: AxiosInstance = axios.create({
        baseURL,
        withCredentials: true
    });
     
    return axiosInstance;
}

export const initCustomAxios = (baseUrl: string, userIsLogged = false) => {
    const axiosCustomInstance = createCustomAxios(baseUrl);
    if (userIsLogged) {
        setupLoggedInterceptors(axiosCustomInstance)
    }

    return axiosCustomInstance;
}

