import { Link, useParams, useSearchParams } from "react-router-dom";
import type ISerie from "~/types/ISerie";
import serieService from "~/services/api/serieService";
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
import { useStore } from "~/store/store";
import CardItem from "~/components/cardItem/CardItem";
import YouTubeIcon from "@mui/icons-material/YouTube";
import BookmarkAddIcon from "@mui/icons-material/BookmarkAdd";
import { useQuery } from "@tanstack/react-query";
import BookmarkRemoveIcon from "@mui/icons-material/BookmarkRemove";
import Error404 from "../error/Error";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import MovieIcon from "@mui/icons-material/Movie";
import "react-quill/dist/quill.snow.css";
import { useEffect, useRef, useState } from "react";
import Review from "~/components/review/Review";
import TextEditor from "~/components/textEditor/TextEditor";

export default function Serie() {
    const [review, setReview] = useState("");
    const [isEditMode, setIsEditMode] = useState(false);
    const textEditorRef = useRef<any>(null);
    const reviewRef = useRef<any>(null);
    const params = useParams();
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const { user, setUser } = useStore();
    const [searchParams, setSearchParams] = useSearchParams();
    const page = searchParams.get("page") || 1;

    const serieQuery = useQuery({
        queryKey: ["serie", params?.title!],
        queryFn: () => serieService.getSerieByTitle(params?.title!, { page: String(page) }),
        refetchOnMount: "always",
        refetchOnWindowFocus: "always",
    });
    const seriesQuery = useQuery({
        queryKey: ["series"],
        queryFn: () => serieService.getSeries({}),
    });
    const isSerieBookmarkedQuery = useQuery({
        queryKey: ["isSerieBookmarked", params?.title!],
        queryFn: () => serieService.isSerieBookmared(params?.title!, user?.id),
        refetchOnMount: "always",
        refetchOnWindowFocus: "always",
    });
    const isSerieReviewedQuery = useQuery({
        queryKey: ["isSerieReviewed", params?.title!],
        queryFn: () => serieService.isSerieReviewed(params?.title!, user?.id),
        refetchOnMount: "always",
        refetchOnWindowFocus: "always",
    });

    const serie: ISerie = serieQuery?.data! ?? null;
    const series: ISerie[] = seriesQuery?.data?.rows ?? [];
    const isSerieBookmarked: boolean = isSerieBookmarkedQuery?.data?.isBookmarked! ?? false;
    const isSerieReviewed: boolean = isSerieReviewedQuery?.data?.isReviewed! ?? false;

    const pageCount = Math.ceil(serie?.reviews?.length! / 10);
    const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
        searchParams.set("page", String(value));
        setSearchParams(searchParams);
    };

    const refetchSerieDetailsAndBookmarkStatus = async () => {
        await Promise.all([
            serieQuery.refetch(),
            isSerieBookmarkedQuery.refetch(),
            isSerieReviewedQuery.refetch(),
        ]);
    };

    async function onBookmarkSerie() {
        if (!user || !serie) return;

        try {
            const response = await serieService.addToFavorites(serie.id, user.id);

            if (response && !response.error) {
                setUser(response);
                await refetchSerieDetailsAndBookmarkStatus();
                toast.success("Serie bookmarked successfully!");
                window.scrollTo(0, 0);
            } else {
                toast.error("Serie not bookmarked successfully!");
            }
        } catch (error) {
            toast.error("An error occurred while adding the serie to favorites.");
        }
    }

    async function onRemoveBookmarkSerie() {
        if (!user || !serie) return;

        try {
            const response = await serieService.removeFromFavorites(serie.id, user.id);

            if (response && !response.error) {
                await refetchSerieDetailsAndBookmarkStatus();
                setUser(response);
                toast.success("Serie unbookmarked successfully!");
                window.scrollTo(0, 0);
            } else {
                toast.error("Serie not unbookmarked successfully!");
            }
        } catch (error) {
            toast.error("An error occurred while removing the serie from favorites.");
        }
    }

    async function onSubmitReview() {
        if (!user || !serie) return;

        try {
            const response = await serieService.addReview(user?.id, serie?.id!, review);

            if (response && !response.error) {
                setReview("");
                await refetchSerieDetailsAndBookmarkStatus();
                toast.success("Review submitted successfully!");
            } else {
                toast.error("Review submission failed!");
            }
        } catch (error) {
            toast.error("An error occurred while submitting the review.");
        }
    }

    async function onSubmitRemoveReview() {
        if (!user || !serie) return;

        try {
            const response = await serieService.removeReview(user?.id, serie?.id!);

            if (response && !response.error) {
                setReview("");
                await refetchSerieDetailsAndBookmarkStatus();
                toast.success("Review removed successfully!");
            } else {
                toast.error("Review removal failed!");
            }
        } catch (error) {
            toast.error("An error occurred while trying to remove the review.");
        }
    }

    async function onSubmitUpdateReview() {
        if (!user || !serie) return;

        try {
            const response = await serieService.updateReview(user?.id, serie?.id!, review);

            if (response && !response.error) {
                setReview("");
                setIsEditMode(false);
                await refetchSerieDetailsAndBookmarkStatus();
                toast.success("Review updated successfully!");
            } else {
                toast.error("Review updation failed!");
            }
        } catch (error) {
            toast.error("An error occurred while updating the review.");
        }
    }

    const handleFocusReview = () => {
        if (reviewRef.current) {
            reviewRef.current.focus();
        }
    };

    const handleFocusTextEditor = () => {
        if (textEditorRef.current) {
            textEditorRef.current.focus();
        }
    };

    useEffect(() => {
        if (isEditMode) {
            handleFocusTextEditor();
        }
    }, [isEditMode]);

    if (serieQuery.isLoading || seriesQuery.isLoading) {
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
        serieQuery.isError ||
        serieQuery.data?.error ||
        seriesQuery.isError ||
        seriesQuery.data?.error ||
        isSerieBookmarkedQuery.isError
    ) {
        return <Error404 />;
    }

    return (
        <>
            <SEOHelmet
                title={`Watch ${serie?.title} on SerieLand24`}
                description={`${serie?.title}`}
                name="SerieLand24"
                type="article"
                canonicalUrl={`https://example.com/series/${serie?.title}`}
            />
            <Container>
                <Stack flexDirection={"column"} rowGap={4}>
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
                            <Box>
                                <img
                                    src={serie.photoSrc}
                                    alt={serie.title}
                                    style={{ width: 220, height: "auto" }}
                                />
                            </Box>
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
                                    {serie.title}
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
                                    {serie.genres?.map((genre: any, index: number) => (
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
                                            {index < serie.genres!.length - 1 && (
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
                                        <CalendarMonthIcon fontSize="large" />
                                        <Typography component={"span"} paddingLeft={1}>
                                            {serie.releaseYear}
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
                                                {serie.ratingImdb !== 0
                                                    ? `${serie.ratingImdb}`
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
                                    {serie.description}
                                </Typography>
                                <Button
                                    href={serie.trailerSrc}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    color="secondary"
                                    variant="contained"
                                    sx={{
                                        display: "flex",
                                        flexDirection: "row",
                                        columnGap: 1,
                                        width: "30%",
                                        placeSelf: "center",
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
                                            if (!isSerieBookmarked) {
                                                await onBookmarkSerie();
                                            } else {
                                                await onRemoveBookmarkSerie();
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
                                        {!isSerieBookmarked ? (
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
                                            {isSerieBookmarked ? "Bookmarked" : "Bookmark"}
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
                            mb: serie.reviews?.length! > 0 ? 4 : 0,
                        }}
                    >
                        {serie.reviews?.length! > 0 && (
                            <Typography fontSize={22} color={"secondary"} textAlign={"center"}>
                                Reviews
                            </Typography>
                        )}
                        {serie.reviews?.map((review: any, index: number) => (
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
                        {serie.reviews?.length! > 0 && (
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
                        {user && (!isSerieReviewed || isEditMode) && (
                            <Box marginTop={4}>
                                <TextEditor
                                    value={review}
                                    onChange={setReview}
                                    ref={textEditorRef}
                                />
                                {!isEditMode ? (
                                    <Box display={"flex"} justifyContent={"end"} mt={2}>
                                        <Button
                                            onClick={onSubmitReview}
                                            color="error"
                                            variant="contained"
                                            sx={{
                                                display: "flex",
                                                placeSelf: "end",
                                                fontSize: 16,
                                                fontWeight: 700,
                                                padding: 1,
                                                mt: 6,
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
                                                fontSize: 16,
                                                fontWeight: 700,
                                                padding: 1,
                                                mt: 6,
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
                                                fontSize: 16,
                                                fontWeight: 700,
                                                padding: 1,
                                                mt: 6,
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
                            marginTop: 2,
                            height: "100vh",
                        }}
                        component={"section"}
                    >
                        <Typography fontSize={22} color={"secondary"} textAlign={"center"}>
                            Latest Series
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
                            {series.slice(5, 10).map((latestSerie: any) => (
                                <CardItem data={latestSerie} key={latestSerie.id} type={"serie"} />
                            ))}
                        </Stack>
                    </Box>
                </Stack>
            </Container>
        </>
    );
}
