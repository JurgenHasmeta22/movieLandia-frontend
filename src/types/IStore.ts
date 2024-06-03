import type IUser from "./IUser";
export default interface AppStoreState {
    user: IUser | null;
    isUserLoading: boolean;
    mobileOpen: boolean | any;
    isPageShrunk: boolean | any;
    isOpenSidebarAdmin: boolean | any;
    openDrawer: boolean | any;
    selectedReview: any;
    upvotesPageModal: number;
    downvotesPageModal: number;
    hasMoreUpvotesModal: boolean;
    hasMoreDownvotesModal: boolean;
    setSelectedReview: (data: any) => void;
    setUser: (data: IUser | null) => void;
    setIsUserLoading: (data: boolean) => void;
    setMobileOpen: (data: any) => void;
    setIsPageShrunk: (data: any) => void;
    setIsOpenSidebarAdmin: (data: any) => void;
    setOpenDrawer: (data: any) => void;
    setUpvotesPageModal: (data: any) => void;
    setDownvotesPageModal: (data: any) => void;
    setHasMoreUpvotesModal: (data: any) => void;
    setHasMoreDownvotesModal: (data: any) => void;
}
