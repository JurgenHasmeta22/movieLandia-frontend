import { create } from "zustand";
import type AppStoreState from "~/types/IStore";

export const useStore = create<AppStoreState>(
    (set, get): AppStoreState => ({
        user: null,
        isUserLoading: true,
        mobileOpen: window.innerWidth < 768 ? true : false,
        isPageShrunk: window.innerWidth < 768 ? true : false,
        isOpenSidebarAdmin: true,
        openDrawer: false,
        setUser: (data) => {
            set({ user: data });
        },
        setIsUserLoading: (data) => {
            set({ isUserLoading: data });
        },
        setMobileOpen: (data) => {
            set({ mobileOpen: data });
        },
        setIsPageShrunk: (data) => {
            set({ isPageShrunk: data });
        },
        setIsOpenSidebarAdmin: (data) => {
            set({ isOpenSidebarAdmin: data });
        },
        setOpenDrawer: (data) => {
            set({ openDrawer: data });
        },
    }),
);
