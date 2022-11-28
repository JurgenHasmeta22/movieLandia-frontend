import {
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import "./App.css";
import { useEffect } from "react";
import { useStore } from "../main/store/zustand/store";
import Error404 from "../modules/base/pages/error";
import Genre from "../modules/base/pages/genre";
import GenreCategories from "../modules/base/pages/genre/genreCategories";
import Home from "../modules/base/pages/home";
import Login from "../modules/base/pages/login";
import Movie from "../modules/base/pages/movie";
import Profile from "../modules/base/pages/profile";
import Register from "../modules/base/pages/register";
import axios from "axios";
import IUser from "../main/store/zustand/types/IUser";

function App() {
  const { setUser } = useStore();

  async function validateUser() {
    if (localStorage.token) {
      const config = {
        headers: {
          Authorization: localStorage.token,
        }
      }
      const response: IUser = await axios.get("http://localhost:4000/validate", config).then(x=>x.data);
      if (response) {
        setUser(response)
      }
    }
  }

  useEffect(() => {
    validateUser();
  }, [])

  return (
    <>
      <Routes>
        <Route 
          index element={<Navigate replace to="/movies" />} 
        />
        <Route
          path="*"
          element={<Error404 />}
        />
        <Route
          path="/movies"
          element={<Home />}
        />
        <Route
          path="/movies/page/:page"
          element={<Home />}
        />
        <Route
          path="/movies/:title"
          element={<Movie />}
        />
        <Route
          path="/movies/search/:query"
          element={<Home />}
        />
        <Route
          path="/movies/search/"
          element={<Home />}
        />
        <Route
          path="/movies/search/:query/page/:page"
          element={<Home />}
        />
        <Route
          path="/movies/sortBy/:sort"
          element={<Home />}
        />
        <Route
          path="/movies/sortBy/:sort/page/:page"
          element={<Home />}
        />
        <Route
          path="/profile"
          element={<Profile />}
        />
        <Route
          path="/profile/:tab"
          element={<Profile />}
        />
        <Route
          path="/login"
          element={<Login />}
        />
        <Route
          path="/register"
          element={<Register />}
        />
        <Route
          path="/genres"
          element={<GenreCategories />}
        />
        <Route
          path="/genres/:name"
          element={<Genre />}
        />
        <Route
          path="/genres/:name/page/:page"
          element={<Genre />}
        />
      </Routes>
    </>
  );
}

export default App;
