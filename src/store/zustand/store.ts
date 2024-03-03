import create from "zustand";
import type AppStoreState from "~/interfaces/IStore";

export const useStore = create<AppStoreState>(
    (set, get): AppStoreState => ({
        user: null,
        setUser: (data) => {
            set({ user: data });
        },
    }),
);
