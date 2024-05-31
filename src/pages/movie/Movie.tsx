import { useEffect, useRef, useState } from "react";
import { Link, useParams, useSearchParams } from "react-router-dom";
import { useStore } from "~/store/store";
import type IMovie from "~/types/IMovie";
import movieService from "~/services/api/movieService";
import {
    Box,
    Button,
    CircularProgress,
    Container,
    Divider,
    List,
    ListItem,
    Pagination,
    Stack,
    Typography,
    useTheme,
} from "@mui/material";
import { tokens } from "~/utils/theme";
import SEOHelmet from "~/components/seoHelmet/SEOHelmet";
import { toast } from "react-toastify";
import CardItem from "~/components/cardItem/CardItem";
import YouTubeIcon from "@mui/icons-material/YouTube";
import BookmarkAddIcon from "@mui/icons-material/BookmarkAdd";
import { useQuery } from "@tanstack/react-query";
import BookmarkRemoveIcon from "@mui/icons-material/BookmarkRemove";
import Error404 from "../error/Error";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import MovieIcon from "@mui/icons-material/Movie";
import Review from "~/components/review/Review";
import TextEditor from "~/components/textEditor/TextEditor";

export default function Movie() {
    // #region "State, refs, hooks, theme"
    const [review, setReview] = useState("");
    const [rating, setRating] = useState<number | null>(0);
    const [isEditMode, setIsEditMode] = useState(false);
    const textEditorRef = useRef<any>(null);
    const reviewRef = useRef<any>(null);

    const params = useParams();
    const { user, setUser } = useStore();
    const [searchParams, setSearchParams] = useSearchParams();
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    // #endregion

    // #region "Data fetching and queries"
    const movieQuery = useQuery({
        queryKey: ["movie", params?.title!],
        queryFn: () => movieService.getMovieByTitle(params?.title!, { page: String(page) }),
        refetchOnMount: "always",
        refetchOnWindowFocus: "always",
    });
    const latestMoviesQuery = useQuery({
        queryKey: ["latestMovies"],
        queryFn: () => movieService.getLatestMovies(),
    });
    const isMovieBookmarkedQuery = useQuery({
        queryKey: ["isMovieBookmarked", params?.title!],
        queryFn: () => movieService.isMovieBookmared(params?.title!, user?.id!),
        refetchOnMount: "always",
        refetchOnWindowFocus: "always",
    });
    const isMovieReviewedQuery = useQuery({
        queryKey: ["isMovieReviewed", params?.title!],
        queryFn: () => movieService.isMovieReviewed(params?.title!, user?.id!),
        refetchOnMount: "always",
        refetchOnWindowFocus: "always",
    });

    const movie: IMovie = movieQuery?.data! ?? null;
    const latestMovies: IMovie[] = latestMoviesQuery?.data! ?? [];
    const isMovieBookmarked: boolean = isMovieBookmarkedQuery?.data?.isBookmarked! ?? false;
    const isMovieReviewed: boolean = isMovieReviewedQuery?.data?.isReviewed! ?? false;
    // #endregion

    // #region "Pagination"
    const page = searchParams.get("page") || 1;
    const pageCount = Math.ceil(movie?.reviews?.length! / 10);
    const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
        searchParams.set("page", String(value));
        setSearchParams(searchParams);
    };
    // #endregion

    // #region "Handlers functions"
    const refetchMovieDetailsAndBookmarkStatus = async () => {
        await Promise.all([
            movieQuery.refetch(),
            isMovieBookmarkedQuery.refetch(),
            isMovieReviewedQuery.refetch(),
        ]);
    };

    async function onBookmarkMovie() {
        if (!user || !movie) return;

        try {
            const response = await movieService.addToFavorites(movie?.id!, user?.id);

            if (response && !response.error) {
                setUser(response);
                await refetchMovieDetailsAndBookmarkStatus();
                toast.success("Movie bookmarked successfully!");
                window.scrollTo(0, 0);
            } else {
                toast.error("Movie not bookmarked successfully!");
            }
        } catch (error) {
            toast.error("An error occurred while adding the movie to favorites.");
        }
    }

    async function onRemoveBookmarkMovie() {
        if (!user || !movie) return;

        try {
            const response = await movieService.removeFromFavorites(movie?.id!, user?.id);

            if (response && !response.error) {
                await refetchMovieDetailsAndBookmarkStatus();
                setUser(response);
                toast.success("Movie unbookmarked successfully!");
                window.scrollTo(0, 0);
            } else {
                toast.error("Movie not unbookmarked successfully!");
            }
        } catch (error) {
            toast.error("An error occurred while removing the movie from favorites.");
        }
    }

    async function onSubmitReview() {
        if (!user || !movie) return;

        try {
            const response = await movieService.addReview(movie?.id!, user?.id, review, rating);

            if (response && !response.error) {
                setReview("");
                setRating(null)
                await refetchMovieDetailsAndBookmarkStatus();
                toast.success("Review submitted successfully!");
            } else {
                toast.error("Review submission failed!");
            }
        } catch (error) {
            toast.error("An error occurred while submitting the review.");
        }
    }

    async function onSubmitRemoveReview() {
        if (!user || !movie) return;

        try {
            const response = await movieService.removeReview(movie?.id!, user?.id);

            if (response && !response.error) {
                setReview("");
                await refetchMovieDetailsAndBookmarkStatus();
                toast.success("Review removed successfully!");
            } else {
                toast.error("Review removal failed!");
            }
        } catch (error) {
            toast.error("An error occurred while trying to remove the review.");
        }
    }

    async function onSubmitUpdateReview() {
        if (!user || !movie) return;

        try {
            const response = await movieService.updateReview(movie?.id!, user?.id, review, rating);

            if (response && !response.error) {
                setReview("");
                setRating(null);
                setIsEditMode(false);
                handleFocusReview();
                await refetchMovieDetailsAndBookmarkStatus();
                toast.success("Review updated successfully!");
            } else {
                toast.error("Review updation failed!");
            }
        } catch (error) {
            toast.error("An error occurred while updating the review.");
        }
    }

    const handleFocusTextEditor = () => {
        if (textEditorRef.current) {
            textEditorRef.current.focus();
        }
    };

    const handleFocusReview = () => {
        if (reviewRef.current) {
            reviewRef.current.focus();
        }
    };
    // #endregion

    useEffect(() => {
        if (isEditMode) {
            handleFocusTextEditor();
        }
    }, [isEditMode]);

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

    if (
        movieQuery.isError ||
        movieQuery.data?.error ||
        latestMoviesQuery.isError ||
        latestMoviesQuery.data?.error
    ) {
        return <Error404 />;
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
            <Container>
                <Stack flexDirection={"column"} rowGap={4}>
                    <Box
                        sx={{
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            justifyContent: "center",
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
                                    fontSize={24}
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
                                        placeItems: "center",
                                    }}
                                >
                                    <MovieIcon fontSize="large" color="secondary" />
                                    {movie.genres?.map((genre: any, index: number) => (
                                        <>
                                            <ListItem
                                                sx={{
                                                    color: colors.greenAccent[500],
                                                }}
                                                key={index}
                                            >
                                                <Link
                                                    to={`/genres/${genre.genre.name}`}
                                                    style={{
                                                        textDecoration: "none",
                                                        color: colors.primary[200],
                                                        fontSize: 15,
                                                    }}
                                                >
                                                    <Typography component={"span"}>
                                                        {genre.genre.name}
                                                    </Typography>
                                                </Link>
                                            </ListItem>
                                            {index < movie.genres!.length - 1 && (
                                                <Divider
                                                    orientation="vertical"
                                                    flexItem
                                                    color="error"
                                                />
                                            )}
                                        </>
                                    ))}
                                </List>
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
                                        <AccessTimeIcon fontSize="large" />
                                        <Typography
                                            component={"span"}
                                            width={"8ch"}
                                            paddingLeft={1}
                                        >
                                            {movie.duration}
                                        </Typography>
                                    </ListItem>
                                    <ListItem
                                        sx={{
                                            color: colors.greenAccent[500],
                                        }}
                                    >
                                        <CalendarMonthIcon fontSize="large" />
                                        <Typography component={"span"} paddingLeft={1}>
                                            {movie.releaseYear}
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
                                    width={["40ch", "60ch", "70ch", "80ch"]}
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
                                        marginTop: 3,
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
                                        onClick={async () => {
                                            if (!isMovieBookmarked) {
                                                await onBookmarkMovie();
                                            } else {
                                                await onRemoveBookmarkMovie();
                                            }
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
                                        {!isMovieBookmarked ? (
                                            <BookmarkAddIcon color="success" />
                                        ) : (
                                            <BookmarkRemoveIcon color="error" />
                                        )}
                                        <Typography
                                            component="span"
                                            sx={{
                                                textTransform: "capitalize",
                                            }}
                                            color="primary"
                                            fontWeight={700}
                                        >
                                            {isMovieBookmarked ? "Bookmarked" : "Bookmark"}
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
                            mb: movie.reviews?.length! > 0 ? 4 : 0,
                        }}
                        component={"section"}
                    >
                        {movie.reviews?.length! > 0 && (
                            <Typography fontSize={22} color={"secondary"} textAlign={"center"}>
                                Reviews
                            </Typography>
                        )}
                        {movie.reviews?.map((review: any, index: number) => (
                            <Review
                                key={index}
                                review={review}
                                handleRemoveReview={onSubmitRemoveReview}
                                isEditMode={isEditMode}
                                setIsEditMode={setIsEditMode}
                                setReview={setReview}
                                handleFocusTextEditor={handleFocusTextEditor}
                                ref={reviewRef}
                            />
                        ))}
                        {movie.reviews?.length! > 0 && (
                            <Stack
                                spacing={2}
                                sx={{
                                    display: "flex",
                                    placeItems: "center",
                                    marginTop: 2,
                                    marginBottom: 4,
                                }}
                            >
                                <Pagination
                                    page={
                                        searchParams.get("page")
                                            ? Number(searchParams.get("page"))
                                            : 1
                                    }
                                    size="large"
                                    count={pageCount}
                                    showFirstButton
                                    showLastButton
                                    onChange={handlePageChange}
                                    color="secondary"
                                />
                            </Stack>
                        )}
                        {user && (!isMovieReviewed || isEditMode) && (
                            <Box marginTop={4}>
                                <Box marginBottom={1}>
                                    <TextEditor
                                        value={review}
                                        onChange={setReview}
                                        ref={textEditorRef}
                                        rating={rating}
                                        setRating={setRating}
                                    />
                                </Box>
                                {!isEditMode ? (
                                    <Box display={"flex"} justifyContent={"end"} mt={2}>
                                        <Button
                                            onClick={onSubmitReview}
                                            color="error"
                                            variant="contained"
                                            sx={{
                                                display: "flex",
                                                placeSelf: "end",
                                                fontSize: 18,
                                                fontWeight: 900,
                                                padding: 1.5,
                                                textTransform: "capitalize",
                                            }}
                                        >
                                            <Typography component={"span"}>
                                                Submit Review
                                            </Typography>
                                        </Button>
                                    </Box>
                                ) : (
                                    <Box
                                        display={"flex"}
                                        flexDirection={"row"}
                                        columnGap={1}
                                        justifyContent={"end"}
                                        alignItems={"center"}
                                        marginTop={2}
                                    >
                                        <Button
                                            onClick={() => {
                                                setIsEditMode(false);
                                                setReview("");
                                                handleFocusReview();
                                            }}
                                            color="error"
                                            variant="contained"
                                            sx={{
                                                display: "flex",
                                                placeSelf: "end",
                                                fontSize: 18,
                                                fontWeight: 900,
                                                padding: 1.5,
                                                textTransform: "capitalize",
                                            }}
                                        >
                                            <Typography component={"span"}>
                                                Discard Changes
                                            </Typography>
                                        </Button>
                                        <Button
                                            onClick={onSubmitUpdateReview}
                                            color="error"
                                            variant="contained"
                                            sx={{
                                                display: "flex",
                                                placeSelf: "end",
                                                fontSize: 18,
                                                fontWeight: 900,
                                                padding: 1.5,
                                                textTransform: "capitalize",
                                            }}
                                        >
                                            <Typography component={"span"}>Save Changes</Typography>
                                        </Button>
                                    </Box>
                                )}
                            </Box>
                        )}
                    </Box>
                    <Box
                        sx={{
                            display: "flex",
                            flexDirection: "column",
                            rowGap: 2,
                            marginBottom: 2,
                            // height: "100vh",
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
                </Stack>
            </Container>
        </>
    );
}
