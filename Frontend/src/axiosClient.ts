import axios from "axios";
import { useAuthStore } from "@/stores/authStore";

const axiosClient = axios.create({
    baseURL: "http://localhost:8088/api/v1",
    headers: { "Content-Type": "application/json" },
    withCredentials: true, // Cho phép gửi cookie (để gửi refreshToken nếu cần)
});

// Interceptor: Thêm token vào request
axiosClient.interceptors.request.use(
    (config) => {
        const token = useAuthStore.getState().token;
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error),
);

axiosClient.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                await refreshToken(); // Gọi API refresh token
                return axiosClient(originalRequest); // Thử lại request cũ sau khi refresh
            } catch (refreshError) {
                useAuthStore.getState().logout(); // Nếu refresh thất bại, đăng xuất
                return Promise.reject(refreshError);
            }
        }

        return Promise.reject(error);
    },
);

export default axiosClient;
