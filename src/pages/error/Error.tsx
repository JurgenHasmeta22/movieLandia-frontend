import { Box, Typography } from "@mui/material";
import React from "react";
import { Helmet } from "react-helmet-async";

export default function Error404(): React.JSX.Element {
    return (
        <>
            <Helmet>
                <title>Page Not Found | Error: Invalid URL</title>
                <meta
                    name="description"
                    content="Oops! You've entered an incorrect URL. The page you're looking for does not exist."
                />
                <meta name="robots" content="noindex" />
            </Helmet>
            <Box
                sx={{
                    display: "flex",
                    placeItems: "center",
                    placeContent: "center",
                    height: "70vh",
                }}
            >
                <Typography fontSize={32}>Error 404</Typography>
            </Box>
        </>
    );
}
