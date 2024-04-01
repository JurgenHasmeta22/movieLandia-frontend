import axios from "axios";
import type IGenre from "~/interfaces/IGenre";
import type IGenreResponse from "~/interfaces/IGenreResponse";
import type IMovie from "~/interfaces/IMovie";
import type IMoviesCount from "~/interfaces/IMoviesCount";
import type IMoviesResponse from "~/interfaces/IMoviesResponse";
import type IUser from "~/interfaces/IUser";
import type ISerie from "../interfaces/ISerie";
import ISeriesResponse from "~/interfaces/ISeriesResponse";

const api = {
    url: import.meta.env.VITE_API_URL,
};

const moviesController = {
    getMovie: async (title: string | undefined): Promise<any> => {
        const movie: IMovie = await axios
            .get(`${api.url}/getMovieByTitle/${title}`)
            .then((x) => x.data);
        return movie;
    },
    getLatestMovies: async (): Promise<any> => {
        const latestMovies: IMovie[] = await axios
            .get(`${api.url}/getLatestMovies`)
            .then((x) => x.data);
        return latestMovies;
    },
    getMovies: async (): Promise<any> => {
        try {
            let url = `${api.url}/getMovies`;

            const queryString = window.location.search;
            url += `${queryString}`;

            const response = await axios.get(url);
            return response.data;
        } catch (error) {
            console.error("Error fetching movies:", error);
            throw error;
        }
    },
    getMoviesSearch: async (params?: Record<string, string>): Promise<any> => {
        try {
            let url = `${api.url}/searchMoviesByTitle`;

            if (params) {
                const queryString = window.location.search;
                url += `${queryString}`;
            }

            const response = await axios.get(url);
            return response.data;
        } catch (error) {
            console.error("Error fetching movies:", error);
            throw error;
        }
    },
    addToFavorites: async (movieId: number | undefined): Promise<any> => {
        if (localStorage.token) {
            const config = {
                headers: {
                    Authorization: localStorage.token,
                },
            };
            const payload = {
                movieId,
            };
            const user: IUser = await axios
                .post(`${api.url}/favorites`, payload, config)
                .then((x) => x.data);
            return user;
        }
    },
    getGenres: async (): Promise<any> => {
        const responseGenre = await axios.get(`${api.url}/getGenres`).then((x) => x.data);
        return responseGenre;
    },
    getGenre: async (): Promise<any> => {
        const responseGenre = await axios.get(`${api.url}/getGenreByName`).then((x) => x.data);
        return responseGenre;
    },
    getSeries: async (): Promise<any> => {
        const responseGenre: ISeriesResponse = await axios
            .get(`${api.url}/series`)
            .then((x) => x.data);
        return responseGenre;
    },
    getSerie: async (slug: string | undefined): Promise<any> => {
        const responseGenre: ISerie = await axios
            .get(`${api.url}/series/${slug}`)
            .then((x) => x.data);
        return responseGenre;
    },
};

export default moviesController;
