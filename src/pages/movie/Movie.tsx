import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { useStore } from "~/store/zustand/store";
import type IMovie from "~/interfaces/IMovie";
import type IUser from "~/interfaces/IUser";
import movieService from "~/services/movieService";
import MovieItemLatest from "~/pages/movie/movieItemLatest/MovieItemLatest";
import { Box, Button, Container, List, ListItem, Stack, Typography, useTheme } from "@mui/material";
import { tokens } from "~/utils/theme";

export default function Movie() {
    const [movie, setMovie] = useState<IMovie | null>(null);
    const [latestMoviesRelated, setLatestMoviesRelated] = useState<IMovie[]>([]);

    const params = useParams();
    const navigate = useNavigate();

    const { user, setUser } = useStore();

    const theme = useTheme();
    const colors = tokens(theme.palette.mode);

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
        return <Box>...</Box>;
    }

    return (
        <Box
            sx={{
                display: "flex",
                flexDirection: "column",
                rowGap: 4,
                backgroundColor: `${colors.blueAccent[700]}`,
            }}
        >
            <Box
                sx={{
                    display: "flex",
                    flexDirection: "column",
                    placeItems: "center",
                    placeContent: "center",
                }}
            >
                <Box>
                    <Box mt={4} mb={2}>
                        <Box>
                            <Typography fontSize={24}>Movie Server</Typography>
                        </Box>
                    </Box>
                    <Box>
                        <iframe
                            src={movie.videoSrc}
                            title={movie.title}
                            id="iframeMovie"
                            name="movieFrame"
                            height="500px"
                            width="700px"
                            allowFullScreen
                        ></iframe>
                    </Box>
                    <Box>
                        <Box>
                            <Box>
                                <Typography>Trailer: </Typography>
                                <a href={movie.trailerSrc} className="trailer-link">
                                    Youtube trailer
                                </a>
                            </Box>
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
                    <Typography width={"80ch"}>{movie.description}</Typography>
                </Box>
                <Box
                    sx={{
                        display: "flex",
                        flexDirection: "column",
                        rowGap: 4,
                        marginBottom: 4,
                        marginTop: 4,
                    }}
                >
                    <Box>
                        <Typography fontSize={22} color={"secondary"}>
                            Latest Movies
                        </Typography>
                    </Box>
                    <Stack
                        direction="row"
                        flexWrap="wrap"
                        spacing={4}
                        justifyContent="center"
                        alignContent="center"
                    >
                        {latestMoviesRelated.slice(14, 19).map((latestMovie: any) => (
                            <MovieItemLatest latestMovie={latestMovie} key={latestMovie.id} />
                        ))}
                    </Stack>
                </Box>
            </Box>
        </Box>
    );
}
