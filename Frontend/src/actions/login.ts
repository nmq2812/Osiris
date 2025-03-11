import { useAuthStore } from "@/stores/authStore";
import axios from "axios";

interface LoginCredentials {
    username: string;
    password: string;
}

export const handleLogin = (credentials: LoginCredentials) => async () => {
    try {
        const response = await axios.post(
            "http://localhost:8080/api/auth/login",
            {
                username: credentials.username,
                password: credentials.password,
            },
            {
                withCredentials: true,
            },
        );
        useAuthStore
            .getState()
            .setToken(response.data.token, response.data.refreshToken);

        return response;
    } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
            throw new Error(error.response.data.message);
        } else {
            throw new Error("An unknown error occurred");
        }
    }
};

export const handleLogout = () => {
    try {
        useAuthStore.getState().logout();
    } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
            throw new Error(error.response.data.message);
        } else {
            throw new Error("An unknown error occurred");
        }
    }
};
