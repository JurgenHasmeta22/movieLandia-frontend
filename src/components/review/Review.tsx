import React from "react";
import { format } from "date-fns";
import { Avatar, Box, Paper, Typography, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

interface ReviewProps {
    review: {
        id: number;
        content: string;
        createdAt: string;
        user: {
            userName: string;
            avatar: string;
        };
    };
    handleRemoveReview: () => void;
}

const Review: React.FC<ReviewProps> = ({ review, handleRemoveReview }) => {
    return (
        <Paper key={review.id} sx={{ p: 2, mt: 2 }}>
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
                    <Typography variant="h6" sx={{ ml: 2 }}>
                        {review.user.userName}
                    </Typography>
                </Box>
                <Box sx={{ display: "flex", alignItems: "center" }}>
                    <Typography variant="body2" color="textSecondary" sx={{ mr: 1 }}>
                        {format(new Date(review.createdAt), "MMMM dd, yyyy HH:mm")}
                    </Typography>
                    <IconButton size="small" onClick={() => handleRemoveReview()}>
                        <CloseIcon fontSize="small" />
                    </IconButton>
                </Box>
            </Box>
            <Typography
                dangerouslySetInnerHTML={{ __html: review.content }}
                sx={{ wordWrap: "break-word" }}
            />
        </Paper>
    );
};

export default Review;
