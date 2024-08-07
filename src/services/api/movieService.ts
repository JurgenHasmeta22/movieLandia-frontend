import axios from "axios";
import type IMovie from "~/types/IMovie";
import IMoviePatch from "~/types/IMoviePatch";
import IMoviePost from "~/types/IMoviePost";
import type IMoviesResponse from "~/types/IMoviesResponse";
import type IUser from "~/types/IUser";

const api = {
    url: import.meta.env.VITE_API_URL,
};

const getAuthHeader = () => {
    const token = localStorage.getItem('token');
    return token ? { Authorization: `Bearer ${token.replace(/^"|"$/g, '')}` } : {};
};

const movieService = {
    // #region "CRUD"
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

        try {
            const moviesResponse: IMoviesResponse = await axios.get(url).then((res) => res.data);
            return moviesResponse;
        } catch (error) {
            return { error };
        }
    },

    searchMoviesByTitle: async (title: string, { sortBy, ascOrDesc, page }: any): Promise<any> => {
        let url = `${api.url}/searchMoviesByTitle?title=${title}`;

        if (page) {
            url += `&page=${page}`;
        }

        if (sortBy) {
            url += `&sortBy=${sortBy}`;
        }

        if (ascOrDesc) {
            url += `&ascOrDesc=${ascOrDesc}`;
        }

        try {
            const moviesResponse: IMoviesResponse = await axios.get(url).then((res) => res.data);
            return moviesResponse;
        } catch (error) {
            return { error };
        }
    },

    getMovieByTitle: async (
        titleMovie: string,
        {
            sortBy,
            ascOrDesc,
            page,
            pageSize,
            title,
            filterValue,
            filterName,
            filterOperator,
            upvotesPage,
            downvotesPage,
            userId,
        }: {
            sortBy?: string;
            ascOrDesc?: string;
            page?: string;
            pageSize?: string;
            title?: string;
            filterValue?: string;
            filterName?: string;
            filterOperator?: string;
            upvotesPage?: number;
            downvotesPage?: number;
            userId?: number;
        },
    ): Promise<any> => {
        let url = `${api.url}/getMovieByTitle/${titleMovie}`;

        const queryParams = [
            sortBy && `sortBy=${sortBy}`,
            ascOrDesc && `ascOrDesc=${ascOrDesc}`,
            page && `page=${page}`,
            pageSize && `pageSize=${pageSize}`,
            title && `title=${title}`,
            filterValue && `filterValue=${filterValue}`,
            filterName && `filterName=${filterName}`,
            filterOperator && `filterOperator=${filterOperator}`,
            upvotesPage && `upvotesPage=${upvotesPage}`,
            downvotesPage && `downvotesPage=${downvotesPage}`,
            userId && `userId=${userId}`,
        ]
            .filter(Boolean)
            .join("&");

        if (queryParams) {
            url += `?${queryParams}`;
        }

        try {
            const movie: IMovie = await axios.get(url).then((res) => res.data);
            return movie;
        } catch (error) {
            return { error };
        }
    },
    getMovieById: async (id: any | undefined): Promise<any> => {
        try {
            const movie: IMovie = await axios.get(`${api.url}/getMovieById/${id}`).then((x) => x.data);
            return movie;
        } catch (error) {
            return { error };
        }
    },

    getLatestMovies: async (): Promise<any> => {
        try {
            const latestMovies: IMovie[] = await axios.get(`${api.url}/getLatestMovies`).then((x) => x.data);
            return latestMovies;
        } catch (error) {
            return { error };
        }
    },

    getRelatedMovies: async (movieTitle: string): Promise<any> => {
        try {
            const latestMovies: IMovie[] = await axios
                .get(`${api.url}/getRelatedMovies?title=${movieTitle}`)
                .then((x) => x.data);

            return latestMovies;
        } catch (error) {
            return { error };
        }
    },

    updateMovie: async (payload: IMoviePatch, id: number): Promise<any> => {
        let url = `${api.url}/updateMovieById/${id}`;

        try {
            const movie: IMovie = await axios.patch(url, payload).then((res) => res.data);
            return movie;
        } catch (error) {
            return { error };
        }
    },

    addMovie: async (payload: IMoviePost): Promise<any> => {
        let url = `${api.url}/addMovie`;

        try {
            const movie: IMovie = await axios.post(url, payload).then((res) => res.data);
            return movie;
        } catch (error) {
            return { error };
        }
    },

    deleteMovie: async (id: number): Promise<any> => {
        let url = `${api.url}/deleteMovieById/${id}`;

        try {
            const movie: IMovie = await axios.delete(url).then((res) => res.data);
            return movie;
        } catch (error) {
            return { error };
        }
    },
    // #endregion

    // #region "Bookmarks"
    addToFavorites: async (movieId: number | undefined, userId: number | undefined): Promise<any> => {
        const payload = {
            movieId,
            userId,
        };

        try {
            const user: IUser = await axios.post(`${api.url}/bookmarkMovie`, payload, {
                headers: getAuthHeader(),
            }).then((x) => x.data);
            return user;
        } catch (error) {
            return { error };
        }
    },

    removeFromFavorites: async (movieId: number | undefined, userId: number | undefined): Promise<any> => {
        const payload = {
            movieId,
            userId,
        };

        try {
            const user: IUser = await axios.post(`${api.url}/unBookmarkMovie`, payload, {
                headers: getAuthHeader(),
            }).then((x) => x.data);
            return user;
        } catch (error) {
            return { error };
        }
    },

    isMovieBookmared: async (movieTitle: string | undefined, userId: number | undefined): Promise<any> => {
        const payload = {
            movieTitle,
            userId,
        };

        try {
            const result: boolean = await axios.post(`${api.url}/isMovieBookmarked`, payload, {
                headers: getAuthHeader(),
            }).then((x) => x.data);
            return result;
        } catch (error) {
            return { error };
        }
    },
    // #endregion

    // #region "Reviews"
    addReview: async (
        movieId: number | undefined,
        userId: number | undefined,
        review: string,
        rating: number | null,
    ): Promise<any> => {
        const payload = {
            movieId,
            userId,
            content: review,
            rating,
        };

        try {
            const response: any = await axios.post(`${api.url}/addReviewMovie`, payload, {
                headers: getAuthHeader(),
            }).then((x) => x.data);
            return response;
        } catch (error) {
            return { error };
        }
    },

    updateReview: async (
        movieId: number | undefined,
        userId: number | undefined,
        review: string,
        rating: number | null,
    ): Promise<any> => {
        const payload = {
            movieId,
            userId,
            content: review,
            rating,
        };

        try {
            const response: any = await axios.post(`${api.url}/updateReviewMovie`, payload, {
                headers: getAuthHeader(),
            }).then((x) => x.data);
            return response;
        } catch (error) {
            return { error };
        }
    },

    removeReview: async (movieId: number | undefined, userId: number | undefined): Promise<any> => {
        const payload = {
            movieId,
            userId,
        };

        try {
            const response: any = await axios.post(`${api.url}/removeReviewMovie`, payload, {
                headers: getAuthHeader(),
            }).then((x) => x.data);
            return response;
        } catch (error) {
            return { error };
        }
    },
    isMovieReviewed: async (movieTitle: string | undefined, userId: number | undefined): Promise<any> => {
        const payload = {
            movieTitle,
            userId,
        };

        try {
            const result: boolean = await axios.post(`${api.url}/isMovieReviewed`, payload, {
                headers: getAuthHeader(),
            }).then((x) => x.data);
            return result;
        } catch (error) {
            return { error };
        }
    },
    // #endregion

    // #region "Upvotes, Downvotes"
    addUpvoteMovieReview: async (
        userId: number | undefined,
        movieId: number | undefined,
        movieReviewId: number,
    ): Promise<any> => {
        const payload = {
            userId,
            movieId,
            movieReviewId,
        };

        try {
            const response: any = await axios.post(`${api.url}/addUpvoteMovieReview`, payload, {
                headers: getAuthHeader(),
            }).then((x) => x.data);
            return response;
        } catch (error) {
            return { error };
        }
    },

    addDownvoteMovieReview: async (
        userId: number | undefined,
        movieId: number | undefined,
        movieReviewId: number,
    ): Promise<any> => {
        const payload = {
            userId,
            movieId,
            movieReviewId,
        };

        try {
            const response: any = await axios.post(`${api.url}/addDownvoteMovieReview`, payload, {
                headers: getAuthHeader(),
            }).then((x) => x.data);
            return response;
        } catch (error) {
            return { error };
        }
    },

    removeUpvoteMovieReview: async (
        userId: number | undefined,
        movieId: number | undefined,
        movieReviewId: number,
    ): Promise<any> => {
        const payload = {
            userId,
            movieId,
            movieReviewId,
        };

        try {
            const response: any = await axios.post(`${api.url}/removeUpvoteMovieReview`, payload, {
                headers: getAuthHeader(),
            }).then((x) => x.data);

            return response;
        } catch (error) {
            return { error };
        }
    },
    removeDownvoteMovieReview: async (
        userId: number | undefined,
        movieId: number | undefined,
        movieReviewId: number,
    ): Promise<any> => {
        const payload = {
            userId,
            movieId,
            movieReviewId,
        };

        try {
            const response: any = await axios.post(`${api.url}/removeDownvoteMovieReview`, payload, {
                headers: getAuthHeader(),
            }).then((x) => x.data);
            return response;
        } catch (error) {
            return { error };
        }
    },

    isMovieReviewUpvotedOrDownvoted: async (
        userId: number | undefined,
        movieId: number | undefined,
        movieReviewId: number,
    ): Promise<any> => {
        const payload = {
            userId,
            movieId,
            movieReviewId,
        };

        try {
            const response: any = await axios
                .post(`${api.url}/isMovieReviewUpvotedOrDownvoted`, payload, {
                    headers: getAuthHeader(),
                })
                .then((x) => x.data);

            return response;
        } catch (error) {
            return { error };
        }
    },
    // #endregion
};

export default movieService;
