import React from "react";
import { format } from "date-fns";
import { Avatar, Box, Paper, Typography } from "@mui/material";

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
}

const Review: React.FC<ReviewProps> = ({ review }) => {
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
                <Typography variant="body2" color="textSecondary" sx={{ ml: 2 }}>
                    {format(new Date(review.createdAt), "MMMM dd, yyyy HH:mm")}
                </Typography>
            </Box>
            <Typography
                dangerouslySetInnerHTML={{ __html: review.content }}
                sx={{ wordWrap: "break-word" }}
            />
        </Paper>
    );
};

export default Review;
