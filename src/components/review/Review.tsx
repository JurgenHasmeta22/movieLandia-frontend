import React, { Dispatch, SetStateAction, forwardRef } from "react";
import { format } from "date-fns";
import { Avatar, Box, Paper, Typography, IconButton, useTheme, Rating } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useStore } from "~/store/store";
import { tokens } from "~/utils/theme";
import EditIcon from "@mui/icons-material/Edit";

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
}

const Review = forwardRef<HTMLElement, ReviewProps>(
    ({ review, handleRemoveReview, isEditMode, setIsEditMode, setReview, setRating }, ref) => {
        const { user } = useStore();
        const theme = useTheme();
        const colors = tokens(theme.palette.mode);

        return (
            <Paper
                key={review.id}
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
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                        <Avatar alt={review.user.userName} src={review.user.avatar} />
                        <Typography
                            variant="h6"
                            sx={{
                                ml: 2,
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
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                        <Typography variant="body2" color="secondary" sx={{ mr: 1 }}>
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
                        justifyContent: "flex-end",
                        mt: 3,
                    }}
                >
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
            </Paper>
        );
    },
);

export default Review;
