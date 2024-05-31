import React, { Dispatch, SetStateAction } from "react";
import { format } from "date-fns";
import { Avatar, Box, Paper, Typography, IconButton, useTheme } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useStore } from "~/store/store";
import { tokens } from "~/utils/theme";
import EditIcon from "@mui/icons-material/Edit";

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
    setIsEditMode: Dispatch<SetStateAction<boolean>>;
    isEditMode: boolean;
    setReview: React.Dispatch<React.SetStateAction<string>>;
}

const Review: React.FC<ReviewProps> = ({
    review,
    handleRemoveReview,
    isEditMode,
    setIsEditMode,
    setReview,
}) => {
    const { user } = useStore();
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);

    return (
        <Paper key={review.id} sx={{ p: 2, mt: 2, backgroundColor: `${colors.primary[400]}` }}>
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
                                    ? colors.greenAccent[500]
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
                        {format(new Date(review.createdAt), "MMMM dd, yyyy HH:mm")}
                    </Typography>
                    {review.user.userName === user?.userName && !isEditMode && (
                        <IconButton
                            size="medium"
                            onClick={() => {
                                setIsEditMode(true);
                                setReview(review.content);
                            }}
                        >
                            <EditIcon fontSize="medium" />
                        </IconButton>
                    )}
                    {review.user.userName === user?.userName && (
                        <IconButton size="medium" onClick={() => handleRemoveReview()}>
                            <CloseIcon fontSize="medium" />
                        </IconButton>
                    )}
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
