import { create } from "zustand";

interface AuthState {
    token: string | null;
    refreshToken: string | null;
    setToken: (token: string, refreshToken: string) => void;
    logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
    token: null,
    refreshToken: null,
    setToken: (token, refreshToken) => set({ token, refreshToken }),
    logout: () => set({ token: null, refreshToken: null }),
}));
