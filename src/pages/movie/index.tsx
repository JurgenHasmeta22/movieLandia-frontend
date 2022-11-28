import { useNavigate, useParams } from "react-router-dom";
import ReactLoading from "react-loading";
import { useStore } from "../../store/zustand/store";
import { useEffect } from "react";
import "./style.css";
import IMovie from "../../store/zustand/types/IMovie";
import IUser from "../../store/zustand/types/IUser";
import Header from "../../components/header";
import Footer from "../../components/footer";
import axios from "axios";

export default function Movie() {
  const params = useParams();
  const navigate = useNavigate();

  const {
    movieItem,
    setMovieItem,
    latestMovies,
    setLatestMovies,
    setUser,
    user,
  } = useStore();

  async function addToFavorites() {
    const payload = {
      movieId: movieItem?.id
    }
    const response: IUser = await (await axios.post("http://localhost:4000/favorites", payload)).data;
    setUser(response); 
  }

  async function getLatestMovies(): Promise<void> {
    const response: IMovie[] = await (await axios.get("http://localhost:4000/latest")).data;
    setLatestMovies(response);
  }

  async function getMovieItem(): Promise<void> {
    const response: IMovie = await (await axios.get(`http://localhost:4000/movie/${params.title}`)).data;
    setMovieItem(response);
  }

  useEffect(() => {
    getLatestMovies();
  }, []);

  useEffect(() => {
    getMovieItem()
  }, [params.title]);

  if (!movieItem) {
    return (
      <div className="loading-wrapper">
        <ReactLoading
          type={"spin"}
          color={"#000"}
          height={200}
          width={100}
          className="loading"
        />
      </div>
    );
  }

  return (
    <>
      <Header />
      <section className="movie-item-wrapper">
        <div className="left-section">
          <div className="video-and-servers">
            <div className="servers">
              <ul className="server-list">
                <li>Movie Server</li>
              </ul>
            </div>
            <div className="video-square">
              <iframe
                src={movieItem?.videoSrc}
                name="movieFrame"
                scrolling="no"
                frameBorder={0}
                height="550px"
                width="850px"
                allowFullScreen
              ></iframe>
            </div>
            <div className="movie-details">
              <div className="movie-specifications">
                <ul className="trailer">
                  <li>Trailer: </li>
                  <a href={movieItem?.trailerSrc} className="trailer-link">
                    Youtube trailer
                  </a>
                </ul>
                <ul className="length">
                  <li>Duration: {movieItem?.duration}</li>
                  <li>Year: {movieItem?.releaseYear}</li>
                  <li>
                    Imdb Rating:{" "}
                    {movieItem?.ratingImdb === 0
                      ? "N/A"
                      : movieItem?.ratingImdb}
                  </li>
                </ul>
                {user?.userName ? (
                  <button
                    className="button-favorite-add"
                    onClick={function () {
                      addToFavorites();
                      navigate("/profile");
                      window.scrollTo(0, 0);
                    }}
                  >
                    Add to favorites
                  </button>
                ) : null}
              </div>
            </div>
          </div>
          <div className="movie-fabula">
            <p id="fabula">{movieItem?.description}</p>
          </div>
          <div className="last movies">
            <div className="posted-lastest">
              <h2>Latest Movies</h2>
            </div>
            <ul className="last-movies-list">
              {latestMovies.slice(14, 19).map((latestMovie: any) => (
                <li
                  key={latestMovie.id}
                  onClick={function () {
                    navigate(
                      `/movies/${latestMovie.title
                        .split("")
                        .map((char: any) => (char === " " ? "-" : char))
                        .join("")}`
                    );
                    window.scrollTo(0, 0);
                  }}
                >
                  <img src={latestMovie.photoSrc} />
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="right-section">
          <ul>
            <li>
              <img src="https://i.imgur.com/5wdcyDG.gif" alt="ddf" />
            </li>
            <li>
              <img src="https://www.filma24.so/genti300x300.gif" alt="ggg" />
            </li>
            <li>
              <img src="https://i.imgur.com/Wl3zKCb.jpg" alt="eee" />
            </li>
          </ul>
        </div>
      </section>
      <Footer />
    </>
  );
}
