import { useParams, useSearchParams } from "react-router-dom";
import type ISerie from "~/types/ISerie";
import serieService from "~/services/api/serieService";
import {
    Box,
    CircularProgress,
    Container,
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
import { useQuery } from "@tanstack/react-query";
import Error404 from "../error/Error";
import "react-quill/dist/quill.snow.css";
import { useEffect, useRef, useState } from "react";
import Review from "~/components/review/Review";
import TextEditor from "~/components/textEditor/TextEditor";
import { useModal } from "~/services/providers/ModalContext";
import { WarningOutlined, CheckOutlined } from "@mui/icons-material";
import * as CONSTANTS from "~/constants/Constants";
import SortSelect from "~/components/sortSelect/SortSelect";
import { useSorting } from "~/hooks/useSorting";
import DetailsPageCard from "~/components/detailsPageCard/DetailsPageCard";
import { TextEditorButtons } from "~/components/textEditorButtons/TextEditorButtons";

export default function Serie() {
    // #region "State, refs, hooks, theme"
    const [review, setReview] = useState<string>("");
    const [rating, setRating] = useState<number | null>(0);
    const [open, setOpen] = useState<boolean>(false);
    const [isEditMode, setIsEditMode] = useState<boolean>(false);
    const [openVotesModal, setIsOpenVotesModal] = useState(false);

    const textEditorRef = useRef<any>(null);
    const reviewRef = useRef<any>(null);

    const params = useParams();

    const {
        user,
        setUser,
        selectedReview,
        setSelectedReview,
        upvotesPageModal,
        setUpvotesPageModal,
        setHasMoreUpvotesModal,
        downvotesPageModal,
        setDownvotesPageModal,
        setHasMoreDownvotesModal,
        listModalDataType,
        setListModalDataType,
    } = useStore();

    const [searchParams, setSearchParams] = useSearchParams();
    const { openModal } = useModal();

    const theme = useTheme();
    const colors = tokens(theme.palette.mode);

    const handleChangeSorting = useSorting();
    const page = searchParams.get("page") || 1;
    const sortBy = searchParams.get("sortBy");
    const ascOrDesc = searchParams.get("ascOrDesc");
    // #endregion

    // #region "Data fetching and queries"
    const fetchSerie = async () => {
        let response;
        const queryParams: Record<string, string | number> = { page };

        if (sortBy) {
            queryParams.sortBy = sortBy;
        }

        if (ascOrDesc) {
            queryParams.ascOrDesc = ascOrDesc;
        }

        if (upvotesPageModal !== 1) {
            queryParams.upvotesPage = upvotesPageModal;
        }

        if (downvotesPageModal !== 1) {
            queryParams.downvotesPage = downvotesPageModal;
        }

        response = await serieService.getSerieByTitle(params?.title!, queryParams);

        if (selectedReview) {
            const reviewItem = response?.reviews?.find(
                (item: any) => item.id === selectedReview.id,
            );

            if (reviewItem) {
                if (listModalDataType === "upvotes") {
                    const hasMoreUpvotes =
                        reviewItem?._count?.upvotes! !== reviewItem?.upvotes?.length;

                    setHasMoreUpvotesModal(hasMoreUpvotes);
                    setSelectedReview(reviewItem);
                } else if (listModalDataType === "downvotes") {
                    const hasMoreDownvotes =
                        reviewItem?._count?.downvotes! !== reviewItem?.downvotes?.length;

                    setHasMoreDownvotesModal(hasMoreDownvotes);
                    setSelectedReview(reviewItem);
                }
            }
        }

        return response;
    };

    const serieQuery = useQuery({
        queryKey: [
            "serie",
            params?.title!,
            sortBy,
            ascOrDesc,
            page,
            upvotesPageModal,
            downvotesPageModal,
        ],
        queryFn: () => fetchSerie(),
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
    // #endregion

    // #region "Pagination"
    const pageCount = Math.ceil(serie?.totalReviews! / 5);

    const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
        searchParams.set("page", String(value));
        setSearchParams(searchParams);
    };
    // #endregion

    // #region "Handlers functions"
    const refetchSerieDetailsAndBookmarkStatus = async () => {
        await Promise.all([
            serieQuery.refetch(),
            isSerieBookmarkedQuery.refetch(),
            isSerieReviewedQuery.refetch(),
        ]);
    };

    // #region "Bookmark"
    async function onBookmarkSerie() {
        if (!user || !serie) return;

        try {
            const response = await serieService.addToFavorites(serie.id, user.id);

            if (response && !response.error) {
                setUser(response);
                await refetchSerieDetailsAndBookmarkStatus();
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
                                await refetchSerieDetailsAndBookmarkStatus();
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
                await refetchSerieDetailsAndBookmarkStatus();
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
                await refetchSerieDetailsAndBookmarkStatus();
            } else {
                await serieService.removeDownvoteSerieReview(user?.id, serie?.id, serieReviewId);

                const response = await serieService.addUpvoteSerieReview(
                    user?.id,
                    serie?.id,
                    serieReviewId,
                );

                if (response) {
                    await refetchSerieDetailsAndBookmarkStatus();
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
                await refetchSerieDetailsAndBookmarkStatus();
            } else {
                await serieService.removeUpvoteSerieReview(user?.id, serie?.id, serieReviewId);

                const response = await serieService.addDownvoteSerieReview(
                    user?.id,
                    serie?.id,
                    serieReviewId,
                );

                if (response) {
                    await refetchSerieDetailsAndBookmarkStatus();
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
                        isSerieBookmarked={isSerieBookmarked}
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
                            <Stack
                                flexDirection={"row"}
                                justifyContent={"space-between"}
                                alignItems={"center"}
                            >
                                <Box>
                                    <Typography
                                        fontSize={28}
                                        color={"secondary"}
                                        textAlign={"center"}
                                    >
                                        Reviews ({serie.totalReviews})
                                    </Typography>
                                </Box>
                                <Box>
                                    <SortSelect
                                        sortBy={searchParams.get("sortBy")}
                                        ascOrDesc={searchParams.get("ascOrDesc")}
                                        onChange={handleChangeSorting}
                                        type="details"
                                    />
                                </Box>
                            </Stack>
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
                                <Box marginBottom={1}>
                                    <TextEditor
                                        value={review}
                                        onChange={setReview}
                                        ref={textEditorRef}
                                        rating={rating}
                                        setRating={setRating}
                                    />
                                </Box>
                                <TextEditorButtons
                                    isEditMode={isEditMode}
                                    setOpen={setOpen}
                                    setIsEditMode={setIsEditMode}
                                    setReview={setReview}
                                    onSubmitReview={onSubmitReview}
                                    handleFocusReview={handleFocusReview}
                                    onSubmitUpdateReview={onSubmitUpdateReview}
                                />
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
                            // height: "100vh", breaks layout in mobile footer gets up
                        }}
                        component={"section"}
                    >
                        <Typography fontSize={28} color={"secondary"} textAlign={"center"}>
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
                            {series.slice(5, 10).map((latestSerie: any, index: number) => (
                                <CardItem data={latestSerie} key={index} type={"serie"} />
                            ))}
                        </Stack>
                    </Box>
                </Stack>
            </Container>
        </>
    );
}
