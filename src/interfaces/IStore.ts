import IUser from './IUser';
export default interface AppStoreState {
    user: IUser | null;
    setUser: (data: IUser | null) => void;
}
