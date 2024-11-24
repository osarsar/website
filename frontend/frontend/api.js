// api.js

import axios from "axios";
import { ACCESS_TOKEN, REFRESH_TOKEN} from "./constants";
import { useNavigate } from "react-router-dom";

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL
});

// Interceptor to add the token to headers
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem(ACCESS_TOKEN);
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Interceptor to handle token expiration
axios.interceptors.response.use(
    (response) => response,
    async (error) => {
        if (error.response && error.response.status === 401) {
            // Token expiré
            try {
                await axios.post(`http://${window.location.hostname}:8000/api/logout/`, { REFRESH_TOKEN });
                localStorage.removeItem(ACCESS_TOKEN);
                localStorage.removeItem(REFRESH_TOKEN);
                toast.error("Session expirée. Veuillez vous reconnecter.");
                navigate("/");
            } catch (err) {
                console.error("Erreur lors de la déconnexion", err);
            }
        }
        return Promise.reject(error);
    }
);

export default api;


//BUILD YOUR OWN JWD SERVER//////////////
