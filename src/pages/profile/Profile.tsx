import { Box, CircularProgress, Tab, Tabs, Typography, useTheme } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useStore } from "~/store/store";
import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";
import { tokens } from "~/utils/theme";
import TabPanel from "~/components/tab/Tab";
import FavoriteMoviesTab from "./favoriteMovies/FavoriteMovies";
import AboutUsTab from "./aboutUs/AboutUs";
import { useState } from "react";

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
        <Box height={"70vh"} component={"main"}>
            <Box
                display={"flex"}
                flexDirection={"row"}
                columnGap={1}
                justifyContent={"center"}
                alignItems={"center"}
                mt={4}
                mb={4}
                component={"section"}
            >
                <PersonOutlinedIcon color="secondary" fontSize="large" />
                <Typography color={"primary"} fontWeight={500} fontSize={22}>
                    {user.userName}
                </Typography>
            </Box>
            <Box component={"section"}>
                <Tabs
                    value={value}
                    onChange={handleChange}
                    variant="fullWidth"
                    textColor="primary"
                    orientation="horizontal"
                >
                    <Tab
                        label="Favorite Movies"
                        style={{
                            backgroundColor: colors.blueAccent[400],
                            color: colors.primary[600],
                            fontWeight: "700",
                        }}
                    />
                    <Tab
                        label="About me"
                        style={{
                            backgroundColor: colors.blueAccent[400],
                            color: colors.primary[600],
                            fontWeight: "700",
                        }}
                    />
                </Tabs>
                <TabPanel value={value} index={0}>
                    <FavoriteMoviesTab />
                </TabPanel>
                <TabPanel value={value} index={1}>
                    <AboutUsTab />
                </TabPanel>
            </Box>
        </Box>
    );
}
