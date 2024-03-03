import IMovie from './IMovie';
import IUser from './IUser';

export default interface IFavoriteMovie {
    id?: number;
    userId: number;
    movieId: number;
    user?: IUser;
    movie?: IMovie;
}
