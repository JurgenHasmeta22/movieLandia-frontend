import { useNavigate, useParams } from "react-router-dom";
import ReactLoading from "react-loading";
import { useEffect, useState } from "react";
import "./style.css";
import { useStore } from "../../../../main/store/zustand/store";
import Footer from "../../../../main/components/footer";
import Header from "../../../../main/components/header";
import IMovie from "../../../../main/store/zustand/types/IMovie";
import IUser from "../../../../main/store/zustand/types/IUser";
import moviesController from "../../../../main/controllers/moviesController";
import MovieItemLatest from "./movieItemLatest";

export default function Movie() {
  const params = useParams();
  const navigate = useNavigate();
  const [movie, setMovie] = useState<IMovie | null>(null);
  const {
    latestMovies,
    setLatestMovies,
    setUser,
    user
  } = useStore();

  async function getLatestMovies(): Promise<void> {
    const response: IMovie[] = await moviesController.getLatestMovies();
    setLatestMovies(response);
  }

  async function getMovie(): Promise<void> {
    const response: IMovie = await moviesController.getMovie(params.title);
    setMovie(response);
  }

  async function addToFavorites() {
    const response: IUser = await moviesController.addToFavorites(movie?.id);
    setUser(response); 
  }

  useEffect(() => {
    getLatestMovies();
  }, []);
  
  useEffect(() => {
    getMovie()
  }, [params.title]);

  if (!movie) {
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
                src={movie.videoSrc}
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
                  <a href={movie.trailerSrc} className="trailer-link">
                    Youtube trailer
                  </a>
                </ul>
                <ul className="length">
                  <li>Duration: {movie.duration}</li>
                  <li>Year: {movie.releaseYear}</li>
                  <li>
                    Imdb Rating:{" "}
                    {movie.ratingImdb === 0
                      ? "N/A"
                      : movie.ratingImdb}
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
            <p id="fabula">{movie.description}</p>
          </div>
          <div className="last movies">
            <div className="posted-lastest">
              <h2>Latest Movies</h2>
            </div>
            <ul className="last-movies-list">
              {latestMovies.slice(14, 19).map((latestMovie: any) => (
                <MovieItemLatest 
                  latestMovie={latestMovie}
                />
              ))}
            </ul>
          </div>
        </div>
        <div className="right-section">
        </div>
      </section>
      <Footer />
    </>
  );
}
