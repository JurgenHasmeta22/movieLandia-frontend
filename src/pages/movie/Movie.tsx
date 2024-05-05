import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { useStore } from "~/store/zustand/store";
import type IMovie from "~/interfaces/IMovie";
import type IUser from "~/interfaces/IUser";
import movieService from "~/services/movieService";
import MovieItemLatest from "~/pages/movie/movieItemLatest/MovieItemLatest";
import { Box, Button, Container, List, ListItem } from "@mui/material";

export default function Movie() {
    const [movie, setMovie] = useState<IMovie | null>(null);
    const [latestMoviesRelated, setLatestMoviesRelated] = useState<IMovie[]>([]);

    const params = useParams();
    const navigate = useNavigate();

    const { user, setUser } = useStore();

    async function getLatestMovies(): Promise<void> {
        const response: IMovie[] = await movieService.getLatestMovies();
        setLatestMoviesRelated(response);
    }

    async function getMovie(): Promise<void> {
        const response: IMovie = await movieService.getMovie(params.title);
        setMovie(response);
    }

    async function addToFavorites() {
        const response: IUser = await movieService.addToFavorites(movie?.id);
        setUser(response);
    }

    useEffect(() => {
        getLatestMovies();
    }, []);

    useEffect(() => {
        getMovie();
    }, [params.title]);

    if (!movie) {
        return <Box className="loading-wrapper">...</Box>;
    }

    return (
        <Container>
            <Box>
                <Box>
                    <Box>
                        <List>
                            <ListItem>Movie Server</ListItem>
                        </List>
                    </Box>
                    <Box>
                        <iframe
                            src={movie.videoSrc}
                            title={movie.title}
                            id="iframeMovie"
                            name="movieFrame"
                            height="550px"
                            width="850px"
                            allowFullScreen
                        ></iframe>
                    </Box>
                    <Box>
                        <Box>
                            <List>
                                <ListItem>Trailer: </ListItem>
                                <a href={movie.trailerSrc} className="trailer-link">
                                    Youtube trailer
                                </a>
                            </List>
                            <List>
                                <ListItem>Duration: {movie.duration}</ListItem>
                                <ListItem>Year: {movie.releaseYear}</ListItem>
                                <ListItem>
                                    Imdb Rating:
                                    {movie.ratingImdb === 0 ? "N/A" : movie.ratingImdb}
                                </ListItem>
                            </List>
                            {user?.userName && (
                                <Button
                                    onClick={function () {
                                        addToFavorites();
                                        navigate("/profile");
                                        window.scrollTo(0, 0);
                                    }}
                                >
                                    Add to favorites
                                </Button>
                            )}
                        </Box>
                    </Box>
                </Box>
                <Box>
                    <p>{movie.description}</p>
                </Box>
                <Box>
                    <Box>
                        <h2>Latest Movies</h2>
                    </Box>
                    <List>
                        {latestMoviesRelated.slice(14, 19).map((latestMovie: any) => (
                            <MovieItemLatest latestMovie={latestMovie} key={latestMovie.id} />
                        ))}
                    </List>
                </Box>
            </Box>
            <Box></Box>
        </Container>
    );
}
