import { Box, Button, Typography } from "@mui/material";
import React from "react";
import { useNavigate } from "react-router-dom";
import SEOHelmet from "~/components/seoHelmet/SEOHelmet";

export default function Error404(): React.JSX.Element {
    const navigate = useNavigate();

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
                    rowGap: 1,
                    flexDirection: "column",
                    height: "200vh",
                }}
            >
                <Typography
                    fontSize={60}
                    component={"h1"}
                    letterSpacing={2}
                    color={"secondary"}
                    fontWeight={800}
                >
                    Error 404
                </Typography>
                <Typography fontSize={26} variant="body1">
                    Oops! something went wrong
                </Typography>
                <Typography fontSize={20} variant="body2">
                    We’re sorry, it looks like the page you’re looking for isn’t in our system{" "}
                </Typography>
                <Button
                    onClick={() => {
                        navigate("/");
                    }}
                    color="error"
                    variant="outlined"
                    size="large"
                    sx={{
                        marginTop: 4,
                        padding: 2,
                    }}
                >
                    <Typography component={"span"}>Back To Home</Typography>
                </Button>
            </Box>
        </>
    );
}
