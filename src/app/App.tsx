import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useEffect } from "react";
import { useStore } from "~/store/store";
import type IUser from "~/types/IUser";
import authenticationService from "~/services/api/authenticationService";
import PrivateRoutes from "~/utils/PrivateRoutes";
import { Grid, CircularProgress, Box, ThemeProvider, CssBaseline } from "@mui/material";
import { Header } from "~/components/header/Header";
import { Footer } from "~/components/footer/Footer";
import { ColorModeContext, useMode } from "~/utils/theme";
import ScrollToTop from "~/components/scrollToTop/scrollToTop";
import Sidebar from "~/components/admin/sidebar/Sidebar";
import TopBar from "~/components/admin/topBar/TopBar";
import { ModalProvider } from "~/services/providers/ModalContext";
import { RightPanelProvider } from "~/services/providers/RightPanelContext";
import { sidebarItems } from "~/utils/sidebarItems";

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
const Dashboard = React.lazy(() => import("~/pages/admin/dashboard/Dashboard"));
const MoviesAdmin = React.lazy(() => import("~/pages/admin/movies/MoviesAdmin"));

// #region "HOC components wrapper for layout"

// main HOC
const MainLayout = ({ children }: { children: React.ReactNode }) => {
    return (
        <React.Fragment>
            <CssBaseline />
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

// admin HOC
const MainLayoutAdmin = ({ children }: { children: React.ReactNode }) => {
    const { isOpenSidebarAdmin } = useStore();

    return (
        <React.Fragment>
            <CssBaseline />
            <RightPanelProvider>
                <ModalProvider>
                    <Grid container>
                        <Grid item xs={12} md={isOpenSidebarAdmin ? 2 : 0}>
                            <Sidebar sidebarItems={sidebarItems} />
                        </Grid>
                        <Grid item xs={12} md={isOpenSidebarAdmin ? 10 : 12}>
                            <TopBar />
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
                                <Box ml={4}>{children}</Box>
                            </React.Suspense>
                        </Grid>
                    </Grid>
                </ModalProvider>
            </RightPanelProvider>
        </React.Fragment>
    );
};

const withMainLayoutAdmin = (Component: React.ComponentType) => {
    return (props: any) => {
        return (
            <MainLayoutAdmin>
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
            </MainLayoutAdmin>
        );
    };
};

// #endregion

//main layout wrapper uses
export const HomePage = withMainLayout(Home);
export const MoviePage = withMainLayout(Movie);
export const GenrePage = withMainLayout(Genre);
export const SeriesPage = withMainLayout(Series);
export const ProfilePage = withMainLayout(Profile);
export const ErrorPage = withMainLayout(Error404);
export const LoginPage = withMainLayout(Login);
export const RegisterPage = withMainLayout(Register);

// admin layout wrapper uses
export const DashboardPage = withMainLayoutAdmin(Dashboard);
export const UsersAdminPage = withMainLayoutAdmin(Dashboard);
export const SeriesAdminPage = withMainLayoutAdmin(Dashboard);
export const MoviesAdminPage = withMainLayoutAdmin(MoviesAdmin);
export const GenresAdminPage = withMainLayoutAdmin(Dashboard);

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
                        <Route path="/profile" element={<ProfilePage />} />
                        <Route path="/admin" element={<DashboardPage />}>
                            <Route path="/admin/dashboard" element={<DashboardPage />} />
                            <Route path="/admin/users" element={<UsersAdminPage />} />
                            <Route path="/admin/movies" element={<MoviesAdminPage />} />
                            <Route path="/admin/series" element={<SeriesAdminPage />} />
                            <Route path="/admin/genres" element={<GenresAdminPage />} />
                        </Route>
                    </Route>
                    <Route path="/movies" element={<HomePage />} />
                    <Route path="/movies/:title" element={<MoviePage />} />
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
