import axios from "axios";
import IGenre from "~/types/IGenre";
import IGenrePatch from "~/types/IGenrePatch";
import IGenrePost from "~/types/IGenrePost";
import type IMoviesResponse from "~/types/IMoviesResponse";

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

        try {
            const moviesResponse: IMoviesResponse = await axios.get(url).then((res) => res.data);
            return moviesResponse;
        } catch (error) {
            // console.log(error);
            return { error };
        }
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

        try {
            const moviesResponse: IMoviesResponse = await axios.get(url).then((res) => res.data);
            return moviesResponse;
        } catch (error) {
            // console.log(error);
            return { error };
        }
    },
    getGenreById: async (id: any): Promise<any> => {
        let url = `${api.url}/getGenreById/${id}`;

        try {
            const genre: IGenre = await axios.get(url).then((res) => res.data);
            return genre;
        } catch (error) {
            // console.log(error);
            return { error };
        }
    },
    updateGenre: async (payload: IGenrePatch, id: number): Promise<any> => {
        let url = `${api.url}/updateGenreById/${id}`;

        try {
            const genre: IGenre = await axios.patch(url, payload).then((res) => res.data);
            return genre;
        } catch (error) {
            // console.log(error);
            return { error };
        }
    },
    addGenre: async (payload: IGenrePost): Promise<any> => {
        let url = `${api.url}/addGenre`;

        try {
            const genre: IGenre = await axios.post(url, payload).then((res) => res.data);
            return genre;
        } catch (error) {
            // console.log(error);
            return { error };
        }
    },
    deleteGenre: async (id: number): Promise<any> => {
        let url = `${api.url}/deleteGenreById/${id}`;

        try {
            const genre: IGenre = await axios.delete(url).then((res) => res.data);
            return genre;
        } catch (error) {
            // console.log(error);
            return { error };
        }
    },
};

export default genreService;
