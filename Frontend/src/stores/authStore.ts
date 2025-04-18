"use client";
import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import { createTrackedSelector } from "react-tracked";
import { PaymentMethodType } from "@/models/PaymentMethod";
import { UserResponse } from "@/models/User";

interface AuthState {
    jwtToken: string | null;
    user: UserResponse | null;
    currentCartId: number | null;
    currentTotalCartItems: number;
    currentPaymentMethod: PaymentMethodType;
    currentSignupUserId: number | null;
}

interface AuthAction {
    updateJwtToken: (value: string) => void;
    updateUser: (value: UserResponse) => void;
    resetAuthState: () => void;
    updateCurrentCartId: (value: number | null) => void;
    updateCurrentTotalCartItems: (value: number) => void;
    updateCurrentPaymentMethod: (value: PaymentMethodType) => void;
    updateCurrentSignupUserId: (value: number | null) => void;
}

const initialAuthState: AuthState = {
    jwtToken: null,
    user: null,
    currentCartId: null,
    currentTotalCartItems: 0,
    currentPaymentMethod: PaymentMethodType.CASH,
    currentSignupUserId: null,
};

// Hàm helper để truy cập an toàn localStorage
const createStorage = () => {
    if (typeof window === "undefined") {
        // Trả về mocked storage cho server-side
        return {
            getItem: async () => null,
            setItem: async () => null,
            removeItem: async () => null,
        };
    }

    return {
        getItem: async (name: string) => {
            const item = localStorage.getItem(name);
            return item ? JSON.parse(item) : null;
        },
        setItem: async (name: string, value: any) => {
            localStorage.setItem(name, JSON.stringify(value));
        },
        removeItem: async (name: string) => {
            localStorage.removeItem(name);
        },
    };
};

export const useAuthStore = create<AuthState & AuthAction>()(
    devtools(
        persist(
            (set, get) => ({
                ...initialAuthState,
                updateJwtToken: (value) =>
                    set(
                        () => ({ jwtToken: value }),
                        false,
                        "AuthStore/updateJwtToken",
                    ),
                updateUser: (value) =>
                    set(() => ({ user: value }), false, "AuthStore/updateUser"),
                // Do not reset currentSignupUserId
                resetAuthState: () =>
                    set(
                        () => ({
                            jwtToken: null,
                            user: null,
                            currentCartId: null,
                            currentTotalCartItems: 0,
                            currentPaymentMethod: PaymentMethodType.CASH,
                        }),
                        false,
                        "AuthStore/resetAuthState",
                    ),
                updateCurrentCartId: (value) =>
                    set(
                        () => ({ currentCartId: value }),
                        false,
                        "AuthStore/updateCurrentCartId",
                    ),
                updateCurrentTotalCartItems: (value) =>
                    set(
                        () => ({ currentTotalCartItems: value }),
                        false,
                        "AuthStore/updateCurrentTotalCartItems",
                    ),
                updateCurrentPaymentMethod: (value) =>
                    set(
                        () => ({ currentPaymentMethod: value }),
                        false,
                        "AuthStore/updateCurrentPaymentMethod",
                    ),
                updateCurrentSignupUserId: (value) =>
                    set(
                        () => ({ currentSignupUserId: value }),
                        false,
                        "AuthStore/updateCurrentSignupUserId",
                    ),
            }),
            {
                name: "osiris-auth-store",
                storage: createStorage(),
            },
        ),
        {
            name: "AuthStore",
            anonymousActionType: "AuthStore",
        },
    ),
);

// Tạo một custom hook để xử lý storage event
// const withStorageDOMEvents = (store: typeof useAuthStore) => {
//     const storageEventCallback = (e: StorageEvent) => {
//         if (e.key === store.persist.getOptions().name && e.newValue) {
//             store.persist.rehydrate();
//         }
//     };

//     window.addEventListener("storage", storageEventCallback);

//     return () => {
//         window.removeEventListener("storage", storageEventCallback);
//     };
// };

// withStorageDOMEvents(useAuthStore);

export default createTrackedSelector(useAuthStore);
