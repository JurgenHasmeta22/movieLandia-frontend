import axios from "axios";
import type IMoviesResponse from "~/types/IMoviesResponse";
import ISerie from "~/types/ISerie";
import ISeriePatch from "~/types/ISeriePatch";

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
    getSerieByName: async ({
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
        let url = `${api.url}/getSerieByTitle/${title}`;

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
    deleteSerie: async (id: number): Promise<any> => {
        let url = `${api.url}/deleteSerieById/${id}`;
        const serie: ISerie = await axios.delete(url).then((res) => res.data);
        return serie;
    },
};

export default serieService;
