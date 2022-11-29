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
import Paragraph from "../../../../main/components/text";
import Container from "../../../../main/components/container";
import Heading from "../../../../main/components/heading";
import ListItem from "../../../../main/components/list/listItem";
import List from "../../../../main/components/list";

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
      <Container classname="loading-wrapper">
        <ReactLoading
          type={"spin"}
          color={"#000"}
          height={200}
          width={100}
          className="loading"
        />
      </Container>
    );
  }

  return (
    <>
      <Header />
      <section className="movie-item-wrapper">
        <Container classname="left-section">
          <Container classname="video-and-servers">
            <Container classname="servers">
              <List classname="server-list">
                <ListItem>Movie Server</ListItem>
              </List>
            </Container>
            <Container classname="video-square">
              <iframe
                src={movie.videoSrc}
                name="movieFrame"
                scrolling="no"
                frameBorder={0}
                height="550px"
                width="850px"
                allowFullScreen
              >
              </iframe>
            </Container>
            <Container classname="movie-details">
              <Container classname="movie-specifications">
                <List classname="trailer">
                  <ListItem>Trailer: </ListItem>
                  <a href={movie.trailerSrc} className="trailer-link">
                    Youtube trailer
                  </a>
                </List>
                <List classname="length">
                  <ListItem>Duration: {movie.duration}</ListItem>
                  <ListItem>Year: {movie.releaseYear}</ListItem>
                  <ListItem>
                    Imdb Rating:
                    {movie.ratingImdb === 0 ? "N/A" : movie.ratingImdb}
                  </ListItem>
                </List>
                {user?.userName && (
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
                )}
              </Container>
            </Container>
          </Container>
          <Container classname="movie-fabula">
            <Paragraph id="fabula">{movie.description}</Paragraph>
          </Container>
          <Container classname="last movies">
            <Container classname="posted-lastest">
              <Heading>Latest Movies</Heading>
            </Container>
            <List classname="last-movies-list">
              {latestMovies.slice(14, 19).map((latestMovie: any) => (
                <MovieItemLatest 
                  latestMovie={latestMovie}
                />
              ))}
            </List>
          </Container>
        </Container>
        <Container classname="right-section">
        </Container>
      </section>
      <Footer />
    </>
  );
}
