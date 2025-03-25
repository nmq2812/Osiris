"use client";
import { SliceCreator } from "./use-app-store";

export interface AdminSiteState {
    opened: boolean;
    toggleOpened: () => void;
}

const initialAdminSiteState = {
    opened: false,
};

const createAdminSiteSlice: SliceCreator<AdminSiteState> = (set) => ({
    ...initialAdminSiteState,
    toggleOpened: () =>
        set((state: { opened: any }) => ({ opened: !state.opened })),
});

export default createAdminSiteSlice;
