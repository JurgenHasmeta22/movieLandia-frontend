import { Box, CircularProgress, List, ListItem, Typography } from "@mui/material";
import { Outlet, useNavigate } from "react-router-dom";
import { useStore } from "~/store/zustand/store";
import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";

export default function Profile() {
    const navigate = useNavigate();
    const { user } = useStore();

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
        <Box>
            <Box>
                <Box>
                    <PersonOutlinedIcon color="action" fontSize="large" />
                    <Typography>{user.userName}</Typography>
                </Box>
            </Box>
            <Box>
                <List>
                    <ListItem
                        onClick={() => {
                            navigate("/profile/favoriteMovies");
                        }}
                    >
                        Favorite Movies
                    </ListItem>
                    <ListItem
                        onClick={() => {
                            navigate("/profile/aboutUs");
                        }}
                    >
                        About Channel
                    </ListItem>
                </List>
                <Outlet />
            </Box>
        </Box>
    );
}
