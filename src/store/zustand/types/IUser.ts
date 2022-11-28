import IComment from "./IComment";
import IMovie from "./IMovie";

export default interface IUser {
  id?: number,
  userName: string,
  email: string,
  password: string,
  comments?: IComment[],
  favMovies?: IMovie[]
}