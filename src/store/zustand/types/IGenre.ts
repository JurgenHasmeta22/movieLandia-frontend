import IMovie from "./IMovie"

export default interface IGenre {
  id?: number,
  name: string,
  movies?: IMovie[]
}