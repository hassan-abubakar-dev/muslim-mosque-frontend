import { toast } from 'react-toastify';

export const setupErrorInterceptor = (axiosInstance) => {
      const isDev = import.meta.env.VITE_ENV === 'development';
      
    axiosInstance.interceptors.response.use(
        (response) => response,
        (error) => {

            if(isDev){
                console.error("API Error Log:", error);
            }

            if (error.code === 'ERR_CANCELED' || error.name === 'CanceledError') {
                return Promise.reject(error); 
            }
            // Handle Network Error
            if (!error.response) {
                toast.error("Network error. Please check your internet connection.");
                return Promise.reject(error);
            }

            const { status, data } = error.response;

            // Handle Specific Status Codes
            switch (status) {
                case 429:
                    toast.error(data.message || "Too many attempts. Please wait 15 minutes.");
                    break;
                case 401:
                    toast.error("Session expired. Please log in again.");
                    break;
                case 500:
                    toast.error("Our servers are currently having trouble. Please try again in a few minutes.");
                    break;
                case 402:
                    toast.warn("Payment required to access this feature.");
                    break;
                default:
                    toast.error("Something went wrong.");
            }
            return Promise.reject(error);
        }
    );
};