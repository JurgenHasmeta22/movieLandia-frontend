import { useNavigate, useParams } from "react-router-dom";
import { useStore } from "~/store/store";
import type IMovie from "~/types/IMovie";
import movieService from "~/services/api/movieService";
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
import SEOHelmet from "~/components/seoHelmet/SEOHelmet";
import { toast } from "react-toastify";
import CardItem from "~/components/cardItem/CardItem";
import YouTubeIcon from "@mui/icons-material/YouTube";
import BookmarkIcon from "@mui/icons-material/Bookmark";
import { useQuery } from "@tanstack/react-query";

export default function Movie() {
    const params = useParams();
    const navigate = useNavigate();
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const { user, setUser } = useStore();

    const movieQuery = useQuery({
        queryKey: ["movie", params.title],
        queryFn: () => movieService.getMovieByTitle(params.title),
    });
    const latestMoviesQuery = useQuery({
        queryKey: ["latestMovies"],
        queryFn: () => movieService.getLatestMovies(),
    });
    const movie: IMovie = movieQuery?.data! ?? null;
    const latestMovies: IMovie[] = latestMoviesQuery?.data! ?? [];

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

    if (movieQuery.isLoading || latestMoviesQuery.isLoading) {
        return (
            <Box
                sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    height: "100vh",
                }}
            >
                <CircularProgress size={80} thickness={4} color="secondary" />
            </Box>
        );
    }

    if (movieQuery.isError || latestMoviesQuery.isError) {
        return (
            <Box
                sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    height: "100vh",
                }}
            >
                <Typography variant="h1">An Error occurred the server is down!</Typography>
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
                <Box
                    sx={{
                        display: "flex",
                        flexDirection: "column",
                    }}
                >
                    <Box
                        sx={{
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            justifyContent: "center",
                            height: "auto",
                            width: "100%",
                            pt: 8,
                            pb: 4,
                        }}
                        component={"section"}
                    >
                        <Box
                            sx={{
                                display: "flex",
                                flexDirection: "row",
                                flexWrap: "wrap",
                                alignItems: "center",
                                justifyContent: "center",
                                height: "100%",
                                width: "90%",
                                columnGap: 6,
                                padding: 6,
                                backgroundColor: `${colors.primary[400]}`,
                            }}
                        >
                            <img
                                src={movie.photoSrc}
                                alt={movie.title}
                                style={{ width: 220, height: "auto" }}
                            />
                            <Box
                                sx={{
                                    display: "flex",
                                    flexDirection: "column",
                                }}
                            >
                                <Typography
                                    fontSize={36}
                                    color={"secondary"}
                                    textAlign={"center"}
                                    component={"h1"}
                                >
                                    {movie.title}
                                </Typography>
                                <List
                                    sx={{
                                        display: "flex",
                                        flexDirection: "row",
                                        placeSelf: "center",
                                    }}
                                >
                                    <ListItem
                                        sx={{
                                            color: colors.greenAccent[500],
                                        }}
                                    >
                                        <Typography component={"span"} width={"20ch"}>
                                            Duration: {movie.duration}
                                        </Typography>
                                    </ListItem>
                                    <ListItem
                                        sx={{
                                            color: colors.greenAccent[500],
                                        }}
                                    >
                                        <Typography component={"span"}>
                                            Release Year: {movie.releaseYear}
                                        </Typography>
                                    </ListItem>
                                    <ListItem
                                        sx={{
                                            color: colors.greenAccent[500],
                                            display: "flex",
                                            flexDirection: "row",
                                            columnGap: 0.5,
                                        }}
                                    >
                                        <Box
                                            display="flex"
                                            flexDirection="row"
                                            columnGap={0.5}
                                            alignItems={"center"}
                                            justifyContent={"start"}
                                        >
                                            <img
                                                src="/assets/icons/imdb.svg"
                                                alt="IMDb Icon"
                                                style={{ width: "35px", height: "35px" }}
                                            />
                                            <Typography
                                                color={"secondary"}
                                                fontSize={12}
                                                component="span"
                                            >
                                                {movie.ratingImdb !== 0
                                                    ? `${movie.ratingImdb}`
                                                    : "N/A"}
                                            </Typography>
                                        </Box>
                                    </ListItem>
                                </List>
                                <Typography
                                    textAlign={"center"}
                                    color={"secondary"}
                                    width={["50ch", "60ch", "70ch", "80ch"]}
                                >
                                    {movie.description}
                                </Typography>
                                <Button
                                    href={movie.trailerSrc}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    color="secondary"
                                    variant="contained"
                                    sx={{
                                        display: "flex",
                                        flexDirection: "row",
                                        placeSelf: "center",
                                        width: "30%",
                                        columnGap: 1,
                                        marginTop: 1,
                                    }}
                                >
                                    <YouTubeIcon color="error" />
                                    <Typography
                                        component={"span"}
                                        color={colors.primary[600]}
                                        fontWeight={700}
                                        sx={{
                                            textTransform: "capitalize",
                                        }}
                                    >
                                        Watch Trailer
                                    </Typography>
                                </Button>
                                {user?.userName && (
                                    <Button
                                        onClick={() => {
                                            bookmarkMovie();
                                        }}
                                        color="secondary"
                                        variant="contained"
                                        sx={{
                                            display: "flex",
                                            placeSelf: "center",
                                            width: "30%",
                                            columnGap: 1,
                                            marginTop: 1,
                                        }}
                                    >
                                        <BookmarkIcon color={"error"}></BookmarkIcon>
                                        <Typography
                                            component={"span"}
                                            sx={{
                                                textTransform: "capitalize",
                                            }}
                                            color={"primary"}
                                            fontWeight={700}
                                        >
                                            Bookmark
                                        </Typography>
                                    </Button>
                                )}
                            </Box>
                        </Box>
                    </Box>
                    <Box
                        sx={{
                            display: "flex",
                            flexDirection: "column",
                            rowGap: 2,
                            marginBottom: 2,
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
                            {latestMovies.slice(5, 10).map((latestMovie: any) => (
                                <CardItem data={latestMovie} key={latestMovie.id} type="movie" />
                            ))}
                        </Stack>
                    </Box>
                </Box>
            </main>
        </>
    );
}
