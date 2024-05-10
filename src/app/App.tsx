import React from "react";
import { Routes, Route, Navigate, Outlet } from "react-router-dom";
import { useEffect } from "react";
import { useStore } from "~/store/store";
import type IUser from "~/types/IUser";
import authenticationService from "~/services/api/authenticationService";
import PrivateRoutes from "~/utils/PrivateRoutes";
import { ThemeProvider } from "@mui/material";
import { ColorModeContext, useMode } from "~/utils/theme";
import MainLayout from "~/layouts/MainLayout";
import AdminLayout from "~/layouts/AdminLayout";

const Series = React.lazy(async () => await import("~/pages/series/Series"));
const Error404 = React.lazy(async () => await import("~/pages/error/Error"));
const Genre = React.lazy(async () => await import("~/pages/genre/Genre"));
const Home = React.lazy(async () => await import("~/pages/home/Home"));
const Login = React.lazy(async () => await import("~/pages/login/Login"));
const Movie = React.lazy(async () => await import("~/pages/movie/Movie"));
const Profile = React.lazy(async () => await import("~/pages/profile/Profile"));
const Register = React.lazy(async () => await import("~/pages/register/Register"));
const Dashboard = React.lazy(() => import("~/pages/admin/dashboard/Dashboard"));
const MoviesAdmin = React.lazy(() => import("~/pages/admin/movies/MoviesAdmin"));
const UsersAdmin = React.lazy(() => import("~/pages/admin/users/UsersAdmin"));
const SeriesAdmin = React.lazy(() => import("~/pages/admin/series/SeriesAdmin"));
const GenresAdmin = React.lazy(() => import("~/pages/admin/genres/GenresAdmin"));

function App() {
    const { setUser } = useStore();
    const [theme, colorMode] = useMode();

    useEffect(() => {
        const validateUser = async () => {
            const response: IUser | undefined = await authenticationService.validateUser();

            if (response) setUser(response);
        };

        validateUser();
    }, []);

    return (
        <ColorModeContext.Provider value={colorMode}>
            <ThemeProvider theme={theme}>
                <Routes>
                    <Route index element={<Navigate replace to="/movies" />} />
                    <Route element={<MainLayout />}>
                        <Route path="*" element={<Error404 />} />
                        <Route path="movies" element={<Home />} />
                        <Route path="movies/:title" element={<Movie />} />
                        <Route path="genres/:name" element={<Genre />} />
                        <Route path="series" element={<Series />} />
                        <Route path="profile" element={<Profile />} />
                        <Route path="login" element={<Login />} />
                        <Route path="register" element={<Register />} />
                    </Route>
                    <Route element={<PrivateRoutes />}>
                        <Route path="admin" element={<AdminLayout />}>
                            <Route index element={<Navigate replace to="/admin/dashboard" />} />
                            <Route path="dashboard" element={<Dashboard />} />
                            <Route path="users" element={<UsersAdmin />} />
                            <Route path="movies" element={<MoviesAdmin />} />
                            <Route path="series" element={<SeriesAdmin />} />
                            <Route path="genres" element={<GenresAdmin />} />
                        </Route>
                    </Route>
                </Routes>
            </ThemeProvider>
        </ColorModeContext.Provider>
    );
}

export default App;
