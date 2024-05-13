import { Box, CircularProgress, Grid } from "@mui/material";
import React from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "~/components/admin/sidebar/Sidebar";
import TopBar from "~/components/admin/topBar/TopBar";
import { ModalProvider } from "~/services/providers/ModalContext";
import { RightPanelProvider } from "~/services/providers/RightPanelContext";
import { useStore } from "~/store/store";
import { sidebarItems } from "~/utils/sidebarItems";

const AdminLayout = () => {
    const { isOpenSidebarAdmin } = useStore();

    return (
        <RightPanelProvider>
            <ModalProvider>
                <Grid container component={"main"}>
                    <Grid item xs={12} md={isOpenSidebarAdmin ? 2 : 0}>
                        <Sidebar sidebarItems={sidebarItems} />
                    </Grid>
                    <Grid item xs={12} md={isOpenSidebarAdmin ? 10 : 12}>
                        <TopBar />
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
                                    <CircularProgress size={80} thickness={4} />
                                </Box>
                            }
                        >
                            <Box ml={4}>
                                <Outlet />
                            </Box>
                        </React.Suspense>
                    </Grid>
                </Grid>
            </ModalProvider>
        </RightPanelProvider>
    );
};

export default AdminLayout;
