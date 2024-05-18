import { Link, useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { useStore } from "~/store/store";
import type IMovie from "~/types/IMovie";
import type IUser from "~/types/IUser";
import movieService from "~/services/api/movieService";
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
import SEOHelmet from "~/components/seoHelmet/SEOHelmet";
import ReviewsIcon from "@mui/icons-material/Reviews";

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
        const response: IMovie = await movieService.getMovieByTitle(params.title);
        setMovie(response);
    }

    async function addToFavorites() {
        const response: IUser = await movieService.addToFavorites(movie?.id, user?.id);
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
        <>
            <SEOHelmet
                title={`Watch ${movie?.title} on MovieLand24`}
                description={`${movie?.description}`}
                name="MovieLand24"
                type="article"
                canonicalUrl={`https://example.com/movies/${movie?.title}`}
            />
            <Box
                sx={{
                    display: "flex",
                    flexDirection: "column",
                    rowGap: 4,
                    backgroundColor: `${colors.blueAccent[700]}`,
                }}
                component={"main"}
            >
                <Box
                    sx={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                        rowGap: 2,
                    }}
                    component={"section"}
                >
                    <Typography
                        mt={4}
                        mb={2}
                        fontSize={18}
                        color={"secondary"}
                        textAlign={"center"}
                        component={"h1"}
                    >
                        {movie.title}
                    </Typography>
                    <Box>
                        <iframe
                            style={{
                                width: `${isPageShrunk ? "250px" : "650px"}`,
                                height: `${isPageShrunk ? "300px" : "450px"}`,
                            }}
                            src={movie.trailerSrc}
                            title={movie.title}
                            allowFullScreen
                        ></iframe>
                    </Box>
                    <Box
                        sx={{
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            rowGap: 2,
                        }}
                    >
                        <List
                            sx={{
                                display: "flex",
                                flexDirection: "row",
                            }}
                        >
                            <ListItem
                                sx={{
                                    color: colors.greenAccent[200],
                                }}
                            >
                                <span>Duration: {movie.duration}</span>
                            </ListItem>
                            <ListItem
                                sx={{
                                    color: colors.greenAccent[200],
                                }}
                            >
                                <span>Year: {movie.releaseYear}</span>
                            </ListItem>
                            <ListItem
                                sx={{
                                    color: colors.greenAccent[200],
                                }}
                            >
                                <span>Imdb Rating:</span>
                                <span>{movie.ratingImdb === 0 ? "N/A" : movie.ratingImdb}</span>
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
                        rowGap: 2,
                        marginBottom: 2,
                        marginTop: 2,
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
                        {latestMoviesRelated.slice(5, 10).map((latestMovie: any) => (
                            <MovieItemLatest latestMovie={latestMovie} key={latestMovie.id} />
                        ))}
                    </Stack>
                </Box>
            </Box>
        </>
    );
}
