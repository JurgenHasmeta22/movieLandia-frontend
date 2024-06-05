import { Box, CircularProgress, Grid } from "@mui/material";
import { motion } from "framer-motion";
import React from "react";
import { Outlet } from "react-router-dom";
import Footer from "~/components/footer/Footer";
import Header from "~/components/header/Header";
import ScrollToTop from "~/components/scrollToTop/scrollToTop";
import { ModalProvider } from "~/services/providers/ModalContext";
import { RightPanelProvider } from "~/services/providers/RightPanelContext";

const MainLayout = () => {
    return (
        <RightPanelProvider>
            <ModalProvider>
                <Grid container>
                    <Grid item xs={12} paddingTop={8}>
                        <Header />
                        <React.Suspense
                            fallback={
                                <Box
                                    sx={{
                                        display: "flex",
                                        placeItems: "center",
                                        placeContent: "center",
                                        height: "200vh",
                                    }}
                                >
                                    <CircularProgress size={80} thickness={4} color="secondary" />
                                </Box>
                            }
                        >
                            <main>
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    transition={{ duration: 0.5 }}
                                >
                                    <Outlet />
                                </motion.div>
                            </main>
                        </React.Suspense>
                        <ScrollToTop />
                        <Footer />
                    </Grid>
                </Grid>
            </ModalProvider>
        </RightPanelProvider>
    );
};

export default MainLayout;
