import { Box, List, ListItem, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useStore } from "~/store/zustand/store";

export default function FavoriteMoviesTab() {
    const navigate = useNavigate();
    const { user } = useStore();

    return (
        <Box component={"section"}>
            <h3>Bookmarked movies</h3>
            <Box>
                <List>
                    {user?.favMovies!.map((movie: any) => (
                        <ListItem
                            key={movie.id}
                            onClick={function () {
                                navigate(
                                    `/movies/${movie.title
                                        .split("")
                                        .map((char: any) => (char === " " ? "-" : char))
                                        .join("")}`,
                                );
                                window.scroll(0, 0);
                            }}
                        >
                            <img src={movie.photoSrc} />
                            <Typography>Movie title: {movie.title}</Typography>
                            <Typography>Release year: {movie.releaseYear}</Typography>
                        </ListItem>
                    ))}
                </List>
            </Box>
        </Box>
    );
}
