import { useNavigate } from "react-router-dom";
import authenticationService from "~/services/api/authenticationService";
import { useStore } from "~/store/store";
import type IResponseLogin from "~/types/IResponseLogin";
import { Box, Paper } from "@mui/material";
import * as yup from "yup";
import { toast } from "react-toastify";
import * as CONSTANTS from "~/constants/Constants";
import { useState } from "react";
import SEOHelmet from "~/components/seoHelmet/SEOHelmet";
import { useLocalStorage } from "~/hooks/useLocalStorage";
import LoginForm from "./components/LoginForm";

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
    const { setUser } = useStore();
    const navigate = useNavigate();
    const { setItem } = useLocalStorage("token");

    const handleClickShowPassword = () => setShowPassword(!showPassword);
    const handleMouseDownPassword = () => setShowPassword(!showPassword);

    async function onSubmitLogin(values: any) {
        const response: IResponseLogin = await authenticationService.onLogin(values.email, values.password);

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
                title="Login to MovieLand24"
                description="Login to MovieLand24 to access your account and enjoy exclusive features."
                name="MovieLand24"
                type="website"
                canonicalUrl="https://example.com/login"
            />
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
                        filter: "blur(2px) opacity(0.7)",
                        zIndex: -1,
                    }}
                />
                <Paper
                    sx={{
                        px: 8,
                        py: 6,
                        borderRadius: 4,
                        position: "relative",
                        zIndex: 1,
                    }}
                >
                    <LoginForm
                        validationSchema={loginSchema}
                        onSubmitLogin={onSubmitLogin}
                        handleClickShowPassword={handleClickShowPassword}
                        handleMouseDownPassword={handleMouseDownPassword}
                        showPassword={showPassword}
                    />
                </Paper>
            </Box>
        </>
    );
}
