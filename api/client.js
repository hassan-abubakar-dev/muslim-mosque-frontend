import { toast } from 'react-toastify';

export const setupErrorInterceptor = (axiosInstance) => {
    axiosInstance.interceptors.response.use(
        (response) => response,
        (error) => {

            if (error.code === 'ERR_CANCELED' || error.name === 'CanceledError') {
                return Promise.reject(error); 
            }
            // Handle Network Error
            if (!error.response) {
                toast.error("Network error. Please check your internet connection.");
                return Promise.reject(error);
            }

            if (error.code === 'ERR_CANCELED' || error.name === 'CanceledError') {
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
                    // Only redirect if not already on the login page to avoid loops
                    if (window.location.pathname !== '/login') {
                        window.location.href = "/login";
                    }
                    break;
                case 500:
                    toast.error("Server error. Please try again later.");
                    break;
                case 402:
                    toast.warn("Payment required to access this feature.");
                    break;
                default:
                    toast.error(data.message || "Something went wrong.");
            }
            return Promise.reject(error);
        }
    );
};