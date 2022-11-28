import IMovie from "./IMovie";

export default interface IMoviesResponse {
  count: number,
  rows: IMovie[]
}