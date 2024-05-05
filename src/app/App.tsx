import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useEffect } from "react";
import { useStore } from "~/store/zustand/store";
import type IUser from "~/interfaces/IUser";
import authenticationService from "~/services/authenticationService";
import PrivateRoutes from "~/utils/PrivateRoutes";
import { Grid, CircularProgress, Box, ThemeProvider } from "@mui/material";
import { Header } from "~/components/header/Header";
import { Footer } from "~/components/footer/Footer";
import { ColorModeContext, useMode } from "~/utils/theme";
import ScrollToTop from "~/components/scrollToTop/scrollToTop";

const Series = React.lazy(async () => await import("~/pages/series/Series"));
const Error404 = React.lazy(async () => await import("~/pages/error/Error"));
const Genre = React.lazy(async () => await import("~/pages/genre/Genre"));
const Genres = React.lazy(async () => await import("~/pages/genres/Genres"));
const Home = React.lazy(async () => await import("~/pages/home/Home"));
const Login = React.lazy(async () => await import("~/pages/login/Login"));
const Movie = React.lazy(async () => await import("~/pages/movie/Movie"));
const Profile = React.lazy(async () => await import("~/pages/profile/Profile"));
const Register = React.lazy(async () => await import("~/pages/register/Register"));
const AboutUsTab = React.lazy(async () => await import("~/pages/profile/aboutUs/AboutUs"));
const FavoriteMoviesTab = React.lazy(
    async () => await import("~/pages/profile/favoriteMovies/FavoriteMovies"),
);

const MainLayout = ({ children }: { children: React.ReactNode }) => {
    return (
        <React.Fragment>
            <Grid container>
                <Grid item xs={12}>
                    <Header />
                    <React.Suspense
                        fallback={
                            <Box
                                sx={{
                                    display: "flex",
                                    placeItems: "center",
                                    height: "100vh",
                                }}
                            >
                                <CircularProgress size={80} thickness={4} />
                            </Box>
                        }
                    >
                        <Box>{children}</Box>
                    </React.Suspense>
                    <ScrollToTop />
                    <Footer />
                </Grid>
            </Grid>
        </React.Fragment>
    );
};

const withMainLayout = (Component: React.ComponentType) => {
    return (props: any) => {
        return (
            <MainLayout>
                <React.Suspense
                    fallback={
                        <Box
                            sx={{
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                                height: "100vh",
                            }}
                        >
                            <CircularProgress size={80} thickness={4} />
                        </Box>
                    }
                >
                    <Component {...props} />
                </React.Suspense>
            </MainLayout>
        );
    };
};

export const HomePage = withMainLayout(Home);
export const MoviePage = withMainLayout(Movie);
export const GenresPage = withMainLayout(Genres);
export const GenrePage = withMainLayout(Genre);
export const SeriesPage = withMainLayout(Series);
export const ProfilePage = withMainLayout(Profile);
export const ErrorPage = withMainLayout(Error404);
export const LoginPage = withMainLayout(Login);
export const RegisterPage = withMainLayout(Register);
export const AboutUsPage = withMainLayout(AboutUsTab);
export const FavMoviesPage = withMainLayout(FavoriteMoviesTab);

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
                    <Route path="*" element={<ErrorPage />} />
                    <Route element={<PrivateRoutes />}>
                        <Route path="/profile" element={<ProfilePage />}>
                            <Route path="favoriteMovies" element={<FavMoviesPage />} />
                            <Route path="aboutUs" element={<AboutUsPage />} />
                            <Route path="*" element={<ErrorPage />} />
                        </Route>
                    </Route>
                    <Route path="/movies" element={<HomePage />} />
                    <Route path="/movies/:title" element={<MoviePage />} />
                    <Route path="/genres" element={<GenresPage />} />
                    <Route path="/genres/:name" element={<GenrePage />} />
                    <Route path="/series" element={<SeriesPage />} />
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/register" element={<RegisterPage />} />
                </Routes>
            </ThemeProvider>
        </ColorModeContext.Provider>
    );
}

export default App;
