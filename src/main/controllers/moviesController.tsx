import axios from 'axios';
import IGenreResponse from '../store/zustand/types/IGenreResponse';
import IMovie from '../store/zustand/types/IMovie';
import IMoviesCount from '../store/zustand/types/IMoviesCount';
import IMoviesResponse from '../store/zustand/types/IMoviesResponse';
import IUser from '../store/zustand/types/IUser';

const moviesController = {
  getMovieCount: async(): Promise<any> => {
    const moviesCount: IMoviesCount = await axios.get("http://localhost:4000/movie-count").then(x=>x.data);
    return moviesCount;
  },

  getMovie: async(title: string | undefined): Promise<any> => {
    const movie: IMovie = await axios.get(`http://localhost:4000/movie/${title}`).then(x=>x.data);
    return movie;
  },

  getLatestMovies: async(): Promise<any> => {
    const latestMovies: IMovie[] = await axios.get("http://localhost:4000/latest").then(x=>x.data);
    return latestMovies;
  },

  getMoviesDefault: async(): Promise<any> => {
    const moviesResponse: IMoviesResponse = await axios.get("http://localhost:4000/movies/page/1").then(x=>x.data);
    return moviesResponse.rows;
  },

  getMoviesPagination: async(page: string): Promise<any> => {
    const moviesResponse: IMoviesResponse = await axios.get(`http://localhost:4000/movies/page/${page}`).then(x=>x.data);
    return moviesResponse.rows;
  },

  getMoviesSearchWithPagination: async(query: string, page: string): Promise<any> => {
    const payload = {
      title: query,
      page: page
    }
    const responseSearch = await axios.post("http://localhost:4000/search", payload).then(x=>x.data);
    return responseSearch;
  },

  getMoviesSearchNoPagination: async(query: string): Promise<any> => {
    const payload = {
      title: query,
      page: 1
    }
    const responseSearch = await axios.post("http://localhost:4000/search", payload).then(x=>x.data);
    return responseSearch;
  },

  getMoviesSortingWithPagination: async(sort: string, page: string): Promise<any> => {
    const moviesResponse: IMoviesResponse = await axios.get(`http://localhost:4000/movies/page/${page}?sortBy=${sort}&ascOrDesc=desc`).then(x=>x.data);
    return moviesResponse;
  },

  getMoviesSortingNoPagination: async(sort: string): Promise<any> => {
    const moviesResponse: IMoviesResponse = await axios.get(`http://localhost:4000/movies/page/1?sortBy=${sort}&ascOrDesc=desc`).then(x=>x.data);
    return moviesResponse;
  },

  addToFavorites: async(movieId: number | undefined): Promise<any> => {
    const payload = {
      movieId
    }
    const user: IUser = await axios.post("http://localhost:4000/favorites", payload).then(x=>x.data);
    return user;
  },

  getGenreMoviesNoPagination: async(name: string): Promise<any> => {
    const responseGenre: IGenreResponse = await axios.get(`http://localhost:4000/genres/${name}?page=1`).then(x => x.data);
    return responseGenre;
  },

  getGenreMoviesWithPagination: async(name: string, page: string): Promise<any> => {
    const responseGenre: IGenreResponse = await axios.get(`http://localhost:4000/genres/${name}?page=${page}`).then(x => x.data);
    return responseGenre;
  }

}

export default moviesController;