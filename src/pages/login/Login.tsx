import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import authenticationService from "~/services/authenticationService";
import { useStore } from "~/store/zustand/store";
import type IResponseLogin from "~/types/IResponseLogin";
import { Box, Button, Paper, TextField, Typography } from "@mui/material";
import { Form, Formik } from "formik";

// const loginSchema = yup.object().shape({
//     userName: yup.string().required("required"),
//     password: yup.string().required("required"),
// });

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
                                    <Typography variant="h1">Sign In</Typography>
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
                                        label="Password"
                                        placeholder="Enter your password"
                                        required
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
                                        Sign In
                                    </Button>
                                    <Box>
                                        <Typography variant="overline">
                                            Don't have an account?{" "}
                                        </Typography>
                                        <Link style={{ textDecoration: "none" }} to={"/register"}>
                                            Sign Up
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
