import axios from 'axios';
import IGenre from '~/interfaces/IGenre';
import IGenreResponse from '~/interfaces/IGenreResponse';
import IMovie from '~/interfaces/IMovie';
import IMoviesCount from '~/interfaces/IMoviesCount';
import IMoviesResponse from '~/interfaces/IMoviesResponse';
import IUser from '~/interfaces/IUser';
import ISerie from '../interfaces/ISerie';

const api = {
	url: import.meta.env.VITE_API_URL
};

const moviesController = {
	getMovieCount: async (): Promise<any> => {
		const moviesCount: IMoviesCount = await axios.get(`${api.url}/movie-count`).then((x) => x.data);
		return moviesCount;
	},

	getMovie: async (title: string | undefined): Promise<any> => {
		const movie: IMovie = await axios.get(`${api.url}/movie/${title}`).then((x) => x.data);
		return movie;
	},

	getLatestMovies: async (): Promise<any> => {
		const latestMovies: IMovie[] = await axios.get(`${api.url}/latest`).then((x) => x.data);
		return latestMovies;
	},

	getMoviesDefault: async (): Promise<any> => {
		const moviesResponse: IMoviesResponse = await axios
			.get(`${api.url}/movies/page/1`)
			.then((x) => x.data);
		return moviesResponse.rows;
	},

	getMoviesPagination: async (page: string | null): Promise<any> => {
		const moviesResponse: IMoviesResponse = await axios
			.get(`${api.url}/movies/page/${page}`)
			.then((x) => x.data);
		return moviesResponse.rows;
	},

	getMoviesSearchWithPagination: async (
		query: string | null,
		page: string | null
	): Promise<any> => {
		const payload = {
			title: query,
			page: page
		};
		const responseSearch = await axios.post(`${api.url}/search`, payload).then((x) => x.data);
		return responseSearch;
	},

	getMoviesSearchNoPagination: async (query: string | null): Promise<any> => {
		const payload = {
			title: query,
			page: 1
		};
		const responseSearch = await axios.post(`${api.url}/search`, payload).then((x) => x.data);
		return responseSearch;
	},

	getMoviesSortingWithPagination: async (
		sort: string | null,
		page: string | null
	): Promise<any> => {
		const moviesResponse: IMoviesResponse = await axios
			.get(`${api.url}/movies/page/${page}?sortBy=${sort}&ascOrDesc=desc`)
			.then((x) => x.data);
		return moviesResponse;
	},

	getMoviesSortingNoPagination: async (sort: string | null): Promise<any> => {
		const moviesResponse: IMoviesResponse = await axios
			.get(`${api.url}/movies/page/1?sortBy=${sort}&ascOrDesc=desc`)
			.then((x) => x.data);
		return moviesResponse;
	},

	addToFavorites: async (movieId: number | undefined): Promise<any> => {
		if (localStorage.token) {
			const config = {
				headers: {
					Authorization: localStorage.token
				}
			};
			const payload = {
				movieId
			};
			const user: IUser = await axios
				.post(`${api.url}/favorites`, payload, config)
				.then((x) => x.data);
			return user;
		}
	},

	getGenreMoviesNoPagination: async (name: string): Promise<any> => {
		const responseGenre: IGenreResponse = await axios
			.get(`${api.url}/genres/${name}?page=1`)
			.then((x) => x.data);
		return responseGenre;
	},

	getGenreMoviesWithPagination: async (
		name: string | undefined,
		page: string | undefined | null
	): Promise<any> => {
		const responseGenre: IGenreResponse = await axios
			.get(`${api.url}/genres/${name}?page=${page}`)
			.then((x) => x.data);
		return responseGenre;
	},

	getGenresWithNoPagination: async (): Promise<any> => {
		const genres: IGenre[] = await axios.get(`${api.url}/genres`).then((x) => x.data);
		return genres;
	},

	getSerieEpisodesNoPagination: async (): Promise<any> => {
		const responseGenre: IGenreResponse = await axios
			.get(`${api.url}/series/page/1`)
			.then((x) => x.data);
		return responseGenre;
	},

	getSerieEpisodesWithPagination: async (page: string | undefined | null): Promise<any> => {
		const responseGenre: ISerie = await axios
			.get(`${api.url}/series/page/${page}`)
			.then((x) => x.data);
		return responseGenre;
	},

	getSerieCount: async (): Promise<any> => {
		const seriesCount: any = await axios.get(`${api.url}/series-count`).then((x) => x.data);
		return seriesCount;
	},

	getSerieMovie: async (slug: string | undefined): Promise<any> => {
		const responseGenre: ISerie = await axios.get(`${api.url}/series/${slug}`).then((x) => x.data);
		return responseGenre;
	}
};

export default moviesController;
