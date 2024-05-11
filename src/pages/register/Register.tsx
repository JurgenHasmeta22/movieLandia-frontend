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
import { toast } from "react-toastify";
import * as CONSTANTS from "~/constants/Constants";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import * as yup from "yup";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { useState } from "react";

const registerSchema = yup.object().shape({
    username: yup
        .string()
        .required("Username is a required field")
        .min(3, "Username must be at least 3 characters")
        .max(20, "Username can't be longer than 20 characters")
        .matches(/^[a-zA-Z0-9_]+$/, "Username can only contain letters, numbers, and underscores"),
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

export default function Register() {
    const [showPassword, setShowPassword] = useState(false);
    const { user, setUser } = useStore();
    const navigate = useNavigate();

    const handleClickShowPassword = () => setShowPassword(!showPassword);
    const handleMouseDownPassword = () => setShowPassword(!showPassword);

    async function onSubmitRegister(values: any) {
        const response: IResponseLogin = await authenticationService.onRegister(
            values.username,
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
                padding: 5,
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
                        username: "",
                        email: "",
                        password: "",
                    }}
                    validationSchema={registerSchema}
                    onSubmit={(values: any) => {
                        onSubmitRegister(values);
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
                                    <Typography variant="h2">Sign Up</Typography>
                                    <Box display={"flex"} flexDirection={"column"} rowGap={1}>
                                        <FormLabel>Username</FormLabel>
                                        <TextField
                                            type="text"
                                            name="username"
                                            required
                                            placeholder="Example22"
                                            value={values.username}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            size="small"
                                            InputProps={{ color: "secondary" }}
                                            InputLabelProps={{ color: "secondary" }}
                                        />
                                        {errors.username && touched.username && (
                                            // @ts-ignore //
                                            <Typography>{errors.username}</Typography>
                                        )}
                                    </Box>
                                    <Box display={"flex"} flexDirection={"column"} rowGap={1}>
                                        <FormLabel>Email</FormLabel>
                                        <TextField
                                            type="text"
                                            name="email"
                                            required
                                            placeholder="example@email.com"
                                            value={values.email}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            size="small"
                                            InputProps={{ color: "secondary" }}
                                            InputLabelProps={{ color: "secondary" }}
                                        />
                                        {errors.email && touched.email && (
                                            // @ts-ignore //
                                            <Typography height={"1rem"}>{errors.email}</Typography>
                                        )}
                                    </Box>
                                    <Box display={"flex"} flexDirection={"column"} rowGap={1}>
                                        <FormLabel>Password</FormLabel>
                                        <TextField
                                            type={showPassword ? "text" : "password"}
                                            name="password"
                                            required
                                            placeholder="Example1#"
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
                                            Already have an account ?
                                        </Typography>
                                        <Link
                                            style={{ textDecoration: "none", paddingLeft: 4 }}
                                            to={"/login"}
                                        >
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
