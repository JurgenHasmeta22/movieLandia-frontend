import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import authenticationService from "~/services/authenticationService";
import { useStore } from "~/store/zustand/store";
import type IResponseLogin from "~/interfaces/IResponseLogin";
import { Box, Button, TextField, Typography } from "@mui/material";

export default function Login() {
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");

    const { user, setUser } = useStore();

    const navigate = useNavigate();

    async function onSubmit() {
        const response: IResponseLogin = await authenticationService.onLogin(email, password);
        localStorage.setItem("token", response.token);
        setUser(response.user);
    }

    if (user) {
        navigate("/movies");
    }

    return (
        <Box>
            <Box>
                <img id="login-page-img" src="/assets/images/netflix.png" alt="" />
            </Box>
            <Box>
                <form
                    id="login-form"
                    onSubmit={function (e) {
                        e.preventDefault();
                        onSubmit();
                    }}
                >
                    <h1>MovieLandia22</h1>
                    <label>
                        <TextField
                            type="text"
                            name="email"
                            placeholder="Enter your email"
                            required
                            onChange={function (e) {
                                setEmail(e.target.value);
                            }}
                        />
                    </label>
                    <label>
                        <TextField
                            type="password"
                            name="password"
                            placeholder="Enter your password"
                            required
                            onChange={function (e) {
                                setPassword(e.target.value);
                            }}
                        />
                    </label>
                    <Typography>
                        <Button>Log In</Button>
                    </Typography>
                    <label htmlFor="">
                        Don't have an account?
                        <Link id="link" to={"/register"}>
                            Sign Up
                        </Link>
                    </label>
                </form>
            </Box>
        </Box>
    );
}
