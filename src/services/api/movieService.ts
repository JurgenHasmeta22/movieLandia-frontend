import axios from "axios";
import type IMovie from "~/types/IMovie";
import IMoviePatch from "~/types/IMoviePatch";
import type IMoviesResponse from "~/types/IMoviesResponse";
import type IUser from "~/types/IUser";

const api = {
    url: import.meta.env.VITE_API_URL,
};

const movieService = {
    getMovies: async ({
        sortBy,
        ascOrDesc,
        page,
        pageSize,
        title,
        filterValue,
        filterName,
        filterOperator,
    }: {
        sortBy?: string;
        ascOrDesc?: string;
        page?: string;
        pageSize?: string;
        title?: string;
        filterValue?: string;
        filterName?: string;
        filterOperator?: string;
    }): Promise<any> => {
        let url = `${api.url}/getMovies`;

        const queryParams = [
            sortBy && `sortBy=${sortBy}`,
            ascOrDesc && `ascOrDesc=${ascOrDesc}`,
            page && `page=${page}`,
            pageSize && `pageSize=${pageSize}`,
            title && `title=${title}`,
            filterValue && `filterValue=${filterValue}`,
            filterName && `filterName=${filterName}`,
            filterOperator && `filterOperator=${filterOperator}`,
        ]
            .filter(Boolean)
            .join("&");

        if (queryParams) {
            url += `?${queryParams}`;
        }

        const moviesResponse: IMoviesResponse = await axios.get(url).then((res) => res.data);
        return moviesResponse;
    },
    searchMoviesByTitle: async (title: string, page?: string): Promise<any> => {
        let url = `${api.url}/searchMoviesByTitle?title=${title}`;

        if (page) {
            url += `&page=${page}`;
        }

        const moviesResponse: IMoviesResponse = await axios.get(url).then((res) => res.data);
        return moviesResponse;
    },
    getMovieByTitle: async (title: string | undefined): Promise<any> => {
        const movie: IMovie = await axios
            .get(`${api.url}/getMovieByTitle/${title}`)
            .then((x) => x.data);

        return movie;
    },
    getMovieById: async (id: any | undefined): Promise<any> => {
        const movie: IMovie = await axios.get(`${api.url}/getMovieById/${id}`).then((x) => x.data);
        return movie;
    },
    getLatestMovies: async (): Promise<any> => {
        const latestMovies: IMovie[] = await axios
            .get(`${api.url}/getLatestMovies`)
            .then((x) => x.data);

        return latestMovies;
    },
    addToFavorites: async (
        movieId: number | undefined,
        userId: number | undefined,
    ): Promise<any> => {
        if (localStorage.token) {
            const config = {
                headers: {
                    Authorization: localStorage.token,
                },
            };

            const payload = {
                movieId,
                userId,
            };

            const user: IUser = await axios
                .post(`${api.url}/bookmarkMovie`, payload, config)
                .then((x) => x.data);

            return user;
        }
    },
    updateMovie: async (payload: IMoviePatch, id: number): Promise<any> => {
        let url = `${api.url}/updateMovieById/${id}`;
        const movie: IMovie = await axios.patch(url, payload).then((res) => res.data);
        return movie;
    },
    deleteMovie: async (id: number): Promise<any> => {
        let url = `${api.url}/deleteMovieById/${id}`;
        const movie: IMovie = await axios.delete(url).then((res) => res.data);
        return movie;
    },
};

export default movieService;
