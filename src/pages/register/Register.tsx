import { useNavigate } from "react-router-dom";
import authenticationService from "~/services/api/authenticationService";
import { useStore } from "~/store/store";
import type IResponseLogin from "~/types/IResponseLogin";
import { Box, Paper } from "@mui/material";
import { toast } from "react-toastify";
import * as CONSTANTS from "~/constants/Constants";
import * as yup from "yup";
import { useState } from "react";
import SEOHelmet from "~/components/seoHelmet/SEOHelmet";
import { useLocalStorage } from "~/hooks/useLocalStorage";
import RegisterForm from "./components/RegisterForm";

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
    const { setUser } = useStore();
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
            navigate(-1);
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
                    }}
                >
                    <RegisterForm
                        validationSchema={registerSchema}
                        showPassword={showPassword}
                        showPasswordConfirm={showPasswordConfirm}
                        onSubmitRegister={onSubmitRegister}
                        handleClickShowPassword={handleClickShowPassword}
                        handleMouseDownPassword={handleMouseDownPassword}
                        handleMouseDownPasswordConfirm={handleMouseDownPasswordConfirm}
                        handleClickShowPasswordConfirm={handleClickShowPasswordConfirm}
                    />
                </Paper>
            </Box>
        </>
    );
}
