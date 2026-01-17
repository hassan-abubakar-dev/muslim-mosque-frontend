import axios from "axios";

const publicAxiosInstance = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
    timeout: 20000,
    withCredentials: true,
});


export default publicAxiosInstance;