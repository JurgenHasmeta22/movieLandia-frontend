import {
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import "./App.css";
import { useEffect } from "react";
import { useStore } from "~/main/store/zustand/store";
import Error404 from "~/modules/base/pages/error";
import Genre from "~/modules/base/pages/genre";
import GenreCategories from "~/modules/base/pages/genre/genreCategories";
import Home from "~/modules/base/pages/home";
import Login from "~/modules/base/pages/login";
import Movie from "~/modules/base/pages/movie";
import Profile from "~/modules/base/pages/profile";
import Register from "~/modules/base/pages/register";
import IUser from "~/main/store/zustand/types/IUser";
import authenticationController from "~/main/controllers/authenticationController";
import AboutUsTab from "~/modules/base/pages/profile/aboutUs";
import FavoriteMoviesTab from "~/modules/base/pages/profile/favoriteMovies";

function App() {
  // const userContext = createContext(null);
  // const [userNew, setUserNew] = useState(user);
  const { setUser } = useStore();

  useEffect(() => {
    const validateUser = async () => {
      const response: IUser | undefined = await authenticationController.validateUser();
      if (response) setUser(response);
    }
    validateUser();
  }, []);

  return (
    <Routes>
      <Route index element={<Navigate replace to="/movies" />} />
      <Route path="*" element={<Error404 />} />
      <Route path="movies" element={<Home />} />
      <Route path="movies/:title" element={<Movie />} />
      <Route path="profile" element={<Profile />}>
        <Route path="favoriteMovies" element={<FavoriteMoviesTab />} />
        <Route path="aboutUs" element={<AboutUsTab />} />
        <Route path="*" element={<Error404 />} />
      </Route>
      <Route path="login" element={<Login />} />
      <Route path="register" element={<Register />} />
      <Route path="genres" element={<GenreCategories />} />
      <Route path="genres/:name" element={<Genre />} />
      <Route path="genres/:name/page/:page" element={<Genre />} />
    </Routes>
  );
}

export default App;
