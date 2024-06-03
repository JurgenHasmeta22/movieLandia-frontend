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
        selectedReview: null,
        hasMoreUpvotesModal: false,
        hasMoreDownvotesModal: false,
        upvotesPageModal: 1,
        downvotesPageModal: 1,
        setSelectedReview: (data) => {
            set({ selectedReview: data });
        },
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
        setUpvotesPageModal: (data) => {
            set({ upvotesPageModal: data });
        },
        setDownvotesPageModal: (data) => {
            set({ downvotesPageModal: data });
        },
        setHasMoreUpvotesModal: (data) => {
            set({ hasMoreUpvotesModal: data });
        },
        setHasMoreDownvotesModal: (data) => {
            set({ hasMoreDownvotesModal: data });
        },
    }),
);
