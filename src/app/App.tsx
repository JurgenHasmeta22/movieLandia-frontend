import * as React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useEffect } from "react";
import { useStore } from "~/store/zustand/store";
import type IUser from "~/interfaces/IUser";
import authenticationController from "~/services/authentication";
import PrivateRoutes from "~/utils/PrivateRoutes";
import "./App.css";
const Series = React.lazy(async () => await import("~/pages/series"));
// const Seria = React.lazy(async () => await import("~/pages/serie"));
const Error404 = React.lazy(async () => await import("~/pages/error"));
const Genre = React.lazy(async () => await import("~/pages/genre"));
const Genres = React.lazy(async () => await import("~/pages/genres/index"));
const Home = React.lazy(async () => await import("~/pages/home"));
const Login = React.lazy(async () => await import("~/pages/login"));
const Movie = React.lazy(async () => await import("~/pages/movie"));
const Profile = React.lazy(async () => await import("~/pages/profile"));
const Register = React.lazy(async () => await import("~/pages/register"));
const AboutUsTab = React.lazy(async () => await import("~/pages/profile/aboutUs"));
const FavoriteMoviesTab = React.lazy(async () => await import("~/pages/profile/favoriteMovies"));

function App() {
    // const userContext = createContext(null);
    // const [userNew, setUserNew] = useState(user);
    const { setUser } = useStore();

    useEffect(() => {
        const validateUser = async () => {
            const response: IUser | undefined = await authenticationController.validateUser();
            if (response) setUser(response);
        };
        validateUser();
    }, []);

    return (
        <Routes>
            <Route index element={<Navigate replace to="/movies" />} />
            <Route
                path="*"
                element={
                    <React.Suspense fallback={<>...</>}>
                        <Error404 />
                    </React.Suspense>
                }
            />
            <Route element={<PrivateRoutes />}>
                <Route
                    path="/profile"
                    element={
                        <React.Suspense fallback={<>...</>}>
                            <Profile />
                        </React.Suspense>
                    }
                >
                    <Route
                        path="favoriteMovies"
                        element={
                            <React.Suspense fallback={<>...</>}>
                                <FavoriteMoviesTab />
                            </React.Suspense>
                        }
                    />
                    <Route
                        path="aboutUs"
                        element={
                            <React.Suspense fallback={<>...</>}>
                                <AboutUsTab />
                            </React.Suspense>
                        }
                    />
                    <Route
                        path="*"
                        element={
                            <React.Suspense fallback={<>...</>}>
                                <Error404 />
                            </React.Suspense>
                        }
                    />
                </Route>
            </Route>
            <Route
                path="/movies"
                element={
                    <React.Suspense fallback={<>...</>}>
                        <Home />
                    </React.Suspense>
                }
            />
            <Route
                path="/movies/:title"
                element={
                    <React.Suspense fallback={<>...</>}>
                        <Movie />
                    </React.Suspense>
                }
            />
            <Route
                path="/genres"
                element={
                    <React.Suspense fallback={<>...</>}>
                        <Genres />
                    </React.Suspense>
                }
            />
            <Route
                path="/genres/:name"
                element={
                    <React.Suspense fallback={<>...</>}>
                        <Genre />
                    </React.Suspense>
                }
            />
            <Route
                path="/series"
                element={
                    <React.Suspense fallback={<>...</>}>
                        <Series />
                    </React.Suspense>
                }
            />
            {/* <Route
                path="/series/:title"
                element={
                    <React.Suspense fallback={<>...</>}>
                        <Seria />
                    </React.Suspense>
                }
            /> */}
            <Route
                path="/login"
                element={
                    <React.Suspense fallback={<>...</>}>
                        <Login />
                    </React.Suspense>
                }
            />
            <Route
                path="/register"
                element={
                    <React.Suspense fallback={<>...</>}>
                        <Register />
                    </React.Suspense>
                }
            />
        </Routes>
    );
}

export default App;
