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
import SEOHelmet from "~/components/seoHelmet/SEOHelmet";
import { motion } from "framer-motion";

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

        if (response && !response.error) {
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
        <>
            <SEOHelmet
                title="Login to MovieLand24"
                description="Login to MovieLand24 to access your account and enjoy exclusive features."
                name="MovieLand24"
                type="website"
                canonicalUrl="https://example.com/login"
            />
            <main>
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 10 }}
                    transition={{ duration: 2 }}
                >
                    <Box
                        sx={{
                            backgroundImage: "url('/src/assets/images/netflix.png')",
                            display: "flex",
                            placeContent: "center",
                            placeItems: "center",
                            padding: 5,
                        }}
                        component={"main"}
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
                                                <Typography variant="h2">Sign In</Typography>
                                                <Box
                                                    display={"flex"}
                                                    flexDirection={"column"}
                                                    rowGap={1}
                                                >
                                                    <FormLabel>Email</FormLabel>
                                                    <TextField
                                                        type="text"
                                                        // placeholder="example@email.com"
                                                        name="email"
                                                        required
                                                        value={values.email}
                                                        onChange={handleChange}
                                                        autoComplete="username"
                                                        aria-autocomplete="both"
                                                        onBlur={handleBlur}
                                                        size="small"
                                                        InputProps={{ color: "secondary" }}
                                                        InputLabelProps={{ color: "secondary" }}
                                                        // @ts-ignore
                                                        helperText={
                                                            touched["email"] && errors["email"]
                                                        }
                                                        error={
                                                            touched["email"] && !!errors["email"]
                                                        }
                                                    />
                                                </Box>
                                                <Box
                                                    display={"flex"}
                                                    flexDirection={"column"}
                                                    rowGap={1}
                                                >
                                                    <FormLabel>Password</FormLabel>
                                                    <TextField
                                                        type={showPassword ? "text" : "password"}
                                                        name="password"
                                                        // placeholder="Example1#"
                                                        required
                                                        autoComplete="current-password"
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
                                                            touched["password"] &&
                                                            errors["password"]
                                                        }
                                                        error={
                                                            touched["password"] &&
                                                            !!errors["password"]
                                                        }
                                                    />
                                                </Box>
                                                <Button
                                                    type="submit"
                                                    color="secondary"
                                                    variant="outlined"
                                                    sx={{
                                                        fontWeight: 600,
                                                    }}
                                                >
                                                    <LockOutlinedIcon />
                                                    <span
                                                        style={{
                                                            fontSize: 14,
                                                            paddingLeft: 4,
                                                            textTransform: "capitalize",
                                                        }}
                                                    >
                                                        Login
                                                    </span>
                                                </Button>
                                                <Box>
                                                    <span
                                                        style={{
                                                            fontSize: 12,
                                                            paddingLeft: 4,
                                                            textTransform: "capitalize",
                                                        }}
                                                    >
                                                        Don't have an account ?
                                                    </span>
                                                    <Link
                                                        style={{
                                                            textDecoration: "none",
                                                            paddingLeft: 4,
                                                            textTransform: "capitalize",
                                                        }}
                                                        to={"/register"}
                                                    >
                                                        Login
                                                    </Link>
                                                </Box>
                                            </Box>
                                        </Form>
                                    );
                                }}
                            </Formik>
                        </Paper>
                    </Box>
                </motion.div>
            </main>
        </>
    );
}
