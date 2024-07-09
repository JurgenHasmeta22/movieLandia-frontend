import { Box, Grid } from "@mui/material";
import { motion } from "framer-motion";
import React from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "~/components/admin/sidebar/Sidebar";
import TopBar from "~/components/admin/topBar/TopBar";
import Loading from "~/components/loading/Loading";
import SEOHelmet from "~/components/seoHelmet/SEOHelmet";
import { ModalProvider } from "~/services/providers/ModalContext";
import { RightPanelProvider } from "~/services/providers/RightPanelContext";
import { useStore } from "~/store/store";
import { sidebarItems } from "~/utils/sidebarItems";

const AdminLayout = () => {
    const { isOpenSidebarAdmin } = useStore();

    return (
        <RightPanelProvider>
            <ModalProvider>
                <>
                    <SEOHelmet noIndex />
                    <Grid container component={"main"}>
                        <Grid item xs={12} md={isOpenSidebarAdmin ? 2 : 0}>
                            <Sidebar sidebarItems={sidebarItems} />
                        </Grid>
                        <Grid item xs={12} md={isOpenSidebarAdmin ? 10 : 12}>
                            <TopBar />
                            <React.Suspense fallback={<Loading />}>
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    transition={{ duration: 0.5 }}
                                    style={{ width: "100%" }}
                                >
                                    <Box ml={4}>
                                        <Outlet />
                                    </Box>
                                </motion.div>
                            </React.Suspense>
                        </Grid>
                    </Grid>
                </>
            </ModalProvider>
        </RightPanelProvider>
    );
};

export default AdminLayout;
