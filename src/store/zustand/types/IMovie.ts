import IFavoriteMovie from "./IFavoriteMovie"
import IGenre from "./IGenre"

export default interface IMovie {
  id?: number,
  title: string,
  videoSrc: string,
  photoSrc: string,
  trailerSrc: string,
  duration: string,
  ratingImdb: number,
  releaseYear: number,
  description: number,
  views: number,
  genres?: IGenre[],
  userWhoBookmarkedIt?: IFavoriteMovie[]
}