import { useEffect } from "react";
import { Link, useNavigate, NavLink } from "react-router-dom";
import { useStore } from "../../store/zustand/store";
import "react-dropdown/style.css";
import "./style.css";

export default function Header() {
  const navigate = useNavigate();
  const { setUser, setSearchTerm, user, genres, setGenres } = useStore();

  const options: any = [];
  for (const genre of genres) {
    options.push(
      { 
        value: genre.name, 
        label: genre.name 
      }
    );
  }

  function handleLogOut(e: any) {
    e.preventDefault();
    localStorage.removeItem("token");
    setUser(null);
    navigate("/login");
  }

  function redirectToProfile(user: any) {
    navigate(`../profile`);
  }

  function getGenres(): void {
    fetch(`http://localhost:4000/genres`)
      .then((resp) => resp.json())
      .then((genres) => setGenres(genres));
  }

  useEffect(getGenres, []);

  return (
    <>
      <header className="header">
        <div className="header-group-1">
          <Link to="/movies">MovieLand24</Link>
          <ul className="list-nav">
            <div className="div-inside-li">
              <img src="/assets/logos/ico_filma_blu.png" alt="" />
              <NavLink to="../movies" className="special-uppercase">
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
                      navigate("../genres");
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
                          navigate(`../genres/${genre.name}`);
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
              <NavLink to="../genres/NETFLIX" className="special-uppercase">
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
              //@ts-ignore
              setSearchTerm(e.target.value);
              //@ts-ignore
              navigate(`../movies/search/${e.target.searchMovie.value}`);
            }}
          >
            <input
              type="search"
              name="searchMovie"
              placeholder="Search for movies..."
              aria-label="Search through site content"
              onChange={function (e) {
                navigate(`../movies/search/${e.target.value}`);
                if (e.target.value.length > 0) {
                  setSearchTerm(e.target.value);
                  navigate(`../movies/search/${e.target.value}`);
                } else {
                  setSearchTerm(e.target.value);
                  navigate(`../movies/search/`);
                }
              }}
            />
            <button type="submit">
              <i className="fa fa-search"></i>
            </button>
          </form>
          {user === null ? (
            <button
              className="button-login-header"
              onClick={function () {
                navigate("../login");
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
                <img src={`/assets/avatars/blankavatar.jpg`} />
                {user.userName}
              </li>
              <div className="dropdown-content">
                <button
                  className="log-out"
                  onClick={function (e) {
                    handleLogOut(e);
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
