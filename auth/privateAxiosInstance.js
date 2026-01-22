import axios from "axios";
import publicAxiosInstance from "./publicAxiosInstance";

const isDev = import.meta.env.VITE_ENV === 'development';

const privateAxiosInstance = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
    headers: { 'Content-Type': 'application/json' },
    timeout: 20000,
    withCredentials: true,
});

// Request interceptor: attach token
privateAxiosInstance.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('accessToken');
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Response interceptor: refresh token on 401
privateAxiosInstance.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        if (error.response && error.response.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                const res = await publicAxiosInstance.post('/auths/refresh-token');
                if (res.status < 400) {
                    const newAccessToken = res.data.accessToken;
                    localStorage.setItem('accessToken', newAccessToken);
                    originalRequest._retry = true;
                    // Update header and retry original request
                    originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
                    return privateAxiosInstance.request(originalRequest);
                }
            } catch (err) {
                if(isDev){
                     console.error('Error during token refresh:', err);
                }
               
                localStorage.removeItem('accessToken');
                originalRequest._retry = true;
                // window.location.href =  '/login'; 
                return Promise.reject(err);
            }
        }

        return Promise.reject(error);
    }
);

export default privateAxiosInstance;
