import type ISerie from "~/types/ISerie";
import serieService from "~/services/api/serieService";
import { Box, CircularProgress, Container, Stack } from "@mui/material";
import SEOHelmet from "~/components/seoHelmet/SEOHelmet";
import { toast } from "react-toastify";
import { useQuery } from "@tanstack/react-query";
import Error404 from "../error/Error";
import "react-quill/dist/quill.snow.css";
import { useEffect } from "react";
import Review from "~/components/review/Review";
import { WarningOutlined, CheckOutlined } from "@mui/icons-material";
import * as CONSTANTS from "~/constants/Constants";
import DetailsPageCard from "~/components/detailsPageCard/DetailsPageCard";
import { useDetailsPageData } from "~/hooks/useDetailsPageData";
import { useDetailsPageFetching } from "~/hooks/useDetailsPageFetching";
import PaginationControl from "~/components/paginationControl/PaginationControl";
import TextEditorForm from "~/components/textEditorForm/TextEditorForm";
import Reviews from "~/components/reviews/Reviews";
import LatestListDetail from "~/components/latestListDetail/LatestListDetail";

export default function Serie() {
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
        type: "serie",
        page,
        sortBy,
        ascOrDesc,
    });
    // #endregion

    // #region "Data fetching and queries"
    const serieQuery = useQuery({
        queryKey: ["serie", params?.title!, sortBy, ascOrDesc, page, upvotesPageModal, downvotesPageModal],
        queryFn: () => fetchDetailData(),
        refetchOnMount: "always",
    });
    const serie: ISerie = serieQuery?.data! ?? null;

    const latestSeriesQuery = useQuery({
        queryKey: ["latestSeries"],
        queryFn: () => serieService.getLatestSeries(),
    });
    const latestSeries: ISerie[] = latestSeriesQuery?.data! ?? [];

    const refetchSerieDetails = async () => {
        await serieQuery.refetch();
    };
    // #endregion

    // #region "Pagination"
    const pageCount = Math.ceil(serie?.totalReviews! / 5);
    const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
        searchParams.set("page", String(value));
        setSearchParams(searchParams);
    };
    // #endregion

    // #region "Handlers functions"

    // #region "Bookmark"
    async function onBookmarkSerie() {
        if (!user || !serie) return;

        try {
            const response = await serieService.addToFavorites(serie.id, user.id);

            if (response && !response.error) {
                setUser(response);
                refetchSerieDetails();
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
                setUser(response);
                refetchSerieDetails();
            }
        } catch (error) {
            toast.error("An error occurred while removing the serie from favorites.");
        }
    }
    // #endregion

    // #region "Reviews"
    async function onSubmitReview() {
        if (!user || !serie) return;

        try {
            const response = await serieService.addReview(user?.id, serie?.id!, review, rating);

            if (response && !response.error) {
                setReview("");
                setRating(null);
                await refetchSerieDetails();
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
                            const response = await serieService.removeReview(user?.id, serie?.id!);

                            if (response && !response.error) {
                                setReview("");
                                await refetchSerieDetails();
                                toast.success("Review removed successfully!");
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
        if (!user || !serie) return;

        try {
            const response = await serieService.updateReview(user?.id, serie?.id!, review, rating);

            if (response && !response.error) {
                setReview("");
                setRating(null);
                setIsEditMode(false);
                handleFocusReview();
                await refetchSerieDetails();
                toast.success("Review updated successfully!");
            } else {
                toast.error("Review updation failed!");
            }
        } catch (error) {
            toast.error("An error occurred while updating the review.");
        }
    }
    // #endregion

    // #region "Upvotes, Downvotes"
    async function onUpvoteSerie(serieReviewId: number, isAlreadyUpvoted: boolean) {
        if (!user || !serieReviewId) return;

        try {
            if (isAlreadyUpvoted) {
                await serieService.removeUpvoteSerieReview(user?.id, serie?.id, serieReviewId);
                await refetchSerieDetails();
            } else {
                await serieService.removeDownvoteSerieReview(user?.id, serie?.id, serieReviewId);

                const response = await serieService.addUpvoteSerieReview(user?.id, serie?.id, serieReviewId);

                if (response) {
                    await refetchSerieDetails();
                }
            }
        } catch (error) {
            toast.error("An error occurred while adding the upvote to movie review.");
        }
    }
    async function onDownVoteSerie(serieReviewId: number, isAlreadyDownvoted: boolean) {
        if (!user || (!serie && !serieReviewId)) return;

        try {
            if (isAlreadyDownvoted) {
                await serieService.removeDownvoteSerieReview(user?.id, serie?.id, serieReviewId);
                await refetchSerieDetails();
            } else {
                await serieService.removeUpvoteSerieReview(user?.id, serie?.id, serieReviewId);

                const response = await serieService.addDownvoteSerieReview(user?.id, serie?.id, serieReviewId);

                if (response) {
                    await refetchSerieDetails();
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
    // #endregion

    // #endregion

    // #region "Errors query checking"
    if (serieQuery.isLoading || latestSeriesQuery.isLoading) {
        return (
            <Box
                sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    height: "200vh",
                }}
            >
                <CircularProgress size={80} thickness={4} color="secondary" />
            </Box>
        );
    }

    if (serieQuery.isError || serieQuery.data?.error || latestSeriesQuery.isError || latestSeriesQuery.data?.error) {
        return <Error404 />;
    }
    // #endregion

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
                    <DetailsPageCard
                        data={serie}
                        type="serie"
                        isSerieBookmarked={serie.isBookmarked}
                        onBookmarkSerie={onBookmarkSerie}
                        onRemoveBookmarkSerie={onRemoveBookmarkSerie}
                    />
                    <Box
                        sx={{
                            display: "flex",
                            flexDirection: "column",
                            rowGap: 2,
                            mb: serie.reviews?.length! > 0 ? 4 : 0,
                        }}
                    >
                        {serie.reviews?.length! > 0 && (
                            <Reviews
                                data={serie}
                                sortBy={sortBy!}
                                ascOrDesc={ascOrDesc!}
                                handleChangeSorting={handleChangeSorting}
                            />
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
                                setRating={setRating}
                                handleUpvote={onUpvoteSerie}
                                handleDownvote={onDownVoteSerie}
                                type="serie"
                                data={serie}
                                handleOpenUpvotesModal={handleOpenUpvotesModal}
                                handleOpenDownvotesModal={handleOpenDownvotesModal}
                            />
                        ))}
                        {serie.totalReviews! > 0 && (
                            <PaginationControl
                                currentPage={Number(page)!}
                                pageCount={pageCount}
                                onPageChange={handlePageChange}
                            />
                        )}
                        {user && (!serie.isReviewed || isEditMode) && (
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
                    <LatestListDetail data={latestSeries} type="serie" />
                </Stack>
            </Container>
        </>
    );
}
