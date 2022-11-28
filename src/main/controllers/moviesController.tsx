import axios from 'axios';
import IMovie from '../store/zustand/types/IMovie';
import IMoviesCount from '../store/zustand/types/IMoviesCount';
import IMoviesResponse from '../store/zustand/types/IMoviesResponse';

const moviesController = {
  getMovieCount: async(): Promise<any> => {
    const moviesCount: IMoviesCount = await axios.get("http://localhost:4000/movie-count").then(x=>x.data);
    return moviesCount;
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
  }
}

export default moviesController;