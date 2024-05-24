import type IUser from "./IUser";
export default interface AppStoreState {
    user: IUser | null;
    isUserLoading: boolean;
    mobileOpen: boolean | any;
    isPageShrunk: boolean | any;
    isOpenSidebarAdmin: boolean | any;
    openDrawer: boolean | any;
    setUser: (data: IUser | null) => void;
    setIsUserLoading: (data: boolean) => void;
    setMobileOpen: (data: any) => void;
    setIsPageShrunk: (data: any) => void;
    setIsOpenSidebarAdmin: (data: any) => void;
    setOpenDrawer: (data: any) => void;
}
