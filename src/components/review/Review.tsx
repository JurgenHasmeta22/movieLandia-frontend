import React, { Dispatch, SetStateAction, forwardRef, useEffect, useState } from "react";
import { format } from "date-fns";
import {
    Avatar,
    Box,
    Paper,
    Typography,
    IconButton,
    useTheme,
    Rating,
    Button,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import EditIcon from "@mui/icons-material/Edit";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import ThumbDownIcon from "@mui/icons-material/ThumbDown";
import { useStore } from "~/store/store";
import { tokens } from "~/utils/theme";
import movieService from "~/services/api/movieService";
import { QueryObserverResult, useQuery } from "@tanstack/react-query";
import serieService from "~/services/api/serieService";
import { useModal } from "~/services/providers/ModalContext";
import { motion } from "framer-motion";

interface ReviewProps {
    review: {
        id: number;
        content: string;
        createdAt: string;
        updatedAt: string;
        rating: number;
        upvotes: any[];
        downvotes: any[];
        _count: {
            upvotes: number;
            downvotes: number;
        };
        user: {
            userName: string;
            avatar: string;
        };
    };
    setRating: React.Dispatch<React.SetStateAction<number | null>>;
    ref: any;
    setIsEditMode: Dispatch<SetStateAction<boolean>>;
    isEditMode: boolean;
    setReview: React.Dispatch<React.SetStateAction<string>>;
    type: string;
    data: any;
    handleRemoveReview: () => void;
    handleFocusTextEditor: () => void;
    handleUpvote: (reviewId: number, isAlreadyUpvotedOrDownvoted: boolean) => void;
    handleDownvote: (reviewId: number, isAlreadyUpvotedOrDownvoted: boolean) => void;
    handleOpenUpvotesModal: (review: any) => void;
    handleOpenDownvotesModal: (review: any) => void;
}

const getRatingLabelAndColor = (rating: number) => {
    if (rating <= 2) return { label: "Very Bad", color: "error.main" };
    if (rating <= 4) return { label: "Bad", color: "warning.main" };
    if (rating <= 6) return { label: "Average", color: "info.main" };
    if (rating <= 8) return { label: "Good", color: "success.light" };
    return { label: "Very Good", color: "success.main" };
};

const Review = forwardRef<HTMLElement, ReviewProps>(
    (
        {
            review,
            handleRemoveReview,
            isEditMode,
            setIsEditMode,
            setReview,
            setRating,
            handleUpvote,
            handleDownvote,
            type,
            data,
            handleOpenUpvotesModal,
            handleOpenDownvotesModal,
        },
        ref,
    ) => {
        // #region "State, hooks, theme"
        const [open, setOpen] = useState(false);
        const [isClickedUpvote, setIsClickedUpvote] = useState(false);
        const [isClickedDownvote, setIsClickedDownvote] = useState(false);

        const { user } = useStore();
        const { openModal } = useModal();

        const theme = useTheme();
        const colors = tokens(theme.palette.mode);
        const { label, color } = getRatingLabelAndColor(review.rating);
        // #endregion

        // #region "Data manipulation, fetching, queries"
        let isMovieReviewUpvotedOrDownvotedQuery: any;
        let isSerieReviewUpvotedOrDownvotedQuery: any;

        if (type === "movie") {
            isMovieReviewUpvotedOrDownvotedQuery = useQuery({
                queryKey: ["isMovieReviewUpvotedOrDownvoted", data, review],
                queryFn: () =>
                    movieService.isMovieReviewUpvotedOrDownvoted(user?.id!, data.id, review.id),
                refetchOnMount: "always",
                refetchOnWindowFocus: "always",
            });
        } else if (type === "serie") {
            isSerieReviewUpvotedOrDownvotedQuery = useQuery({
                queryKey: ["isSerieReviewUpvotedOrDownvoted", data, review],
                queryFn: () =>
                    serieService.isSerieReviewUpvotedOrDownvoted(user?.id!, data.id, review.id),
                refetchOnMount: "always",
                refetchOnWindowFocus: "always",
            });
        }

        const isSerieReviewUpvotedOrDownvoted: any =
            isSerieReviewUpvotedOrDownvotedQuery?.data! ?? null;
        const isMovieReviewUpvotedOrDownvoted: any =
            isMovieReviewUpvotedOrDownvotedQuery?.data! ?? null;
        // #endregion

        // #region "Event handlers"
        async function onClickUpvotesReviewList() {
            handleOpenUpvotesModal(review);
        }

        async function onClickDownvotesReviewList() {
            handleOpenDownvotesModal(review);
        }

        async function handleClickUpVoteReview() {
            setIsClickedUpvote(true);

            if (
                type === "movie" &&
                isMovieReviewUpvotedOrDownvoted &&
                isMovieReviewUpvotedOrDownvoted.isUpvoted
            ) {
                handleUpvote(review.id, true);
                isMovieReviewUpvotedOrDownvotedQuery.refetch();
            } else if (
                type === "serie" &&
                isSerieReviewUpvotedOrDownvoted &&
                isSerieReviewUpvotedOrDownvoted.isUpvoted
            ) {
                handleUpvote(review.id, true);
                isSerieReviewUpvotedOrDownvotedQuery.refetch();
            } else {
                handleUpvote(review.id, false);
            }

            setTimeout(() => {
                setIsClickedUpvote(false);
            }, 300);
        }

        async function handleClickDownVoteReview() {
            setIsClickedDownvote(true);

            if (
                type === "movie" &&
                isMovieReviewUpvotedOrDownvoted &&
                isMovieReviewUpvotedOrDownvoted.isDownvoted
            ) {
                handleDownvote(review.id, true);
                isMovieReviewUpvotedOrDownvotedQuery.refetch();
            } else if (
                type === "serie" &&
                isSerieReviewUpvotedOrDownvoted &&
                isSerieReviewUpvotedOrDownvoted.isDownvoted
            ) {
                handleDownvote(review.id, true);
                isSerieReviewUpvotedOrDownvotedQuery.refetch();
            } else {
                handleDownvote(review.id, false);
            }

            setTimeout(() => {
                setIsClickedDownvote(false);
            }, 300);
        }
        // #endregion

        return (
            <Paper
                sx={{
                    p: 2,
                    mt: 2,
                    backgroundColor:
                        review.user.userName === user?.userName
                            ? colors.redAccent[700]
                            : colors.primary[400],
                }}
            >
                <Box
                    sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        mb: 1,
                    }}
                >
                    <Box
                        sx={{
                            display: "flex",
                            alignItems: "center",
                            flexWrap: "wrap",
                            gap: 1,
                        }}
                    >
                        <Avatar alt={review.user.userName} src={review.user.avatar} />
                        <Typography
                            variant="h6"
                            sx={{
                                color:
                                    review.user.userName === user?.userName
                                        ? colors.blueAccent[200]
                                        : colors.primary[100],
                                fontWeight: review.user.userName === user?.userName ? 900 : 300,
                                letterSpacing: 1,
                            }}
                        >
                            {review.user.userName}
                        </Typography>
                        {review.user.userName === user?.userName && (
                            <Typography
                                component={"span"}
                                paddingLeft={1}
                                sx={{
                                    color: colors.greenAccent[500],
                                }}
                            >
                                - You
                            </Typography>
                        )}
                    </Box>
                    <Box
                        sx={{
                            display: "flex",
                            alignItems: "center",
                            flexWrap: "wrap",
                            gap: 1,
                        }}
                    >
                        <Typography
                            variant="body2"
                            color="secondary"
                            sx={{ display: "flex", flexWrap: "wrap" }}
                        >
                            {review.updatedAt && (
                                <Typography component={"span"} color={"error"}>
                                    Edited
                                </Typography>
                            )}
                            {!review.updatedAt ? (
                                format(new Date(review.createdAt), "MMMM dd, yyyy HH:mm")
                            ) : (
                                <Typography component={"span"} paddingLeft={1}>
                                    {format(new Date(review.updatedAt), "MMMM dd, yyyy HH:mm")}
                                </Typography>
                            )}
                        </Typography>
                        {review.user.userName === user?.userName && !isEditMode && (
                            <IconButton
                                size="medium"
                                onClick={() => {
                                    setIsEditMode(true);
                                    setReview(review.content);
                                    setRating(review.rating);
                                    // handleFocusTextEditor();
                                }}
                            >
                                <EditIcon fontSize="medium" />
                            </IconButton>
                        )}
                        {review.user.userName === user?.userName && (
                            <Box ref={ref} tabIndex={-1}>
                                <IconButton size="medium" onClick={() => handleRemoveReview()}>
                                    <CloseIcon fontSize="medium" />
                                </IconButton>
                            </Box>
                        )}
                    </Box>
                </Box>
                <Typography
                    dangerouslySetInnerHTML={{ __html: review.content }}
                    sx={{
                        wordWrap: "break-word",
                        "& img": { maxWidth: "70%", height: "auto" },
                    }}
                />
                <Box
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        mt: 1,
                    }}
                >
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                        <Typography
                            variant="body2"
                            fontSize={14}
                            fontWeight={900}
                            sx={{ mr: 1, color }}
                        >
                            {label}
                        </Typography>
                    </Box>
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                        <Typography
                            variant="body2"
                            color="secondary"
                            fontSize={14}
                            fontWeight={700}
                            sx={{ mr: 1 }}
                        >
                            {review?.rating?.toFixed(1)}
                        </Typography>
                        <Rating
                            name={`review-rating-${review.id}`}
                            value={review?.rating!}
                            readOnly
                            max={10}
                            precision={0.5}
                        />
                    </Box>
                </Box>
                <Box
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        mt: 1,
                        columnGap: 4,
                    }}
                >
                    <Box display={"flex"} alignItems={"center"} columnGap={1}>
                        <motion.div
                            whileTap={{ scale: 0.9 }}
                            animate={isClickedUpvote ? { rotate: 360, scale: [1, 1.5, 1] } : {}}
                            transition={{ duration: 0.5, ease: "easeInOut" }}
                        >
                            <IconButton
                                size="medium"
                                disabled={
                                    user && review.user.userName !== user?.userName ? false : true
                                }
                                onClick={async () => {
                                    handleClickUpVoteReview();
                                }}
                                sx={{
                                    color:
                                        (type === "movie" &&
                                            isMovieReviewUpvotedOrDownvoted &&
                                            isMovieReviewUpvotedOrDownvoted.isUpvoted) ||
                                        (type === "serie" &&
                                            isSerieReviewUpvotedOrDownvoted &&
                                            isSerieReviewUpvotedOrDownvoted.isUpvoted)
                                            ? colors.greenAccent[700]
                                            : colors.primary[100],
                                }}
                            >
                                <ThumbUpIcon fontSize="medium" />
                            </IconButton>
                        </motion.div>
                        <Button
                            disabled={review?.upvotes?.length === 0}
                            onClick={() => {
                                onClickUpvotesReviewList();
                            }}
                            color={"secondary"}
                            sx={{
                                "&:hover": {
                                    backgroundColor: "transparent",
                                },
                            }}
                        >
                            <Typography>{review._count.upvotes}</Typography>
                        </Button>
                    </Box>
                    <Box display={"flex"} alignItems={"center"} columnGap={1}>
                        <motion.div
                            whileTap={{ scale: 0.9 }}
                            animate={isClickedDownvote ? { rotate: 360, scale: [1, 1.2, 1] } : {}}
                            transition={{ duration: 0.5, ease: "easeInOut" }}
                        >
                            <IconButton
                                size="medium"
                                disabled={
                                    user && review.user.userName !== user?.userName ? false : true
                                }
                                onClick={async () => {
                                    handleClickDownVoteReview();
                                }}
                                sx={{
                                    color:
                                        (type === "movie" &&
                                            isMovieReviewUpvotedOrDownvoted &&
                                            isMovieReviewUpvotedOrDownvoted.isDownvoted) ||
                                        (type === "serie" &&
                                            isSerieReviewUpvotedOrDownvoted &&
                                            isSerieReviewUpvotedOrDownvoted.isDownvoted)
                                            ? colors.redAccent[700]
                                            : colors.primary[100],
                                }}
                            >
                                <ThumbDownIcon fontSize="medium" />
                            </IconButton>
                        </motion.div>
                        <Button
                            disabled={review?.downvotes?.length === 0}
                            onClick={() => {
                                onClickDownvotesReviewList();
                            }}
                            color={"error"}
                            sx={{
                                "&:hover": {
                                    backgroundColor: "transparent",
                                },
                            }}
                        >
                            <Typography>{review._count.downvotes}</Typography>
                        </Button>
                    </Box>
                </Box>
            </Paper>
        );
    },
);

export default Review;
