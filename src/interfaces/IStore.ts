import IComment from "./IComment";
import IGenre from "./IGenre";
import IMovie from "./IMovie";
import IUser from "./IUser";

export default interface AppStoreState {
  movies: IMovie[];
  searchTerm: string;
  user: IUser | null;
  userItem: IUser | null;
  genres: IGenre[];
  favorites: IMovie[];
  latestMovies: IMovie[];
  setSearchTerm: (string: string) => void;
  setGenres: (genres: IGenre[]) => void;
  setMovies: (movies: IMovie[]) => void;
  setUser: (data: IUser | null) => void;
  setUserItem: (data: IUser) => void;
  setFavorites: (favorites: IMovie[]) => void;
  setLatestMovies: (latestMovies: IMovie[]) => void;
}
