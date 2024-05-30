import type IFavoriteMovie from "./IFavoriteMovie";
import type IGenre from "./IGenre";

export default interface IMovie {
    id?: number;
    title: string;
    photoSrc: string;
    trailerSrc: string;
    duration: string;
    ratingImdb: number;
    releaseYear: number;
    description: string;
    genres?: IGenre[];
    reviews?: any[];
    userWhoBookmarkedIt?: IFavoriteMovie[];
}
