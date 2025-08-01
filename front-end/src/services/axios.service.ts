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
        
            // NOTE Avoit infinite loop
            if(error.retry) return Promise.reject(error);

            error.retry = true;
           
            if (error.response?.status === 401) {
                console.log('Unauth token, drinking water....');

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

