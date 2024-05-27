import { Box, CircularProgress, Tab, Tabs, Typography, useTheme } from "@mui/material";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useStore } from "~/store/store";
import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";
import { tokens } from "~/utils/theme";
import TabPanel from "~/components/tab/Tab";
import AboutUsTab from "./aboutUs/About";
import SEOHelmet from "~/components/seoHelmet/SEOHelmet";
import FavoritesTab from "~/components/favorites/Favorites";

export default function Profile() {
    const [searchParams, setSearchParams] = useSearchParams();
    const navigate = useNavigate();
    const { user } = useStore();
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const tabValue =
        searchParams?.get("tab")! === "favMovies"
            ? 0
            : searchParams?.get("tab")! === "favSeries"
              ? 1
                : 0;

    const handleChange = (event: any, newValue: number) => {
        if (newValue === 0) {
            navigate("/profile?tab=favMovies");
        } else if (newValue === 1) {
            navigate("/profile?tab=favSeries");
        }
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
                <CircularProgress size={80} thickness={4} color="secondary" />
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
            <Box height={"100%"} component={"main"}>
                <Box
                    display={"flex"}
                    flexDirection={"row"}
                    columnGap={1}
                    justifyContent={"center"}
                    alignItems={"center"}
                    mt={8}
                    component={"section"}
                >
                    <PersonOutlinedIcon color="secondary" fontSize="large" />
                    <Typography color={"secondary"} fontWeight={500} fontSize={22}>
                        {user.userName}
                    </Typography>
                </Box>
                <Box component={"section"} marginTop={4} marginBottom={2}>
                    <Tabs
                        value={searchParams?.get("tab")! === "favMovies"}
                        onChange={handleChange}
                        variant="fullWidth"
                        orientation="horizontal"
                        sx={{
                            borderBottom: `2px solid ${colors.greenAccent[200]}`,
                        }}
                    >
                        <Tab
                            label="Favorite Movies"
                            tabIndex={0}
                            sx={{
                                backgroundColor: colors.blueAccent[400],
                                color: colors.primary[400],
                                fontWeight: "600",
                                fontSize: 14,
                                textTransform: "capitalize",
                                borderBottom: `${searchParams?.get("tab") === "favMovies" ? "4px solid" : "0px"}`,
                            }}
                        />
                        <Tab
                            label="Favorite Series"
                            tabIndex={1}
                            sx={{
                                backgroundColor: colors.blueAccent[400],
                                color: colors.primary[400],
                                fontWeight: "600",
                                fontSize: 14,
                                textTransform: "capitalize",
                                borderBottom: `${searchParams?.get("tab") === "favSeries" ? "4px solid" : "0px"}`,
                            }}
                        />
                    </Tabs>
                    <TabPanel value={tabValue} index={0} key={0}>
                        <FavoritesTab type={"Movies"} key={"0"} />
                    </TabPanel>
                    <TabPanel value={tabValue} index={1} key={1}>
                        <FavoritesTab type={"Series"} key={"1"} />
                    </TabPanel>
                </Box>
            </Box>
        </>
    );
}
