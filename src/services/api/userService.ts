import axios from "axios";
import IUser from "~/types/IUser";

const api = {
    url: import.meta.env.VITE_API_URL,
};

const movieService = {
    getUser: async (title: string | undefined): Promise<any> => {
        const user: IUser = await axios.get(`${api.url}/user/${title}`).then((x) => x.data);
        return user;
    },
    getUsers: async (): Promise<any> => {
        const response: any = await axios.get(`${api.url}/users`).then((x) => x.data);

        return response.rows;
    },
};

export default movieService;
