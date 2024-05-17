import { Box, Typography } from "@mui/material";
import React from "react";
import SEOHelmet from "~/components/seoHelmet/SEOHelmet";

export default function Error404(): React.JSX.Element {
    return (
        <>
            <SEOHelmet
                title={"Page Not Found | Error: Invalid URL"}
                description={
                    "Oops! You've entered an incorrect URL. The page you're looking for does not exist."
                }
            />
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
