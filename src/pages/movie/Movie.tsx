import { Link, useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { useStore } from "~/store/zustand/store";
import type IMovie from "~/types/IMovie";
import type IUser from "~/types/IUser";
import movieService from "~/services/movieService";
import MovieItemLatest from "~/pages/movie/movieItemLatest/MovieItemLatest";
import {
    Box,
    Button,
    CircularProgress,
    List,
    ListItem,
    Stack,
    Typography,
    useTheme,
} from "@mui/material";
import { tokens } from "~/utils/theme";
import { useResizeWindow } from "~/hooks/useResizeWindow";

export default function Movie() {
    const [movie, setMovie] = useState<IMovie | null>(null);
    const [latestMoviesRelated, setLatestMoviesRelated] = useState<IMovie[]>([]);

    const { user, setUser } = useStore();
    const params = useParams();
    const navigate = useNavigate();

    const isPageShrunk = useResizeWindow();
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
        getMovie();
    }, [params.title]);

    useEffect(() => {
        getLatestMovies();
    }, []);

    if (!movie) {
        return (
            <Box
                sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    height: "100vh",
                }}
            >
                <CircularProgress size={80} thickness={4} />
            </Box>
        );
    }

    return (
        <Box
            sx={{
                display: "flex",
                flexDirection: "column",
                rowGap: 8,
                backgroundColor: `${colors.blueAccent[700]}`,
            }}
            component={"main"}
        >
            <Box
                sx={{
                    display: "flex",
                    flexDirection: "column",
                    placeItems: "center",
                    placeContent: "center",
                    rowGap: 4,
                }}
                component={"section"}
            >
                <Typography mt={4} fontSize={22} color={"secondary"} textAlign={"center"}>
                    Movie Server
                </Typography>
                <Box>
                    {/* For some weird reason wrapping this iframe in a div (Box) fixed the responsive bug which moved */}
                    <iframe
                        style={{
                            width: `${isPageShrunk ? "250px" : "650px"}`,
                            height: `${isPageShrunk ? "300px" : "450px"}`,
                        }}
                        src={movie.videoSrc}
                        title={movie.title}
                        allowFullScreen
                        // loading="lazy"
                    ></iframe>
                </Box>
                <Box
                    sx={{
                        display: "flex",
                        flexDirection: "column",
                        placeItems: "center",
                        placeContent: "center",
                        rowGap: 2,
                    }}
                >
                    <Link
                        to={movie.trailerSrc}
                        style={{
                            textDecoration: "none",
                            fontSize: 20,
                            color: colors.greenAccent[500],
                        }}
                    >
                        Youtube trailer
                    </Link>
                    <List>
                        <ListItem
                            sx={{
                                color: colors.greenAccent[200],
                            }}
                        >
                            Duration: {movie.duration}
                        </ListItem>
                        <ListItem
                            sx={{
                                color: colors.greenAccent[200],
                            }}
                        >
                            Year: {movie.releaseYear}
                        </ListItem>
                        <ListItem
                            sx={{
                                color: colors.greenAccent[200],
                            }}
                        >
                            Imdb Rating:
                            {movie.ratingImdb === 0 ? "N/A" : movie.ratingImdb}
                        </ListItem>
                    </List>
                    <Typography textAlign={"center"} color={"secondary"} width={"60%"}>
                        {movie.description}
                    </Typography>
                    {user?.userName && (
                        <Button
                            onClick={function () {
                                addToFavorites();
                                navigate("/profile");
                            }}
                            color="secondary"
                            variant="outlined"
                        >
                            Add to favorites
                        </Button>
                    )}
                </Box>
            </Box>
            <Box
                sx={{
                    display: "flex",
                    flexDirection: "column",
                    rowGap: 4,
                    marginBottom: 4,
                    marginTop: 4,
                }}
                component={"section"}
            >
                <Typography fontSize={22} color={"secondary"} textAlign={"center"}>
                    Latest Movies
                </Typography>
                <Stack
                    direction="row"
                    flexWrap="wrap"
                    gap={2}
                    justifyContent="center"
                    alignContent="center"
                >
                    {latestMoviesRelated.slice(14, 19).map((latestMovie: any) => (
                        <MovieItemLatest latestMovie={latestMovie} key={latestMovie.id} />
                    ))}
                </Stack>
            </Box>
        </Box>
    );
}
