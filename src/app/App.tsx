import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useEffect } from "react";
import { useStore } from "~/store/store";
import type IUser from "~/types/IUser";
import authenticationService from "~/services/api/authenticationService";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { ColorModeContext, useMode } from "~/utils/theme";
import PrivateRoutes from "~/utils/PrivateRoutes";
import MainLayout from "~/layouts/MainLayout";
import AdminLayout from "~/layouts/AdminLayout";

// main pages
const Home = React.lazy(() => import("~/pages/home/Home"));
const Error404 = React.lazy(() => import("~/pages/error/Error"));
const Series = React.lazy(() => import("~/pages/series/Series"));
const Genres = React.lazy(() => import("~/pages/genres/Genres"));
const Genre = React.lazy(() => import("~/pages/genre/Genre"));
const Movies = React.lazy(() => import("~/pages/movies/Movies"));
const Login = React.lazy(() => import("~/pages/login/Login"));
const Movie = React.lazy(() => import("~/pages/movie/Movie"));
const Profile = React.lazy(() => import("~/pages/profile/Profile"));
const Register = React.lazy(() => import("~/pages/register/Register"));

// admin pages
const Dashboard = React.lazy(() => import("~/pages/admin/dashboard/Dashboard"));
const MoviesAdmin = React.lazy(() => import("~/pages/admin/movies/MoviesAdmin"));
const UsersAdmin = React.lazy(() => import("~/pages/admin/users/UsersAdmin"));
const SeriesAdmin = React.lazy(() => import("~/pages/admin/series/SeriesAdmin"));
const GenresAdmin = React.lazy(() => import("~/pages/admin/genres/GenresAdmin"));
const AddUserAdmin = React.lazy(() => import("~/pages/admin/addUser/AddUser"));
const AddGenreAdmin = React.lazy(() => import("~/pages/admin/addGenre/AddGenre"));
const AddSerieAdmin = React.lazy(() => import("~/pages/admin/addSerie/AddSerie"));
const AddMovieAdmin = React.lazy(() => import("~/pages/admin/addMovie/AddMovie"));
const UserAdmin = React.lazy(() => import("~/pages/admin/user/UserAdmin"));
const MovieAdmin = React.lazy(() => import("~/pages/admin/movie/MovieAdmin"));
const SerieAdmin = React.lazy(() => import("~/pages/admin/serie/SerieAdmin"));
const GenreAdmin = React.lazy(() => import("~/pages/admin/genre/GenreAdmin"));

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
                    <Route index element={<Navigate replace to="" />} />
                    <Route element={<MainLayout />}>
                        <Route path="*" element={<Error404 />} />
                        <Route path="" element={<Home />} />
                        <Route path="movies" element={<Movies />} />
                        <Route path="movies/:title" element={<Movie />} />
                        <Route path="genres/:name" element={<Genre />} />
                        <Route path="series" element={<Series />} />
                        <Route path="genres" element={<Genres />} />
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
