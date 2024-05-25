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

        const response: IMoviesResponse = await axios.get(url).then((res) => res.data);
        return response;
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

        const serie: ISerie = await axios.get(url).then((res) => res.data);
        return serie;
    },
    getSerieById: async (id: any): Promise<any> => {
        let url = `${api.url}/getSerieById/${id}`;
        const serie: ISerie = await axios.get(url).then((res) => res.data);
        return serie;
    },
    searchSeriesByTitle: async (title: string, page?: string): Promise<any> => {
        let url = `${api.url}/searchSeriesByTitle?title=${title}`;

        if (page) {
            url += `&page=${page}`;
        }

        const response: IMoviesResponse = await axios.get(url).then((res) => res.data);
        return response;
    },
    updateSerie: async (payload: ISeriePatch, id: number): Promise<any> => {
        let url = `${api.url}/updateSerieById/${id}`;
        const serie: ISerie = await axios.patch(url, payload).then((res) => res.data);
        return serie;
    },
    addSerie: async (payload: ISeriePost): Promise<any> => {
        let url = `${api.url}/addSerie`;
        const serie: ISerie = await axios.post(url, payload).then((res) => res.data);
        return serie;
    },
    deleteSerie: async (id: number): Promise<any> => {
        let url = `${api.url}/deleteSerieById/${id}`;
        const serie: ISerie = await axios.delete(url).then((res) => res.data);
        return serie;
    },
    addToFavorites: async (
        serieId: number | undefined,
        userId: number | undefined,
    ): Promise<any> => {
        if (localStorage.token) {
            const config = {
                headers: {
                    Authorization: localStorage.token,
                },
            };

            const payload = {
                serieId,
                userId,
            };

            const user: IUser = await axios
                .post(`${api.url}/bookmarkSerie`, payload, config)
                .then((x) => x.data);

            return user;
        }
    },
};

export default serieService;
