import { Box, CircularProgress, useTheme } from "@mui/material";
import React from "react";
import { tokens } from "~/utils/theme";

const Loading: React.FC = () => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);

    return (
        <Box
            sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: "100vh",
            }}
        >
            <CircularProgress
                size={80}
                thickness={4}
                sx={{
                    color: colors.primary[100],
                }}
            />
        </Box>
    );
};

export default Loading;
