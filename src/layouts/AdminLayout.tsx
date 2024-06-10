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
                    <main className="flex w-full">
                        {isOpenSidebarAdmin && (
                            <div className="w-full md:w-1/5">
                                <Sidebar sidebarItems={sidebarItems} />
                            </div>
                        )}
                        <div className={`w-full ${isOpenSidebarAdmin ? "md:w-4/5" : "md:w-full"}`}>
                            <TopBar />
                            <React.Suspense fallback={<Loading />}>
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    transition={{ duration: 0.5 }}
                                    className="w-full"
                                >
                                    <div className="ml-4">
                                        <Outlet />
                                    </div>
                                </motion.div>
                            </React.Suspense>
                        </div>
                    </main>
                </>
            </ModalProvider>
        </RightPanelProvider>
    );
};

export default AdminLayout;
