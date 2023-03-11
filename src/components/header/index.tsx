import { useEffect, useState } from "react";
import { Link, useNavigate, NavLink, useLocation } from "react-router-dom";
import { useStore } from "~/store/zustand/store";
import "react-dropdown/style.css";
import "./style.css";
import axios from "axios";
import IGenre from "~/interfaces/IGenre";

export default function Header() {
  const navigate = useNavigate();
  const location = useLocation();
  const [options, setOptions] = useState<any>([]);
  const { setUser, searchTerm, setSearchTerm, user, genres, setGenres } =
    useStore();

  function handleLogout() {
    localStorage.removeItem("token");
    setUser(null);
    navigate("/login");
  }

  function redirectToProfile(user: any) {
    navigate(`/profile`);
  }

  async function getGenres(): Promise<void> {
    const response: IGenre[] = await axios
      .get("http://localhost:4000/genres")
      .then((x) => x.data);
    setGenres(response);
  }

  useEffect(() => {
    getGenres();
  }, []);

  useEffect(() => {
    for (const genre of genres) {
      const option = {
        value: genre.name,
        label: genre.name,
      };
      setOptions([...options, option]);
    }
  }, []);

  return (
    <>
      <header className="header">
        <div className="header-group-1">
          <Link to="/movies">MovieLand24</Link>
          <ul className="list-nav">
            <div className="div-inside-li">
              <img src="/assets/logos/ico_filma_blu.png" alt="" />
              <NavLink to="/movies" className="special-uppercase">
                Movies
              </NavLink>
            </div>
            <div className="div-inside-li-special">
              <div className="dropdown">
                <div className="genre-drop">
                  <img src="/assets/logos/list_blu.png" alt="" />
                  <li
                    className="special-uppercase"
                    onClick={function (e) {
                      e.stopPropagation();
                      navigate("/genres");
                    }}
                  >
                    Genres
                  </li>
                </div>
                <div className="dropdown-content">
                  <ul>
                    {genres.map((genre: any) => (
                      <li
                        className="special-list-drop"
                        key={genre.id}
                        onClick={function (e: any) {
                          e.stopPropagation();
                          navigate(`/genres/${genre.name}`);
                        }}
                      >
                        {genre.name}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
            <div className="div-inside-li">
              <img src="/assets/logos/netflix-red.png" alt="" />
              <NavLink to="/genres/NETFLIX" className="special-uppercase">
                Netflix
              </NavLink>
            </div>
          </ul>
        </div>
        <div className="header-group-2">
          <form
            className="button-search"
            onSubmit={function (e) {
              e.preventDefault();
            }}
          >
            <input
              type="search"
              name="searchMovie"
              placeholder="Search for movies..."
              onChange={function (e: React.ChangeEvent<HTMLInputElement>) {
                if (e.target.value.length > 0) {
                  setSearchTerm(e.target.value);
                  if (location.pathname !== "/movies")
                    navigate(`/movies?search=${searchTerm}`);
                } else {
                  setSearchTerm(e.target.value);
                  if (location.pathname !== "/movies") navigate(`/movies`);
                }
              }}
            />
            <button type="submit">
              <i className="fa fa-search"></i>
            </button>
          </form>
          {!user ? (
            <button
              className="button-login-header"
              onClick={function () {
                navigate("/login");
              }}
            >
              <i className="material-icons special-icon">account_circle</i>
              Sign In
            </button>
          ) : (
            <div className="dropdown">
              <li
                className="dropbtn"
                onClick={function () {
                  redirectToProfile(user);
                }}
              >
                <img src="/assets/avatars/blankavatar.jpg" />
                {user.userName}
              </li>
              <div className="dropdown-content">
                <button
                  className="log-out"
                  onClick={function (e: any) {
                    e.stopPropagation();
                    handleLogout();
                  }}
                >
                  <span>Log Out</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </header>
    </>
  );
}
