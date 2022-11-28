// import { addBackToTop } from "vanilla-back-to-top";
import {
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import "./App.css";
import { useStore } from "./store/zustand/store";
import Home from "./pages/home";
import Movie from "./pages/movie";
import Login from "./pages/login";
import Profile from "./pages/profile";
import Register from "./pages/register";
import GenreCategories from "./pages/genre/genreCategories";
import Genre from "./pages/genre";
import Error404 from "./pages/error";
import { useEffect } from "react";

function App() {
  const { setUser } = useStore();

  function validateUser() {
    if (localStorage.token) {
      fetch("http://localhost:4000/validate", {
        headers: {
          Authorization: localStorage.token,
        },
      })
        .then((resp) => resp.json())
        .then((data) => {
          if (data.error) {
            console.log("Validation failed.");
          } else {
            setUser(data);
          }
        });
    }
  }

  useEffect(() => {
    validateUser();
  })

  return (
    <>
      {/* {addBackToTop()} */}
      <Routes>
        <Route index element={<Navigate replace to="/movies" />} />
        <Route
          path="*"
          element={
            <Error404 />
          }
        />
        <Route
          path="/movies"
          element={
            <Home />
          }
        />
        <Route
          path="/movies/page/:page"
          element={
            <Home />
          }
        />
        <Route
          path="/movies/:title"
          element={
            <Movie />
          }
        />
        <Route
          path="/movies/search/:query"
          element={
            <Home />
          }
        />
        <Route
          path="/movies/search/"
          element={
            <Home />
          }
        />
        <Route
          path="/movies/search/:query/page/:page"
          element={
            <Home />
          }
        />
        <Route
          path="/movies/sortBy/:sort"
          element={
            <Home />
          }
        />
        <Route
          path="/movies/sortBy/:sort/page/:page"
          element={
            <Home />
          }
        />
        <Route
          path="/profile"
          element={
            <Profile />
          }
        />
        <Route
          path="/profile/:tab"
          element={
            <Profile />
          }
        />
        <Route
          path="/login"
          element={
            <Login />
          }
        />
        <Route
          path="/register"
          element={
            <Register />
          }
        />
        <Route
          path="/genres"
          element={
            <GenreCategories />
          }
        />
        <Route
          path="/genres/:name"
          element={
            <Genre />
          }
        />
        <Route
          path="/genres/:name/page/:page"
          element={
            <Genre />
          }
        />
      </Routes>
    </>
  );
}

export default App;
