import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useEffect } from "react";
import { useStore } from "~/store/store";
import type IUser from "~/types/IUser";
import authenticationService from "~/services/api/authenticationService";
import PrivateRoutes from "~/utils/PrivateRoutes";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { ColorModeContext, useMode } from "~/utils/theme";
import MainLayout from "~/layouts/MainLayout";
import AdminLayout from "~/layouts/AdminLayout";

// main pages
const Series = React.lazy(async () => await import("~/pages/series/Series"));
const Error404 = React.lazy(async () => await import("~/pages/error/Error"));
const Genre = React.lazy(async () => await import("~/pages/genre/Genre"));
const Home = React.lazy(async () => await import("~/pages/home/Home"));
const Login = React.lazy(async () => await import("~/pages/login/Login"));
const Movie = React.lazy(async () => await import("~/pages/movie/Movie"));
const Profile = React.lazy(async () => await import("~/pages/profile/Profile"));
const Register = React.lazy(async () => await import("~/pages/register/Register"));

// admin pages
const Dashboard = React.lazy(async () => await import("~/pages/admin/dashboard/Dashboard"));
const MoviesAdmin = React.lazy(async () => await import("~/pages/admin/movies/MoviesAdmin"));
const UsersAdmin = React.lazy(async () => await import("~/pages/admin/users/UsersAdmin"));
const SeriesAdmin = React.lazy(async () => await import("~/pages/admin/series/SeriesAdmin"));
const GenresAdmin = React.lazy(async () => await import("~/pages/admin/genres/GenresAdmin"));
const AddUserAdmin = React.lazy(async () => await import("~/pages/admin/addUser/AddUser"));
const AddGenreAdmin = React.lazy(async () => await import("~/pages/admin/addGenre/AddGenre"));
const AddSerieAdmin = React.lazy(async () => await import("~/pages/admin/addSerie/AddSerie"));
const AddMovieAdmin = React.lazy(async () => await import("~/pages/admin/addMovie/AddMovie"));
const UserAdmin = React.lazy(async () => await import("~/pages/admin/user/UserAdmin"));
const MovieAdmin = React.lazy(async () => await import("~/pages/admin/movie/MovieAdmin"));
const SerieAdmin = React.lazy(async () => await import("~/pages/admin/serie/SerieAdmin"));
const GenreAdmin = React.lazy(async () => await import("~/pages/admin/genre/GenreAdmin"));

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
                <CssBaseline />
                <Routes>
                    <Route index element={<Navigate replace to="movies" />} />
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
                        <Route element={<AdminLayout />}>
                            <Route path="admin" element={<Dashboard />} />
                            <Route path="admin/dashboard" element={<Dashboard />} />
                            <Route path="admin/users" element={<UsersAdmin />} />
                            <Route path="admin/users/add" element={<AddUserAdmin />} />
                            <Route path="admin/users/:id" element={<UserAdmin />} />
                            <Route path="admin/movies" element={<MoviesAdmin />} />
                            <Route path="admin/movies/add" element={<AddMovieAdmin />} />
                            <Route path="admin/movies/:id" element={<MovieAdmin />} />
                            <Route path="admin/series" element={<SeriesAdmin />} />
                            <Route path="admin/series/add" element={<AddSerieAdmin />} />
                            <Route path="admin/series/:id" element={<SerieAdmin />} />
                            <Route path="admin/genres" element={<GenresAdmin />} />
                            <Route path="admin/genres/add" element={<AddGenreAdmin />} />
                            <Route path="admin/genres/:id" element={<GenreAdmin />} />
                        </Route>
                    </Route>
                </Routes>
            </ThemeProvider>
        </ColorModeContext.Provider>
    );
}

export default App;
