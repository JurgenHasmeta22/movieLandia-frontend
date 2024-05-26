import { Box, CircularProgress, Grid } from "@mui/material";
import { motion } from "framer-motion";
import React from "react";
import { Outlet } from "react-router-dom";
import Footer from "~/components/footer/Footer";
import Header from "~/components/header/Header";
import ScrollToTop from "~/components/scrollToTop/scrollToTop";

const MainLayout = () => {
    return (
        <Grid container component={"main"}>
            <Grid item xs={12} paddingTop={8}>
                <Header />
                <React.Suspense
                    fallback={
                        <Box
                            sx={{
                                display: "flex",
                                placeItems: "center",
                                placeContent: "center",
                                height: "100vh",
                            }}
                        >
                            <CircularProgress size={80} thickness={4} color="secondary" />
                        </Box>
                    }
                >
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 20 }}
                        transition={{ duration: 0.5 }}
                        style={{ width: "100%" }}
                    >
                        <Outlet />
                    </motion.div>
                </React.Suspense>
                <ScrollToTop />
                <Footer />
            </Grid>
        </Grid>
    );
};

export default MainLayout;
