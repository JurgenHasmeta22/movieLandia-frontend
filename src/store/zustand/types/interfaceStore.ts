import IComment from "./IComment";
import IGenre from "./IGenre";
import IMovie from "./IMovie";
import IUser from "./IUser";

export default interface AppStoreState {
  users: IUser[];
  movies: IMovie[];
  searchTerm: string;
  user: IUser | null;
  userItem: IUser | null;
  genres: IGenre[];
  movieItem: IMovie | null;
  comments: IComment[];
  favorites: IMovie[];
  latestMovies: IMovie[];
  setComments: (array: IComment[]) => void;
  setSearchTerm: (string: string) => void;
  setMovieItem: (data: IMovie) => void;
  setGenres: (genres: IGenre[]) => void;
  setMovies: (movies: IMovie[]) => void;
  setUser: (data: IUser | null) => void;
  setUserItem: (data: IUser) => void;
  setFavorites: (favorites: IMovie[]) => void;
  setLatestMovies: (latestMovies: IMovie[]) => void;
  emailLogin: string;
  passwordLogin: string;
  handleEmailChangeLogin: (e: any) => void;
  handlePasswordChangeLogin: (e: any) => void;
  handleFormSubmitLogin: (e: any) => void;
  userNameRegister: string;
  emailRegister: string;
  passwordRegister: string;
  handleFormSubmitRegister: (e: any) => void;
  handleUserNameRegister: (e: any) => void;
  handleEmailRegister: (e: any) => void;
  handlePasswordChangeRegister: (e: any) => void;
}
