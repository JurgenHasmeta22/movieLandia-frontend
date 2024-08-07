import axios from "axios";
import type ILogin from "~/types/ILogin";
import type IRegister from "~/types/IRegister";
import type IResponseLogin from "~/types/IResponseLogin";
import type IUser from "~/types/IUser";

const api = {
    url: import.meta.env.VITE_API_URL,
};

const authenticationService = {
    onLogin: async (email: string, password: string): Promise<any> => {
        const payload: ILogin = {
            email,
            password,
        };

        try {
            const responseLogin: IResponseLogin = await axios.post(`${api.url}/loginUser`, payload).then((x) => x.data);
            return responseLogin;
        } catch (error) {
            return { error };
        }
    },

    onRegister: async (username: string, email: string, password: string): Promise<any> => {
        const payload: IRegister = {
            userName: username,
            email,
            password,
        };

        try {
            const responseLogin: IResponseLogin = await axios
                .post(`${api.url}/registerUser`, payload)
                .then((x) => x.data);

            return responseLogin;
        } catch (error) {
            return { error };
        }
    },

    validateUser: async () => {
        if (localStorage.token) {
            localStorage.token = localStorage.token.trim().replace(/^"|"$/g, ""); // Trim and remove surrounding quotes

            const config = {
                headers: {
                    Authorization: `Bearer ${localStorage.token}`,
                },
            };

            try {
                const response: IUser = await axios.get(`${api.url}/validateUser`, config).then((x) => x.data);
                return response;
            } catch (error) {
                return { error };
            }
        }
    },
};

export default authenticationService;
