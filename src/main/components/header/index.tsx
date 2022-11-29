import { useEffect } from "react";
import { Link, useNavigate, NavLink } from "react-router-dom";
import { useStore } from "../../store/zustand/store";
import "react-dropdown/style.css";
import "./style.css";
import axios from "axios";
import IGenre from "../../store/zustand/types/IGenre";
import Picture from "../picture";
import Label from "../label";
import Container from "../container";
import ListItem from "../list/listItem";
import List from "../list";

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

  function handleLogout() {
    localStorage.removeItem("token");
    setUser(null);
    navigate("/login");
  }

  function redirectToProfile(user: any) {
    navigate(`/profile`);
  }

  async function getGenres(): Promise<void> {
    const response: IGenre[] = await axios.get("http://localhost:4000/genres").then(x => x.data);
    setGenres(response);
  }

  useEffect(() => {
    getGenres();
  }, []);

  return (
    <>
      <header className="header">
        <Container classname="header-group-1">
          <Link to="/movies">MovieLand24</Link>
          <List classname="list-nav">
            <Container classname="div-inside-li">
              <Picture src="/assets/logos/ico_filma_blu.png" alt="" />
              <NavLink to="/movies" className="special-uppercase">
                Movies
              </NavLink>
            </Container>
            <Container classname="div-inside-li-special">
              <Container classname="dropdown">
                <Container classname="genre-drop">
                  <Picture src="/assets/logos/list_blu.png" alt="" />
                  <ListItem
                    classname="special-uppercase"
                    onClick={function (e) {
                      e.stopPropagation();
                      navigate("/genres");
                    }}
                  >
                    Genres
                  </ListItem>
                </Container>
                <Container classname="dropdown-content">
                  <List>
                    {genres.map((genre: any) => (
                      <ListItem
                        classname="special-list-drop"
                        key={genre.id}
                        onClick={function (e: any) {
                          e.stopPropagation();
                          navigate(`/genres/${genre.name}`);
                        }}
                      >
                        {genre.name}
                      </ListItem>
                    ))}
                  </List>
                </Container>
              </Container>
            </Container>
            <Container classname="div-inside-li">
              <Picture src="/assets/logos/netflix-red.png" alt="" />
              <NavLink to="/genres/NETFLIX" className="special-uppercase">
                Netflix
              </NavLink>
            </Container>
          </List>
        </Container>
        <Container classname="header-group-2">
          <form
            className="button-search"
            onSubmit={function (e) {
              e.preventDefault();
              // @ts-ignore
              setSearchTerm(e.target.value);
              // @ts-ignore
              navigate(`/movies/search/${e.target.searchMovie.value}`);
            }}
          >
            <input
              type="search"
              name="searchMovie"
              placeholder="Search for movies..."
              aria-label="Search through site content"
              onChange={function (e: React.ChangeEvent<HTMLInputElement>) {
                navigate(`/movies/search/${e.target.value}`);
                if (e.target.value.length > 0) {
                  setSearchTerm(e.target.value);
                  navigate(`/movies/search/${e.target.value}`);
                } else {
                  setSearchTerm(e.target.value);
                  navigate(`/movies/search/`);
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
            <Container classname="dropdown">
              <ListItem
                classname="dropbtn"
                onClick={function () {
                  redirectToProfile(user);
                }}
              >
                <Picture src={`/assets/avatars/blankavatar.jpg`} />
                {user.userName}
              </ListItem>
              <Container classname="dropdown-content">
                <button
                  className="log-out"
                  onClick={function (e: any) {
                    e.stopPropagation();
                    handleLogout();
                  }}
                >
                  <Label>Log Out</Label>
                </button>
              </Container>
            </Container>
          )}
        </Container>
      </header>
    </>
  );
}
