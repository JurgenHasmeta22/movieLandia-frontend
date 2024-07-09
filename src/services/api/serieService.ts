import axios from "axios";
import type IMoviesResponse from "~/types/IMoviesResponse";
import ISerie from "~/types/ISerie";
import ISeriePatch from "~/types/ISeriePatch";
import ISeriePost from "~/types/ISeriePost";
import IUser from "~/types/IUser";

const api = {
    url: import.meta.env.VITE_API_URL_PROD,
};

const serieService = {
    // #region "CRUD"
    getSeries: async ({
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
        let url = `${api.url}/getSeries`;

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
            const response: IMoviesResponse = await axios.get(url).then((res) => res.data);
            return response;
        } catch (error) {
            // console.log(error);
            return { error };
        }
    },
    getSerieByTitle: async (
        titleSerie: string,
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
        let url = `${api.url}/getSerieByTitle/${titleSerie}`;

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
            const serie: ISerie = await axios.get(url).then((res) => res.data);
            return serie;
        } catch (error) {
            return { error };
        }
    },
    getSerieById: async (id: any): Promise<any> => {
        let url = `${api.url}/getSerieById/${id}`;

        try {
            const serie: ISerie = await axios.get(url).then((res) => res.data);
            return serie;
        } catch (error) {
            return { error };
        }
    },
    searchSeriesByTitle: async (title: string, { sortBy, ascOrDesc, page }: any): Promise<any> => {
        let url = `${api.url}/searchSeriesByTitle?title=${title}`;

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
            const response: IMoviesResponse = await axios.get(url).then((res) => res.data);
            return response;
        } catch (error) {
            return { error };
        }
    },
    getLatestSeries: async (): Promise<any> => {
        try {
            const latestSeries: ISerie[] = await axios.get(`${api.url}/getLatestSeries`).then((x) => x.data);

            return latestSeries;
        } catch (error) {
            return { error };
        }
    },
    getRelatedSeries: async (serieTitle: string): Promise<any> => {
        try {
            const latestSeries: ISerie[] = await axios
                .get(`${api.url}/getRelatedSeries?title=${serieTitle}`)
                .then((x) => x.data);
            return latestSeries;
        } catch (error) {
            return { error };
        }
    },
    updateSerie: async (payload: ISeriePatch, id: number): Promise<any> => {
        let url = `${api.url}/updateSerieById/${id}`;

        try {
            const serie: ISerie = await axios.patch(url, payload).then((res) => res.data);
            return serie;
        } catch (error) {
            return { error };
        }
    },
    addSerie: async (payload: ISeriePost): Promise<any> => {
        let url = `${api.url}/addSerie`;

        try {
            const serie: ISerie = await axios.post(url, payload).then((res) => res.data);
            return serie;
        } catch (error) {
            return { error };
        }
    },
    deleteSerie: async (id: number): Promise<any> => {
        let url = `${api.url}/deleteSerieById/${id}`;

        try {
            const serie: ISerie = await axios.delete(url).then((res) => res.data);
            return serie;
        } catch (error) {
            return { error };
        }
    },
    // #endregion

    // #region "Bookmarks"
    addToFavorites: async (serieId: number | undefined, userId: number | undefined): Promise<any> => {
        const payload = {
            serieId,
            userId,
        };

        try {
            const user: IUser = await axios.post(`${api.url}/bookmarkSerie`, payload).then((x) => x.data);
            return user;
        } catch (error) {
            return { error };
        }
    },
    removeFromFavorites: async (serieId: number | undefined, userId: number | undefined): Promise<any> => {
        const payload = {
            serieId,
            userId,
        };

        try {
            const user: IUser = await axios.post(`${api.url}/unBookmarkSerie`, payload).then((x) => x.data);

            return user;
        } catch (error) {
            return { error };
        }
    },
    isSerieBookmared: async (serieTitle: string | undefined, userId: number | undefined): Promise<any> => {
        const payload = {
            serieTitle,
            userId,
        };

        try {
            const result: boolean = await axios.post(`${api.url}/isSerieBookmarked`, payload).then((x) => x.data);

            return result;
        } catch (error) {
            // console.log(error);
            return { error };
        }
    },
    // #endregion

    // #region "Reviews"
    addReview: async (
        userId: number | undefined,
        serieId: number | undefined,
        review: string,
        rating: number | null,
    ): Promise<any> => {
        const payload = {
            userId,
            serieId,
            content: review,
            rating,
        };

        try {
            const response: any = await axios.post(`${api.url}/addReviewSerie`, payload).then((x) => x.data);

            return response;
        } catch (error) {
            return { error };
        }
    },
    updateReview: async (
        userId: number | undefined,
        serieId: number | undefined,
        review: string,
        rating: number | null,
    ): Promise<any> => {
        const payload = {
            userId,
            serieId,
            content: review,
            rating,
        };

        try {
            const response: any = await axios.post(`${api.url}/updateReviewSerie`, payload).then((x) => x.data);

            return response;
        } catch (error) {
            return { error };
        }
    },
    removeReview: async (userId: number | undefined, serieId: number | undefined): Promise<any> => {
        const payload = {
            userId,
            serieId,
        };

        try {
            const response: any = await axios.post(`${api.url}/removeReviewSerie`, payload).then((x) => x.data);

            return response;
        } catch (error) {
            return { error };
        }
    },
    isSerieReviewed: async (serieTitle: string | undefined, userId: number | undefined): Promise<any> => {
        const payload = {
            serieTitle,
            userId,
        };

        try {
            const result: boolean = await axios.post(`${api.url}/isSerieReviewed`, payload).then((x) => x.data);

            return result;
        } catch (error) {
            return { error };
        }
    },
    // #endregion

    // #region "Upvotes, Downvotes"
    addUpvoteSerieReview: async (
        userId: number | undefined,
        serieId: number | undefined,
        serieReviewId: number,
    ): Promise<any> => {
        const payload = {
            userId,
            serieId,
            serieReviewId,
        };

        try {
            const response: any = await axios.post(`${api.url}/addUpvoteSerieReview`, payload).then((x) => x.data);

            return response;
        } catch (error) {
            return { error };
        }
    },
    addDownvoteSerieReview: async (
        userId: number | undefined,
        serieId: number | undefined,
        serieReviewId: number,
    ): Promise<any> => {
        const payload = {
            userId,
            serieId,
            serieReviewId,
        };

        try {
            const response: any = await axios.post(`${api.url}/addDownvoteSerieReview`, payload).then((x) => x.data);

            return response;
        } catch (error) {
            return { error };
        }
    },
    removeUpvoteSerieReview: async (
        userId: number | undefined,
        serieId: number | undefined,
        serieReviewId: number,
    ): Promise<any> => {
        const payload = {
            userId,
            serieId,
            serieReviewId,
        };

        try {
            const response: any = await axios.post(`${api.url}/removeUpvoteSerieReview`, payload).then((x) => x.data);

            return response;
        } catch (error) {
            return { error };
        }
    },
    removeDownvoteSerieReview: async (
        userId: number | undefined,
        serieId: number | undefined,
        serieReviewId: number,
    ): Promise<any> => {
        const payload = {
            userId,
            serieId,
            serieReviewId,
        };

        try {
            const response: any = await axios.post(`${api.url}/removeDownvoteSerieReview`, payload).then((x) => x.data);

            return response;
        } catch (error) {
            return { error };
        }
    },
    isSerieReviewUpvotedOrDownvoted: async (
        userId: number | undefined,
        serieId: number | undefined,
        serieReviewId: number,
    ): Promise<any> => {
        const payload = {
            userId,
            serieId,
            serieReviewId,
        };

        try {
            const response: any = await axios
                .post(`${api.url}/isSerieReviewUpvotedOrDownvoted`, payload)
                .then((x) => x.data);

            return response;
        } catch (error) {
            return { error };
        }
    },
    // #endregion
};

export default serieService;
