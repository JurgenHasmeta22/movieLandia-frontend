import { Link, useNavigate } from "react-router-dom";
import authenticationService from "~/services/api/authenticationService";
import { useStore } from "~/store/store";
import type IResponseLogin from "~/types/IResponseLogin";
import {
    Box,
    Button,
    FormLabel,
    IconButton,
    InputAdornment,
    Paper,
    TextField,
    Typography,
} from "@mui/material";
import { Form, Formik } from "formik";
import * as yup from "yup";
import { toast } from "react-toastify";
import * as CONSTANTS from "~/constants/Constants";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { useState } from "react";

const loginSchema = yup.object().shape({
    email: yup.string().required("Email is a required field").email("Invalid email format"),
    password: yup
        .string()
        .required("Password is a required field")
        .min(8, "Password must be at least 8 characters")
        .matches(
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
            "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character",
        ),
});

export default function Login() {
    const [showPassword, setShowPassword] = useState(false);
    const { user, setUser } = useStore();
    const navigate = useNavigate();

    const handleClickShowPassword = () => setShowPassword(!showPassword);
    const handleMouseDownPassword = () => setShowPassword(!showPassword);

    async function onSubmitLogin(values: any) {
        const response: IResponseLogin = await authenticationService.onLogin(
            values.email,
            values.password,
        );

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
                padding: 5, // fixes layout no need for fixed height
            }}
        >
            <Paper
                sx={{
                    backgroundColor: "rgb(0 0 0 / 85%)",
                    px: 14,
                    py: 6,
                }}
            >
                <Formik
                    initialValues={{
                        email: "",
                        password: "",
                    }}
                    validationSchema={loginSchema}
                    onSubmit={(values: any) => {
                        onSubmitLogin(values);
                    }}
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
                                            placeholder="example@email.com"
                                            name="email"
                                            required
                                            value={values.email}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            size="small"
                                            InputProps={{ color: "secondary" }}
                                            InputLabelProps={{ color: "secondary" }}
                                        />
                                        {errors.email && touched.email && (
                                            // @ts-ignore //
                                            <Typography>{errors.email}</Typography>
                                        )}
                                    </Box>
                                    <Box display={"flex"} flexDirection={"column"} rowGap={1}>
                                        <FormLabel>Password</FormLabel>
                                        <TextField
                                            type={showPassword ? "text" : "password"}
                                            name="password"
                                            placeholder="Example1#"
                                            required
                                            value={values.password}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            InputProps={{
                                                color: "secondary",
                                                endAdornment: (
                                                    <InputAdornment position="end">
                                                        <IconButton
                                                            aria-label="toggle password visibility"
                                                            onClick={handleClickShowPassword}
                                                            onMouseDown={handleMouseDownPassword}
                                                        >
                                                            {showPassword ? (
                                                                <Visibility color="secondary" />
                                                            ) : (
                                                                <VisibilityOff color="secondary" />
                                                            )}
                                                        </IconButton>
                                                    </InputAdornment>
                                                ),
                                            }}
                                            size="small"
                                            InputLabelProps={{ color: "secondary" }}
                                        />
                                        {errors.password && touched.password && (
                                            <Typography height={"5rem"} width={"30ch"}>
                                                {/* @ts-ignore */}
                                                {errors.password}
                                            </Typography>
                                        )}
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
