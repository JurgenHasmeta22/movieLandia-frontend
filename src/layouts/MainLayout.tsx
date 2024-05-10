import { Box, CircularProgress, CssBaseline, Grid } from "@mui/material";
import React from "react";
import { Outlet } from "react-router-dom";
import { Footer } from "~/components/footer/Footer";
import { Header } from "~/components/header/Header";
import ScrollToTop from "~/components/scrollToTop/scrollToTop";

const MainLayout = () => {
    return (
        <React.Fragment>
            <CssBaseline />
            <Grid container>
                <Grid item xs={12}>
                    <Header />
                    <React.Suspense
                        fallback={
                            <Box
                                sx={{
                                    display: "flex",
                                    placeItems: "center",
                                    height: "100vh",
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
        </React.Fragment>
    );
};

export default MainLayout;
