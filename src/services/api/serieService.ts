import axios from "axios";
import type IMoviesResponse from "~/types/IMoviesResponse";
import ISerie from "~/types/ISerie";
import ISeriePatch from "~/types/ISeriePatch";
import ISeriePost from "~/types/ISeriePost";
import IUser from "~/types/IUser";

const api = {
    url: import.meta.env.VITE_API_URL,
};

const serieService = {
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
        }: {
            sortBy?: string;
            ascOrDesc?: string;
            page?: string;
            pageSize?: string;
            title?: string;
            filterValue?: string;
            filterName?: string;
            filterOperator?: string;
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
            // console.log(error);
            return { error };
        }
    },
    getSerieById: async (id: any): Promise<any> => {
        let url = `${api.url}/getSerieById/${id}`;

        try {
            const serie: ISerie = await axios.get(url).then((res) => res.data);
            return serie;
        } catch (error) {
            // console.log(error);
            return { error };
        }
    },
    searchSeriesByTitle: async (title: string, page?: string): Promise<any> => {
        let url = `${api.url}/searchSeriesByTitle?title=${title}`;

        if (page) {
            url += `&page=${page}`;
        }

        try {
            const response: IMoviesResponse = await axios.get(url).then((res) => res.data);
            return response;
        } catch (error) {
            // console.log(error);
            return { error };
        }
    },
    updateSerie: async (payload: ISeriePatch, id: number): Promise<any> => {
        let url = `${api.url}/updateSerieById/${id}`;

        try {
            const serie: ISerie = await axios.patch(url, payload).then((res) => res.data);
            return serie;
        } catch (error) {
            // console.log(error);
            return { error };
        }
    },
    addSerie: async (payload: ISeriePost): Promise<any> => {
        let url = `${api.url}/addSerie`;

        try {
            const serie: ISerie = await axios.post(url, payload).then((res) => res.data);
            return serie;
        } catch (error) {
            // console.log(error);
            return { error };
        }
    },
    deleteSerie: async (id: number): Promise<any> => {
        let url = `${api.url}/deleteSerieById/${id}`;

        try {
            const serie: ISerie = await axios.delete(url).then((res) => res.data);
            return serie;
        } catch (error) {
            // console.log(error);
            return { error };
        }
    },
    addToFavorites: async (
        serieId: number | undefined,
        userId: number | undefined,
    ): Promise<any> => {
        const payload = {
            serieId,
            userId,
        };

        try {
            const user: IUser = await axios
                .post(`${api.url}/bookmarkSerie`, payload)
                .then((x) => x.data);
            return user;
        } catch (error) {
            // console.log(error);
            return { error };
        }
    },
    removeFromFavorites: async (
        serieId: number | undefined,
        userId: number | undefined,
    ): Promise<any> => {
        const payload = {
            serieId,
            userId,
        };

        try {
            const user: IUser = await axios
                .post(`${api.url}/unBookmarkSerie`, payload)
                .then((x) => x.data);

            return user;
        } catch (error) {
            // console.log(error);
            return { error };
        }
    },
    isSerieBookmared: async (
        serieTitle: string | undefined,
        userId: number | undefined,
    ): Promise<any> => {
        const payload = {
            serieTitle,
            userId,
        };

        try {
            const result: boolean = await axios
                .post(`${api.url}/isSerieBookmarked`, payload)
                .then((x) => x.data);

            return result;
        } catch (error) {
            // console.log(error);
            return { error };
        }
    },
    addReview: async (
        movieId: number | undefined,
        serieId: number | undefined,
        review: string,
    ): Promise<any> => {
        const payload = {
            movieId,
            serieId,
            content: review,
        };

        try {
            const user: IUser = await axios
                .post(`${api.url}/addReviewSerie`, payload)
                .then((x) => x.data);

            return user;
        } catch (error) {
            return { error };
        }
    },
};

export default serieService;
