import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { useStore } from "~/store/store";
import type IMovie from "~/types/IMovie";
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
import { motion } from "framer-motion";
import { toast } from "react-toastify";

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

    async function bookmarkMovie() {
        if (!user || !movie) return;

        try {
            const response = await movieService.addToFavorites(movie.id, user.id);

            if (response && !response.error) {
                setUser(response);
                toast.success("Movie bookmarked successfully!");
                navigate("/profile?tab=favMovies");
                window.scrollTo(0, 0);
            } else {
                toast.error("Movie not bookmarked successfully!");
            }
        } catch (error) {
            console.error("An error occurred while adding the movie to favorites:", error);
            toast.error("An error occurred while adding the movie to favorites.");
        }
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
            <main>
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.35, ease: "easeInOut" }}
                >
                    <Box
                        sx={{
                            display: "flex",
                            flexDirection: "column",
                            rowGap: 4,
                            paddingTop: 4,
                        }}
                    >
                        <Box
                            sx={{
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "center",
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
                                        width: `${isPageShrunk ? "250px" : "750px"}`,
                                        height: `${isPageShrunk ? "300px" : "450px"}`,
                                        border: "none",
                                        outline: "none",
                                    }}
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
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
                                    justifyContent: "center",
                                    rowGap: 2,
                                }}
                            >
                                <List
                                    sx={{
                                        display: "flex",
                                        flexDirection: "row",
                                        width: "70%",
                                        paddingLeft: 2,
                                    }}
                                >
                                    <ListItem
                                        sx={{
                                            color: colors.greenAccent[500],
                                        }}
                                    >
                                        <Typography component={"span"}>
                                            Duration: {movie.duration}
                                        </Typography>
                                    </ListItem>
                                    <ListItem
                                        sx={{
                                            color: colors.greenAccent[500],
                                        }}
                                    >
                                        <Typography component={"span"}>
                                            Year: {movie.releaseYear}
                                        </Typography>
                                    </ListItem>
                                    <ListItem
                                        sx={{
                                            color: colors.greenAccent[500],
                                            display: "flex",
                                            flexDirection: "row",
                                            columnGap: 1,
                                        }}
                                    >
                                        <ReviewsIcon />
                                        <Typography component={"span"}>Imdb Rating:</Typography>
                                        <Typography component={"span"}>
                                            {movie.ratingImdb === 0 ? "N/A" : movie.ratingImdb}
                                        </Typography>
                                    </ListItem>
                                </List>
                                <Typography textAlign={"center"} color={"secondary"} width={"50%"}>
                                    {movie.description}
                                </Typography>
                                {user?.userName && (
                                    <Button
                                        onClick={() => {
                                            bookmarkMovie();
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
                                columnGap={3}
                                rowGap={3}
                                justifyContent="center"
                                alignContent="center"
                                mt={1}
                                mb={4}
                            >
                                {latestMoviesRelated.slice(5, 10).map((latestMovie: any) => (
                                    <MovieItemLatest
                                        latestMovie={latestMovie}
                                        key={latestMovie.id}
                                    />
                                ))}
                            </Stack>
                        </Box>
                    </Box>
                </motion.div>
            </main>
        </>
    );
}
