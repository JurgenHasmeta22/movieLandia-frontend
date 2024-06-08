import { useEffect } from "react";
import type IMovie from "~/types/IMovie";
import movieService from "~/services/api/movieService";
import { Box, Container, Divider, Stack, useTheme } from "@mui/material";
import SEOHelmet from "~/components/seoHelmet/SEOHelmet";
import { toast } from "react-toastify";
import { useQuery } from "@tanstack/react-query";
import Error404 from "../error/Error";
import Review from "~/components/review/Review";
import { WarningOutlined, CheckOutlined } from "@mui/icons-material";
import * as CONSTANTS from "~/constants/Constants";
import DetailsPageCard from "~/components/detailsPageCard/DetailsPageCard";
import { useDetailsPageData } from "~/hooks/useDetailsPageData";
import { useDetailsPageFetching } from "~/hooks/useDetailsPageFetching";
import PaginationControl from "~/components/paginationControl/PaginationControl";
import TextEditorForm from "~/components/textEditorForm/TextEditorForm";
import Reviews from "~/components/reviews/Reviews";
import { tokens } from "~/utils/theme";
import ListDetail from "~/components/listDetail/ListDetail";
import Loading from "~/components/loading/Loading";

export default function Movie() {
    // #region "State, refs, hooks, theme"
    const {
        rating,
        setRating,
        review,
        setReview,
        setOpen,
        isEditMode,
        setIsEditMode,
        setIsOpenVotesModal,
        textEditorRef,
        reviewRef,
        params,
        searchParams,
        setSearchParams,
        openModal,
        handleChangeSorting,
        page,
        sortBy,
        ascOrDesc,
        user,
        setUser,
        setSelectedReview,
        upvotesPageModal,
        setUpvotesPageModal,
        setHasMoreUpvotesModal,
        downvotesPageModal,
        setDownvotesPageModal,
        setHasMoreDownvotesModal,
        setListModalDataType,
    } = useDetailsPageData();

    const { fetchDetailData } = useDetailsPageFetching({
        params,
        type: "movie",
        page,
        sortBy,
        ascOrDesc,
    });

    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    // #endregion

    // #region "Data fetching and queries"
    const movieQuery = useQuery({
        queryKey: ["movie", params?.title!, sortBy, ascOrDesc, page, upvotesPageModal, downvotesPageModal],
        queryFn: () => fetchDetailData(),
        refetchOnMount: "always",
    });
    const movie: IMovie = movieQuery?.data! ?? null;

    const latestMoviesQuery = useQuery({
        queryKey: ["latestMovies"],
        queryFn: () => movieService.getLatestMovies(),
    });
    const latestMovies: IMovie[] = latestMoviesQuery?.data! ?? [];

    const relatedMoviesQuery = useQuery({
        queryKey: ["relatedMovies"],
        queryFn: () => movieService.getRelatedMovies(params.title!),
        refetchOnMount: "always",
    });
    const relatedMovies: IMovie[] = relatedMoviesQuery?.data! ?? [];

    const refetchMovieDetails = async () => {
        await movieQuery.refetch();
    };
    // #endregion

    // #region "Pagination"
    const pageCount = Math.ceil(movie?.totalReviews! / 5);
    const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
        searchParams.set("page", String(value));
        setSearchParams(searchParams);
    };
    // #endregion

    // #region "Handlers functions"

    // #region "Bookmarks"
    async function onBookmarkMovie() {
        if (!user || !movie) return;

        try {
            const response = await movieService.addToFavorites(movie?.id!, user?.id);

            if (response && !response.error) {
                setUser(response);
                await refetchMovieDetails();
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
                setUser(response);
                await refetchMovieDetails();
            }
        } catch (error) {
            toast.error("An error occurred while removing the movie from favorites.");
        }
    }
    // #endregion

    // #region "Reviews"
    async function onSubmitReview() {
        if (!user || !movie) return;

        try {
            const response = await movieService.addReview(movie?.id!, user?.id, review, rating);

            if (response && !response.error) {
                setReview("");
                setRating(null);
                await refetchMovieDetails();
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

        openModal({
            onClose: () => setOpen(false),
            title: "Remove Review",
            actions: [
                {
                    label: CONSTANTS.MODAL__DELETE__NO,
                    onClick: () => setOpen(false),
                    color: "secondary",
                    variant: "contained",
                    sx: {
                        bgcolor: "#ff5252",
                    },
                    icon: <WarningOutlined />,
                },
                {
                    label: CONSTANTS.MODAL__DELETE__YES,
                    onClick: async () => {
                        try {
                            const response = await movieService.removeReview(movie?.id!, user?.id);

                            if (response && !response.error) {
                                setReview("");
                                await refetchMovieDetails();
                                toast.success("Review removed successfully!");
                                // handleFocusTextEditor();
                            } else {
                                toast.error("Review removal failed!");
                            }
                        } catch (error) {
                            toast.error("An error occurred while trying to remove the review.");
                        }
                    },
                    type: "submit",
                    color: "secondary",
                    variant: "contained",
                    sx: {
                        bgcolor: "#30969f",
                    },
                    icon: <CheckOutlined />,
                },
            ],
            subTitle: "Are you sure that you want to delete this review ?",
        });
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
                await refetchMovieDetails();
                toast.success("Review updated successfully!");
            } else {
                toast.error("Review updation failed!");
            }
        } catch (error) {
            toast.error("An error occurred while updating the review.");
        }
    }
    // #endregion

    // #region "upvotes, downvotes"
    async function onUpvoteMovie(movieReviewId: number, isAlreadyUpvoted: boolean) {
        if (!user || !movieReviewId) return;

        try {
            if (isAlreadyUpvoted) {
                await movieService.removeUpvoteMovieReview(user?.id, movie?.id, movieReviewId);
                await refetchMovieDetails();
            } else {
                await movieService.removeDownvoteMovieReview(user?.id, movie?.id, movieReviewId);

                const response = await movieService.addUpvoteMovieReview(user?.id, movie?.id, movieReviewId);

                if (response) {
                    await refetchMovieDetails();
                }
            }
        } catch (error) {
            toast.error("An error occurred while adding the upvote to movie review.");
        }
    }

    async function onDownVoteMovie(movieReviewId: number, isAlreadyDownvoted: boolean) {
        if (!user || (!movie && !movieReviewId)) return;

        try {
            if (isAlreadyDownvoted) {
                await movieService.removeDownvoteMovieReview(user?.id, movie?.id, movieReviewId);
                await refetchMovieDetails();
            } else {
                await movieService.removeUpvoteMovieReview(user?.id, movie?.id, movieReviewId);

                const response = await movieService.addDownvoteMovieReview(user?.id, movie?.id, movieReviewId);

                if (response) {
                    await refetchMovieDetails();
                }
            }
        } catch (error) {
            toast.error("An error occurred while adding the downvoted to movie review.");
        }
    }
    // #endregion

    // #region "Modal handlers"
    const handleOpenUpvotesModal = (reviewData: any) => {
        setListModalDataType("upvotes");
        const hasMoreUpvotes = reviewData?._count?.upvotes! !== reviewData?.upvotes?.length;
        setHasMoreUpvotesModal(hasMoreUpvotes);
        setSelectedReview(reviewData);

        openModal({
            onClose: () => handleCloseModal(),
            title: "Users who upvoted this review",
            subTitle: "Users list",
            hasList: true,
        });
    };

    const handleOpenDownvotesModal = (reviewData: any) => {
        setListModalDataType("downvotes");
        const hasMoreDownvotes = reviewData?._count?.downvotes! !== reviewData?.downvotes?.length;
        setHasMoreDownvotesModal(hasMoreDownvotes);
        setSelectedReview(reviewData);

        openModal({
            onClose: () => handleCloseModal(),
            title: "Users who downvoted this review",
            subTitle: "Users list",
            hasList: true,
        });
    };

    const handleCloseModal = () => {
        setIsOpenVotesModal(false);
        setListModalDataType(null);
        setUpvotesPageModal(1);
        setDownvotesPageModal(1);
        setSelectedReview(null);
    };
    // #endregion

    // #region "Focus functions"
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

    useEffect(() => {
        if (isEditMode) {
            handleFocusTextEditor();
        }
    }, [isEditMode]);
    // #endregion

    // #endregion

    // #region "Errors query checking"
    if (movieQuery.isLoading || latestMoviesQuery.isLoading) {
        return (
            <Loading />
        );
    }

    if (movieQuery.isError || movieQuery.data?.error || latestMoviesQuery.isError || latestMoviesQuery.data?.error) {
        return <Error404 />;
    }
    // #endregion

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
                    <DetailsPageCard
                        data={movie}
                        type="movie"
                        isMovieBookmarked={movie.isBookmarked}
                        onBookmarkMovie={onBookmarkMovie}
                        onRemoveBookmarkMovie={onRemoveBookmarkMovie}
                    />
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
                            <Reviews
                                data={movie}
                                sortBy={sortBy!}
                                ascOrDesc={ascOrDesc!}
                                handleChangeSorting={handleChangeSorting}
                            />
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
                                setRating={setRating}
                                handleUpvote={onUpvoteMovie}
                                handleDownvote={onDownVoteMovie}
                                type="movie"
                                data={movie}
                                handleOpenUpvotesModal={handleOpenUpvotesModal}
                                handleOpenDownvotesModal={handleOpenDownvotesModal}
                            />
                        ))}
                        {movie.totalReviews! > 0 && (
                            <PaginationControl
                                currentPage={Number(page)!}
                                pageCount={pageCount}
                                onPageChange={handlePageChange}
                            />
                        )}
                        {user && (!movie.isReviewed || isEditMode) && (
                            <TextEditorForm
                                review={review}
                                setReview={setReview}
                                rating={rating}
                                setRating={setRating}
                                isEditMode={isEditMode}
                                setIsEditMode={setIsEditMode}
                                setOpen={setOpen}
                                textEditorRef={textEditorRef}
                                handleFocusReview={handleFocusReview}
                                onSubmitReview={onSubmitReview}
                                onSubmitUpdateReview={onSubmitUpdateReview}
                            />
                        )}
                    </Box>
                    <ListDetail data={latestMovies} type="movie" role="latest" />
                    <ListDetail data={relatedMovies} type="movie" role="related" />
                </Stack>
            </Container>
        </>
    );
}
