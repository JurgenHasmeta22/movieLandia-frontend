import IUser from "./IUser";

export default interface IResponseLogin {
  token: string;
  user: IUser;
}
