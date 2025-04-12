"use client";

import { devtools, persist } from "zustand/middleware";
import { createTrackedSelector } from "react-tracked";
import { UserResponse } from "@/models/User";
import { create } from "zustand";

interface AdminAuthState {
    jwtToken: string | null;
    user: UserResponse | null;
}

interface AdminAuthAction {
    updateJwtToken: (value: string) => void;
    updateUser: (value: UserResponse) => void;
    resetAdminAuthState: () => void;
    isOnlyEmployee: () => boolean;
    isAdmin: () => boolean;
}

const initialAuthState: AdminAuthState = {
    jwtToken: null,
    user: null,
};

const useAdminAuthStore = create<AdminAuthState & AdminAuthAction>()(
    devtools(
        persist(
            (set, get) => ({
                ...initialAuthState,
                updateJwtToken: (value) =>
                    set(
                        () => ({ jwtToken: value }),
                        false,
                        "AdminAuthStore/updateJwtToken",
                    ),
                updateUser: (value) =>
                    set(
                        () => ({ user: value }),
                        false,
                        "AdminAuthStore/updateUser",
                    ),
                resetAdminAuthState: () =>
                    set(
                        initialAuthState,
                        false,
                        "AdminAuthStore/resetAdminAuthState",
                    ),
                isOnlyEmployee: () => {
                    const user = get().user;
                    return !!(
                        user &&
                        !user.roles.map((role) => role.code).includes("ADMIN")
                    );
                },
                isAdmin: () => {
                    const user = get().user;
                    return !!(
                        user &&
                        user.roles.map((role) => role.code).includes("ADMIN")
                    );
                },
            }),
            {
                name: "osiris-admin-auth-store",
                storage: {
                    getItem: (name) => {
                        if (typeof window !== "undefined") {
                            const str = localStorage.getItem(name);
                            if (str) {
                                return JSON.parse(str);
                            }
                        }
                        return null;
                    },
                    setItem: (name, value) => {
                        if (typeof window !== "undefined") {
                            localStorage.setItem(name, JSON.stringify(value));
                        }
                    },
                    removeItem: (name) => {
                        if (typeof window !== "undefined") {
                            localStorage.removeItem(name);
                        }
                    },
                },
            },
        ),
        {
            name: "AdminAuthStore",
            anonymousActionType: "AdminAuthStore",
        },
    ),
);

if (typeof window !== "undefined") {
    const storageEventCallback = (e: StorageEvent) => {
        if (
            e.key === useAdminAuthStore.persist.getOptions().name &&
            e.newValue
        ) {
            useAdminAuthStore.persist.rehydrate();
        }
    };

    window.addEventListener("storage", storageEventCallback);

    window.removeEventListener("storage", storageEventCallback);
}

export default createTrackedSelector(useAdminAuthStore);
