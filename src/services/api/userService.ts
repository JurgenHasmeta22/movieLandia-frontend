import axios from "axios";
import IUser from "~/types/IUser";
import IUserPatch from "~/types/IUserPatch";
import IUserResponse from "~/types/IUserResponse";

const api = {
    url: import.meta.env.VITE_API_URL,
};

const userService = {
    getUsers: async ({
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
        let url = `${api.url}/getUsers`;

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

        const response: IUserResponse = await axios.get(url).then((res) => res.data);
        return response;
    },
    getUserByUserName: async (userName: string): Promise<any> => {
        let url = `${api.url}/getUserByUserName/${userName}`;
        const user: IUser = await axios.get(url).then((res) => res.data);
        return user;
    },
    getUserById: async (id: any) => {
        let url = `${api.url}/getUserById/${id}`;
        const user: IUser = await axios.get(url).then((res) => res.data);
        return user;
    },
    updateUser: async (payload: IUserPatch, id: number): Promise<any> => {
        let url = `${api.url}/updateUserById/${id}`;
        const user: IUser = await axios.patch(url, payload).then((res) => res.data);
        return user;
    },
    deleteUser: async (id: number): Promise<any> => {
        let url = `${api.url}/deleteUserById/${id}`;
        const user: IUser = await axios.delete(url).then((res) => res.data);
        return user;
    },
};

export default userService;
