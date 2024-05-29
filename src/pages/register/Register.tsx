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
import SEOHelmet from "~/components/seoHelmet/SEOHelmet";
import { useLocalStorage } from "~/hooks/useLocalStorage";

const registerSchema = yup.object().shape({
    userName: yup
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
    confirmPassword: yup
        .string()
        .required("Please confirm your password")
        .oneOf([yup.ref("password")], "Passwords must match"),
});

export default function Register() {
    const [showPassword, setShowPassword] = useState(false);
    const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);
    const { user, setUser } = useStore();
    const navigate = useNavigate();
    const { setItem } = useLocalStorage("token");

    const handleClickShowPassword = () => setShowPassword(!showPassword);
    const handleMouseDownPassword = () => setShowPassword(!showPassword);
    const handleClickShowPasswordConfirm = () => setShowPasswordConfirm(!showPasswordConfirm);
    const handleMouseDownPasswordConfirm = () => setShowPasswordConfirm(!showPasswordConfirm);

    async function onSubmitRegister(values: any) {
        const response: IResponseLogin = await authenticationService.onRegister(
            values.userName,
            values.email,
            values.password,
        );

        if (response && !response.error) {
            setItem(response.token);
            setUser(response.user);
            toast.success(CONSTANTS.LOGIN__SUCCESS);
            navigate("/movies");
        } else {
            toast.error(CONSTANTS.LOGIN__FAILURE);
        }
    }

    return (
        <>
            <SEOHelmet
                title="Register to MovieLand24"
                description="Register to MovieLand24 to create your account and enjoy exclusive features."
                name="MovieLand24"
                type="website"
                canonicalUrl="https://example.com/register"
            />
            <main>
                <Box
                    sx={{
                        position: "relative",
                        display: "flex",
                        placeContent: "center",
                        placeItems: "center",
                        paddingTop: 10,
                        paddingBottom: 10,
                    }}
                    component={"section"}
                >
                    <Box
                        sx={{
                            position: "absolute",
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            backgroundImage: "url('/assets/images/netflix.png')",
                            backgroundSize: "cover",
                            backgroundPosition: "center",
                            filter: "blur(4px)",
                            zIndex: -1,
                        }}
                    />
                    <Paper
                        sx={{
                            px: 8,
                            py: 6,
                            borderRadius: 4,
                        }}
                    >
                        <Formik
                            initialValues={{
                                userName: "",
                                email: "",
                                password: "",
                                confirmPassword: "",
                            }}
                            validationSchema={registerSchema}
                            onSubmit={(values: any) => {
                                onSubmitRegister(values);
                            }}
                            enableReinitialize
                        >
                            {({
                                values,
                                errors,
                                touched,
                                handleBlur,
                                handleChange,
                                handleSubmit,
                            }) => {
                                return (
                                    <Form onSubmit={handleSubmit}>
                                        <Box
                                            sx={{
                                                display: "flex",
                                                flexDirection: "column",
                                                rowGap: 2,
                                            }}
                                        >
                                            <Typography
                                                variant="h2"
                                                sx={{
                                                    textTransform: "capitalize",
                                                }}
                                            >
                                                Sign Up
                                            </Typography>
                                            <Box
                                                display={"flex"}
                                                flexDirection={"column"}
                                                rowGap={1}
                                            >
                                                <FormLabel component={"label"}>Username</FormLabel>
                                                <TextField
                                                    type="text"
                                                    name="userName"
                                                    required
                                                    value={values.userName}
                                                    autoComplete="username"
                                                    aria-label="Username"
                                                    hiddenLabel={true}
                                                    aria-autocomplete="both"
                                                    onChange={handleChange}
                                                    onBlur={handleBlur}
                                                    size="small"
                                                    InputProps={{ color: "secondary" }}
                                                    InputLabelProps={{ color: "secondary" }}
                                                    // @ts-ignore
                                                    helperText={
                                                        touched["userName"] && errors["userName"]
                                                    }
                                                    error={
                                                        touched["userName"] && !!errors["userName"]
                                                    }
                                                />
                                            </Box>
                                            <Box
                                                display={"flex"}
                                                flexDirection={"column"}
                                                rowGap={1}
                                            >
                                                <FormLabel component={"label"}>Email</FormLabel>
                                                <TextField
                                                    type="text"
                                                    name="email"
                                                    required
                                                    value={values.email}
                                                    autoComplete="username"
                                                    aria-label="Email"
                                                    hiddenLabel={true}
                                                    aria-autocomplete="both"
                                                    onChange={handleChange}
                                                    onBlur={handleBlur}
                                                    size="small"
                                                    InputProps={{ color: "secondary" }}
                                                    InputLabelProps={{ color: "secondary" }}
                                                    // @ts-ignore
                                                    helperText={touched["email"] && errors["email"]}
                                                    error={touched["email"] && !!errors["email"]}
                                                />
                                            </Box>
                                            <Box
                                                display={"flex"}
                                                flexDirection={"column"}
                                                rowGap={1}
                                            >
                                                <FormLabel component={"label"}>Password</FormLabel>
                                                <TextField
                                                    type={showPassword ? "text" : "password"}
                                                    name="password"
                                                    required
                                                    autoComplete="current-password"
                                                    aria-label="Current password"
                                                    hiddenLabel={true}
                                                    aria-autocomplete="both"
                                                    value={values.password}
                                                    onChange={handleChange}
                                                    onBlur={handleBlur}
                                                    InputProps={{
                                                        color: "secondary",
                                                        endAdornment: (
                                                            <InputAdornment position="end">
                                                                <IconButton
                                                                    aria-label="toggle password visibility"
                                                                    onClick={
                                                                        handleClickShowPassword
                                                                    }
                                                                    onMouseDown={
                                                                        handleMouseDownPassword
                                                                    }
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
                                                    // @ts-ignore
                                                    helperText={
                                                        touched["password"] && errors["password"]
                                                    }
                                                    error={
                                                        touched["password"] && !!errors["password"]
                                                    }
                                                />
                                            </Box>
                                            <Box
                                                display={"flex"}
                                                flexDirection={"column"}
                                                rowGap={1}
                                            >
                                                <FormLabel component={"label"}>
                                                    Confirm password
                                                </FormLabel>
                                                <TextField
                                                    type={showPasswordConfirm ? "text" : "password"}
                                                    name="confirmPassword"
                                                    required
                                                    autoComplete="current-password"
                                                    aria-label="Confirm password"
                                                    hiddenLabel={true}
                                                    aria-autocomplete="both"
                                                    value={values.confirmPassword}
                                                    onChange={handleChange}
                                                    onBlur={handleBlur}
                                                    InputProps={{
                                                        color: "secondary",
                                                        endAdornment: (
                                                            <InputAdornment position="end">
                                                                <IconButton
                                                                    aria-label="toggle password visibility"
                                                                    onClick={
                                                                        handleClickShowPasswordConfirm
                                                                    }
                                                                    onMouseDown={
                                                                        handleMouseDownPasswordConfirm
                                                                    }
                                                                >
                                                                    {showPasswordConfirm ? (
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
                                                    // @ts-ignore
                                                    helperText={
                                                        touched["confirmPassword"] &&
                                                        errors["confirmPassword"]
                                                    }
                                                    error={
                                                        touched["confirmPassword"] &&
                                                        !!errors["confirmPassword"]
                                                    }
                                                />
                                            </Box>
                                            <Button
                                                type="submit"
                                                color="secondary"
                                                variant="outlined"
                                                sx={{
                                                    fontWeight: 600,
                                                    py: 1,
                                                }}
                                            >
                                                <LockOutlinedIcon />
                                                <Typography
                                                    component={"span"}
                                                    style={{
                                                        paddingLeft: 4,
                                                        textTransform: "capitalize",
                                                        fontSize: 14,
                                                    }}
                                                >
                                                    Sign Up
                                                </Typography>
                                            </Button>
                                            <Box>
                                                <Typography
                                                    component={"span"}
                                                    style={{
                                                        textTransform: "capitalize",
                                                        fontSize: 12,
                                                    }}
                                                >
                                                    Already have an account ?
                                                </Typography>
                                                <Link
                                                    style={{
                                                        textDecoration: "none",
                                                        paddingLeft: 4,
                                                        textTransform: "capitalize",
                                                    }}
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
            </main>
        </>
    );
}
