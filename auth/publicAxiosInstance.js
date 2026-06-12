import axios from "axios";
import { setupErrorInterceptor } from "../api/client";

const publicAxiosInstance = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
    timeout: 20000,
    withCredentials: true,
});

setupErrorInterceptor(publicAxiosInstance);


export default publicAxiosInstance;