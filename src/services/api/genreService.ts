import axios from "axios";
import IGenre from "~/types/IGenre";
import IGenrePatch from "~/types/IGenrePatch";
import IGenrePost from "~/types/IGenrePost";
import type IMovie from "~/types/IMovie";
import type IMoviesResponse from "~/types/IMoviesResponse";
import type IUser from "~/types/IUser";

const api = {
    url: import.meta.env.VITE_API_URL,
};

const genreService = {
    getGenres: async ({
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
        let url = `${api.url}/getGenres`;

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
    getGenreByName: async (
        name: string,
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
        let url = `${api.url}/getGenreByName/${name}`;

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
    getGenreById: async (id: any): Promise<any> => {
        let url = `${api.url}/getGenreById/${id}`;
        const genre: IGenre = await axios.get(url).then((res) => res.data);
        return genre;
    },
    updateGenre: async (payload: IGenrePatch, id: number): Promise<any> => {
        let url = `${api.url}/updateGenreById/${id}`;
        const genre: IGenre = await axios.patch(url, payload).then((res) => res.data);
        return genre;
    },
    addGenre: async (payload: IGenrePost): Promise<any> => {
        let url = `${api.url}/addGenre`;
        const genre: IGenre = await axios.post(url, payload).then((res) => res.data);
        return genre;
    },
    deleteGenre: async (id: number): Promise<any> => {
        let url = `${api.url}/deleteGenreById/${id}`;
        const genre: IGenre = await axios.delete(url).then((res) => res.data);
        return genre;
    },
};

export default genreService;
