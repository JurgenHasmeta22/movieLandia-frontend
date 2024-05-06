import type IUser from "./IUser";
export default interface AppStoreState {
    user: IUser | null;
    mobileOpen: boolean | any;
    openDrawer: boolean | any;
    isPageShrunk: boolean | any;
    setUser: (data: IUser | null) => void;
    setMobileOpen: (data: any) => void;
    setOpenDrawer: (data: any) => void;
    setIsPageShrunk: (data: any) => void;
}
