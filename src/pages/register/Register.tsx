import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import authenticationService from "~/services/api/authenticationService";
import { useStore } from "~/store/store";
import type IResponseLogin from "~/types/IResponseLogin";
import { Box, Button, Paper, TextField, Typography } from "@mui/material";
import { Form, Formik } from "formik";

export default function Register() {
    const [username, setUsername] = useState<string>("");
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");

    const { user, setUser } = useStore();
    const navigate = useNavigate();

    async function onSubmit() {
        const response: IResponseLogin = await authenticationService.onRegister(
            username,
            email,
            password,
        );

        localStorage.setItem("token", response.token);
        setUser(response.user);
    }

    if (user) {
        navigate("/movies");
    }

    return (
        <Box
            sx={{
                backgroundImage: "url('/src/assets/images/netflix.png')",
                display: "flex",
                placeContent: "center",
                placeItems: "center",
                padding: 5, //this is amazing fixes layout no need for fixed height
            }}
        >
            <Paper
                sx={{
                    backgroundColor: "rgb(0 0 0 / 85%)",
                    padding: 10,
                }}
            >
                <Formik
                    // innerRef={formRef}
                    initialValues={{
                        username: "",
                        email: "",
                        password: "",
                    }}
                    // validationSchema={validationSchema}
                    onSubmit={onSubmit}
                    enableReinitialize
                >
                    {({ values, errors, touched, handleBlur, handleChange, handleSubmit }) => {
                        return (
                            <Form onSubmit={handleSubmit}>
                                <Box
                                    sx={{
                                        display: "flex",
                                        flexDirection: "column",
                                        rowGap: 2,
                                    }}
                                >
                                    <Typography variant="h1">Sign Up</Typography>
                                    <TextField
                                        type="text"
                                        placeholder="Enter your username"
                                        label="Username"
                                        required
                                        onChange={function (e) {
                                            setUsername(e.target.value);
                                        }}
                                        InputProps={{ color: "secondary" }}
                                        InputLabelProps={{ color: "secondary" }}
                                    />
                                    <TextField
                                        type="text"
                                        placeholder="Enter your email"
                                        label="Email"
                                        required
                                        onChange={function (e) {
                                            setEmail(e.target.value);
                                        }}
                                        InputProps={{ color: "secondary" }}
                                        InputLabelProps={{ color: "secondary" }}
                                    />
                                    <TextField
                                        type="password"
                                        placeholder="Enter your password"
                                        required
                                        label={"Password"}
                                        onChange={function (e) {
                                            setPassword(e.target.value);
                                        }}
                                        InputProps={{ color: "secondary" }}
                                        InputLabelProps={{ color: "secondary" }}
                                    />
                                    <Button
                                        type="submit"
                                        color="secondary"
                                        variant="outlined"
                                        size="large"
                                    >
                                        Sign Up
                                    </Button>
                                    <Box>
                                        <Typography variant="overline">
                                            Don't have an account?{" "}
                                        </Typography>
                                        <Link style={{ textDecoration: "none" }} to={"/login"}>
                                            Sign In
                                        </Link>
                                    </Box>
                                </Box>
                            </Form>
                        );
                    }}
                </Formik>
            </Paper>
        </Box>
    );
}
