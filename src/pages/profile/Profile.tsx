import { Box, CircularProgress, Stack, Tab, Tabs, Typography, useTheme } from "@mui/material";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useStore } from "~/store/store";
import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";
import { tokens } from "~/utils/theme";
import TabPanel from "~/components/tab/Tab";
import SEOHelmet from "~/components/seoHelmet/SEOHelmet";
import FavoritesTab from "~/components/favorites/Favorites";
import EmailIcon from "@mui/icons-material/Email";

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
            <Stack flexDirection="row" width="100%" padding={8} columnGap={4}>
                <Stack
                    component="section"
                    sx={{
                        width: "30%",
                        backgroundColor: `${colors.primary[400]}`,
                        borderRadius: "22px",
                        padding: 4,
                        display: "flex",
                        flexDirection: "column",
                        boxShadow: 6,
                        rowGap: 2,
                    }}
                >
                    <Box
                        sx={{
                            display: "flex",
                            flexDirection: "row",
                            justifyContent: "start",
                            alignItems: "center",
                        }}
                    >
                        <PersonOutlinedIcon color="secondary" fontSize="large" />
                        <Typography
                            color="secondary"
                            fontWeight={500}
                            fontSize={16}
                            component={"span"}
                        >
                            {user.userName}
                        </Typography>
                    </Box>
                    <Box
                        sx={{
                            display: "flex",
                            flexDirection: "row",
                            justifyContent: "start",
                            alignItems: "center",
                            columnGap: 0.5,
                        }}
                    >
                        <EmailIcon color="secondary" fontSize="large" />
                        <Typography
                            color="secondary"
                            fontWeight={500}
                            fontSize={16}
                            component={"span"}
                        >
                            {user.email}
                        </Typography>
                    </Box>
                    <Box>
                        <Typography
                            color="secondary"
                            fontWeight={500}
                            fontSize={16}
                            component={"span"}
                        >
                            Favorite Movies: {user.favMovies?.length}
                        </Typography>
                    </Box>
                    <Box>
                        <Typography
                            color="secondary"
                            fontWeight={500}
                            fontSize={16}
                            component={"span"}
                        >
                            Favorite Series: {user.favSeries?.length}
                        </Typography>
                    </Box>
                </Stack>
                <Box
                    component="section"
                    sx={{
                        width: "70%",
                        backgroundColor: colors.primary[400],
                        borderRadius: "22px",
                        padding: 4,
                        boxShadow: 6,
                    }}
                >
                    <Tabs
                        value={tabValue}
                        onChange={handleChange}
                        variant="fullWidth"
                        orientation="horizontal"
                    >
                        <Tab
                            label="Favorite Movies"
                            tabIndex={0}
                            sx={{
                                backgroundColor: colors.blueAccent[700],
                                color: colors.primary[100],
                                fontWeight: "600",
                                fontSize: 14,
                                textTransform: "capitalize",
                            }}
                        />
                        <Tab
                            label="Favorite Series"
                            tabIndex={1}
                            sx={{
                                backgroundColor: colors.blueAccent[700],
                                color: colors.primary[100],
                                fontWeight: "600",
                                fontSize: 14,
                                textTransform: "capitalize",
                            }}
                        />
                    </Tabs>
                    <TabPanel value={tabValue} index={0}>
                        <FavoritesTab type={"Movies"} />
                    </TabPanel>
                    <TabPanel value={tabValue} index={1}>
                        <FavoritesTab type={"Series"} />
                    </TabPanel>
                </Box>
            </Stack>
        </>
    );
}
