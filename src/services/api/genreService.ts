import axios from "axios";
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
};

export default genreService;
