import create from "zustand";
import type AppStoreState from "~/types/IStore";

export const useStore = create<AppStoreState>(
    (set, get): AppStoreState => ({
        user: null,
        mobileOpen: window.innerWidth < 768 ? true : false,
        openDrawer: false,
        isPageShrunk: window.innerWidth < 768 ? true : false,
        setUser: (data) => {
            set({ user: data });
        },
        setMobileOpen: (data) => {
            set({ mobileOpen: data });
        },
        setOpenDrawer: (data) => {
            set({ openDrawer: data });
        },
        setIsPageShrunk: (data) => {
            set({ isPageShrunk: data });
        },
    }),
);
