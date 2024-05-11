import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import authenticationService from "~/services/api/authenticationService";
import { useStore } from "~/store/store";
import type IResponseLogin from "~/types/IResponseLogin";
import { Box, Button, FormLabel, Paper, TextField, Typography } from "@mui/material";
import { Form, Formik } from "formik";
import * as yup from "yup";
import { toast } from "react-toastify";
import * as CONSTANTS from "~/constants/Constants";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";

const loginSchema = yup.object().shape({
    email: yup.string().required("required"),
    password: yup.string().required("required"),
});

export default function Login() {
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const { user, setUser } = useStore();
    const navigate = useNavigate();

    async function onSubmit() {
        const response: IResponseLogin = await authenticationService.onLogin(email, password);

        if (response) {
            localStorage.setItem("token", response.token);
            setUser(response.user);
            toast.success(CONSTANTS.LOGIN__SUCCESS);
            navigate("/movies");
        } else {
            toast.error(CONSTANTS.LOGIN__FAILURE);
        }
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
                    padding: 8,
                }}
            >
                <Formik
                    // innerRef={formRef}
                    initialValues={{
                        email: "",
                        password: "",
                    }}
                    validationSchema={loginSchema}
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
                                    <Typography variant="h2">Sign In</Typography>
                                    <Box display={"flex"} flexDirection={"column"} rowGap={1}>
                                        <FormLabel>Email</FormLabel>
                                        <TextField
                                            type="text"
                                            placeholder="Enter your email"
                                            name="email"
                                            // label="Email"
                                            required
                                            onChange={function (e) {
                                                setEmail(e.target.value);
                                            }}
                                            size="small"
                                            InputProps={{ color: "secondary" }}
                                            InputLabelProps={{ color: "secondary" }}
                                        />
                                    </Box>
                                    <Box display={"flex"} flexDirection={"column"} rowGap={1}>
                                        <FormLabel>Password</FormLabel>
                                        <TextField
                                            type="password"
                                            // label="Password"
                                            name="password"
                                            placeholder="Enter your password"
                                            required
                                            onChange={function (e) {
                                                setPassword(e.target.value);
                                            }}
                                            InputProps={{ color: "secondary" }}
                                            size="small"
                                            InputLabelProps={{ color: "secondary" }}
                                        />
                                    </Box>
                                    <Button
                                        type="submit"
                                        color="secondary"
                                        variant="outlined"
                                        size="medium"
                                    >
                                        <LockOutlinedIcon />
                                        <span style={{ paddingLeft: 4 }}>Sign In</span>
                                    </Button>
                                    <Box>
                                        <Typography variant="overline">
                                            Don't have an account ?
                                        </Typography>
                                        <Link
                                            style={{ textDecoration: "none", paddingLeft: 4 }}
                                            to={"/register"}
                                        >
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
