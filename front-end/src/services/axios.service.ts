import axios, { AxiosInstance, InternalAxiosRequestConfig } from "axios";

export const createCustomAxios: (baseURL: string) => AxiosInstance = (baseURL)  => {
    const axiosInstance: AxiosInstance = axios.create({
        baseURL,
        withCredentials: true
    });
     
    return axiosInstance;
}

const setupLoogedInterceptors = (axiosInstance: AxiosInstance) => {
    axiosInstance.interceptors.request.use(
        (config: InternalAxiosRequestConfig) => config,
        (error) => Promise.reject(error)
    )

    axiosInstance.interceptors.response.use(
        (response) => response,
        async (error) => {
            const originalRequest = error.config;
            console.log('error =>', error);
            // FIXME controll this xddd
            // TODO use .env for this
            // REVIEW bro, you controlled bad this in the backend, because you returned 401 when they dont has token so this was an infinite loop xd 
            // NOTE This is controll that but we already fixed
            if (originalRequest.url.includes('/sessions/refresh-token')) {
                return Promise.reject(error);
            }

            if (error.response && error.response.status === 401 && !originalRequest._retry && !originalRequest.url.includes('/login')) {
                console.log('Unauth token...');
                console.log('Refreshing...');
                
                originalRequest._retry = true; // ANCHOR avoid multirendering

                try {
                    // TODO use .env for this
                    await axiosInstance.get('/sessions/refresh-token');
                    
                    return axiosInstance(originalRequest);
                } catch (refreshError) {
                    console.error('Error in the refresh token interceptor::: ', refreshError);
                    return Promise.reject(refreshError);
                }
            }

            return Promise.reject(error);
        }
    )
}


const initCustomAxios = (baseUrl: string, userIsLogged = false) => {
    const axiosCustomInstance = createCustomAxios(baseUrl);
    if (userIsLogged) {
        setupLoogedInterceptors(axiosCustomInstance)
    }

    return axiosCustomInstance;
}

export default initCustomAxios;