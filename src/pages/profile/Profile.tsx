import { Box, List, ListItem, Typography } from "@mui/material";
import { Outlet, useNavigate, useParams } from "react-router-dom";
import { useStore } from "~/store/zustand/store";

export default function Profile() {
    const navigate = useNavigate();
    const params = useParams();

    const { user } = useStore();

    if (!user) {
        return <Box className="loading-wrapper">...</Box>;
    }

    return (
        <main>
            <section>
                <Box>
                    <Box>
                        <img src="/assets/avatars/blankavatar.jpg" />
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
            </section>
        </main>
    );
}
