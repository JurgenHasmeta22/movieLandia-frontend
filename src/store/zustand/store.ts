import create from "zustand";
import type AppStoreState from "~/interfaces/IStore";

export const useStore = create<AppStoreState>(
    (set, get): AppStoreState => ({
        user: null,
        mobileOpen: false,
        openDrawer: false,
        isPageShrunk: false,
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
        }
    }),
);
