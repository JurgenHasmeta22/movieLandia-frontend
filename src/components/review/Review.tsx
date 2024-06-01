import React, { Dispatch, SetStateAction, forwardRef, useEffect } from "react";
import { format } from "date-fns";
import { Avatar, Box, Paper, Typography, IconButton, useTheme, Rating } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import EditIcon from "@mui/icons-material/Edit";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import ThumbDownIcon from "@mui/icons-material/ThumbDown";
import { useStore } from "~/store/store";
import { tokens } from "~/utils/theme";
import movieService from "~/services/api/movieService";
import { useQuery } from "@tanstack/react-query";
import serieService from "~/services/api/serieService";
import { toast } from "react-toastify";

interface ReviewProps {
    review: {
        id: number;
        content: string;
        createdAt: string;
        updatedAt: string;
        rating: number;
        user: {
            userName: string;
            avatar: string;
        };
    };
    handleRemoveReview: () => void;
    handleFocusTextEditor: () => void;
    setRating: React.Dispatch<React.SetStateAction<number | null>>;
    ref: any;
    setIsEditMode: Dispatch<SetStateAction<boolean>>;
    isEditMode: boolean;
    setReview: React.Dispatch<React.SetStateAction<string>>;
    handleUpvote: (reviewId: number) => void;
    handleDownvote: (reviewId: number) => void;
    type: string;
    data: any;
}

// Define the rating labels and colors
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
        },
        ref,
    ) => {
        const { user } = useStore();
        const theme = useTheme();
        const colors = tokens(theme.palette.mode);
        const { label, color } = getRatingLabelAndColor(review.rating);

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

        useEffect(() => {
            if (type === "movie") {
                isMovieReviewUpvotedOrDownvotedQuery.refetch();
            } else if (type === "serie") {
                isSerieReviewUpvotedOrDownvotedQuery.refetch();
            }
        }, [data, review]);

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
                    }}
                >
                    <IconButton
                        size="medium"
                        disabled={user && review.user.userName !== user?.userName ? false : true}
                        onClick={async () => {
                            if (
                                type === "movie" &&
                                isMovieReviewUpvotedOrDownvoted &&
                                isMovieReviewUpvotedOrDownvoted.isUpvoted
                            ) {
                                const response = await movieService.removeUpvoteMovieReview(
                                    user?.id,
                                    data?.id,
                                    review.id,
                                );

                                if (response) {
                                    toast.success("Upvote removed successfully!");
                                }

                                isMovieReviewUpvotedOrDownvotedQuery.refetch();
                            } else if (
                                type === "serie" &&
                                isSerieReviewUpvotedOrDownvoted &&
                                isSerieReviewUpvotedOrDownvoted.isUpvoted
                            ) {
                                const response = await serieService.removeUpvoteSerieReview(
                                    user?.id,
                                    data?.id,
                                    review.id,
                                );

                                if (response) {
                                    toast.success("Upvote removed successfully!");
                                }

                                isSerieReviewUpvotedOrDownvotedQuery.refetch();
                            } else {
                                handleUpvote(review.id);
                            }
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
                    <IconButton
                        size="medium"
                        disabled={user && review.user.userName !== user?.userName ? false : true}
                        onClick={async () => {
                            if (
                                type === "movie" &&
                                isMovieReviewUpvotedOrDownvoted &&
                                isMovieReviewUpvotedOrDownvoted.isDownvoted
                            ) {
                                const response = await movieService.removeDownvoteMovieReview(
                                    user?.id,
                                    data?.id,
                                    review.id,
                                );

                                if (response) {
                                    toast.success("Downvoted removed successfully!");
                                }

                                isMovieReviewUpvotedOrDownvotedQuery.refetch();
                            } else if (
                                type === "serie" &&
                                isSerieReviewUpvotedOrDownvoted &&
                                isSerieReviewUpvotedOrDownvoted.isDownvoted
                            ) {
                                const response = await serieService.removeDownvoteSerieReview(
                                    user?.id,
                                    data?.id,
                                    review.id,
                                );

                                if (response) {
                                    toast.success("Downvoted removed successfully!");
                                }

                                isSerieReviewUpvotedOrDownvotedQuery.refetch();
                            } else {
                                handleDownvote(review.id);
                            }
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
                </Box>
            </Paper>
        );
    },
);

export default Review;
