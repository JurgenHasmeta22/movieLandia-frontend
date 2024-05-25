import { Box, Stack, Typography } from "@mui/material";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useStore } from "~/store/store";

export default function FavoriteMoviesTab() {
    const navigate = useNavigate();
    const { user } = useStore();

    return (
        <Box component={"section"}>
            <Typography variant="h2">Bookmarked Movies</Typography>
            <Stack flexDirection={"row"} flexWrap={"wrap"} columnGap={3} rowGap={3} mt={4}>
                {user?.favMovies?.map((favMovie: any) => (
                    <motion.div
                        whileHover={{ scale: 1.05 }}
                        transition={{ duration: 0.2, ease: "easeInOut" }}
                    >
                        <Box
                            key={favMovie.movie.id}
                            onClick={function () {
                                navigate(
                                    `/movies/${favMovie.movie.title
                                        .split("")
                                        .map((char: any) => (char === " " ? "-" : char))
                                        .join("")}`,
                                );
                                window.scroll(0, 0);
                            }}
                            sx={{
                                height: "250px",
                                width: "200px",
                            }}
                        >
                            <img
                                src={favMovie.movie.photoSrc}
                                style={{
                                    height: "200px",
                                    width: "200px",
                                    cursor: "pointer",
                                }}
                            />
                            <Typography component={"h4"} fontSize={16}>
                                {favMovie.movie.title}
                            </Typography>
                            <Typography component={"span"} fontSize={12}>
                                Release Year: {favMovie.movie.releaseYear}
                            </Typography>
                        </Box>
                    </motion.div>
                ))}
            </Stack>
        </Box>
    );
}
