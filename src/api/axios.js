import axios from "axios";

export const api = axios.create({
    baseURL: "http://localhost:8000/",
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: true, // Para poder usar cookies
});

api.interceptors.response.use(
    (response) => {
        return response;
    },
    async (error) => {
        const originalRequest = error.config;
        
        if (error.response && error.response.status === 401 && !originalRequest._retry && originalRequest.url !== '/auth/refresh' && originalRequest.url !== '/auth/login') {
            originalRequest._retry = true;
            try {
                console.info("Refrescando token...");
                await axios.post("http://localhost:8000/auth/refresh", {}, { withCredentials: true });
                console.info("Token actualizado exitosamente");
                return api(originalRequest);
            } catch (refreshError) {
                return Promise.reject(refreshError);
            }
        }
        return Promise.reject(error);
    }
);