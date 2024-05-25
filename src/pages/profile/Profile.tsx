import { Box, CircularProgress, Tab, Tabs, Typography, useTheme } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useStore } from "~/store/store";
import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";
import { tokens } from "~/utils/theme";
import TabPanel from "~/components/tab/Tab";
import AboutUsTab from "./aboutUs/About";
import { useState } from "react";
import SEOHelmet from "~/components/seoHelmet/SEOHelmet";
import FavoritesTab from "./favorites/Favorites";

export default function Profile() {
    const [value, setValue] = useState<number>(0);
    const navigate = useNavigate();
    const { user } = useStore();
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);

    const handleChange = (event: any, newValue: any) => {
        if (newValue === 0) {
            navigate("/profile?tab=favMovies");
        } else if (newValue === 1) {
            navigate("/profile?tab=about");
        }

        setValue(newValue);
    };

    if (!user) {
        return (
            <Box
                sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    height: "100vh",
                }}
            >
                <CircularProgress size={80} thickness={4} />
            </Box>
        );
    }

    return (
        <>
            <SEOHelmet
                title="Your Profile - MovieLand24"
                description="View and manage your profile on MovieLand24. Update your preferences, view your watchlist, and more."
                name="MovieLand24"
                type="website"
                canonicalUrl="https://example.com/profile"
            />
            <Box height={"100vh"} component={"main"}>
                <Box
                    display={"flex"}
                    flexDirection={"row"}
                    columnGap={1}
                    justifyContent={"center"}
                    alignItems={"center"}
                    mt={8}
                    mb={4}
                    component={"section"}
                >
                    <PersonOutlinedIcon color="secondary" fontSize="large" />
                    <Typography color={"secondary"} fontWeight={500} fontSize={22}>
                        {user.userName}
                    </Typography>
                </Box>
                <Box component={"section"}>
                    <Tabs
                        value={value}
                        onChange={handleChange}
                        variant="fullWidth"
                        textColor="secondary"
                        orientation="horizontal"
                    >
                        <Tab
                            label="Favorite Movies"
                            style={{
                                backgroundColor: colors.blueAccent[400],
                                color: colors.primary[400],
                                fontWeight: "700",
                            }}
                        />
                        <Tab
                            label="Favorite Series"
                            style={{
                                backgroundColor: colors.blueAccent[400],
                                color: colors.primary[400],
                                fontWeight: "700",
                            }}
                        />
                        <Tab
                            label="About Me"
                            style={{
                                backgroundColor: colors.blueAccent[400],
                                color: colors.primary[400],
                                fontWeight: "700",
                            }}
                        />
                    </Tabs>
                    <TabPanel value={value} index={0}>
                        <FavoritesTab type={"Movies"} />
                    </TabPanel>
                    <TabPanel value={value} index={1}>
                        <FavoritesTab type={"Series"} />
                    </TabPanel>
                    <TabPanel value={value} index={2}>
                        <AboutUsTab />
                    </TabPanel>
                </Box>
            </Box>
        </>
    );
}
