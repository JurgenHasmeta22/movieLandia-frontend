import { Box, CircularProgress, Grid } from "@mui/material";
import React from "react";
import { Outlet } from "react-router-dom";
import { Footer } from "~/components/footer/Footer";
import { Header } from "~/components/header/Header";
import ScrollToTop from "~/components/scrollToTop/scrollToTop";

const MainLayout = () => {
    return (
        <Grid container component={"main"}>
            <Grid item xs={12}>
                <Header />
                <React.Suspense
                    fallback={
                        <Box
                            sx={{
                                display: "flex",
                                placeItems: "center",
                                placeContent: "center",
                                height: "100vh",
                                // minHeight: "calc(100vh - 128px)", // Adjust according to your Header and Footer heights
                            }}
                        >
                            <CircularProgress size={80} thickness={4} />
                        </Box>
                    }
                >
                    <Outlet />
                </React.Suspense>
                <ScrollToTop />
                <Footer />
            </Grid>
        </Grid>
    );
};

export default MainLayout;
