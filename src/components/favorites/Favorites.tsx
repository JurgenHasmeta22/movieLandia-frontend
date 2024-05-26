import { Box, Stack, Typography } from "@mui/material";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useStore } from "~/store/store";

interface FavoritesTabProps {
    type: "Movies" | "Series";
}

export default function FavoritesTab({ type }: FavoritesTabProps) {
    const navigate = useNavigate();
    const { user } = useStore();
    const favorites = type === "Movies" ? user?.favMovies : user?.favSeries;

    return (
        <Box component={"section"}>
            <Typography variant="h4">Bookmarked {type}</Typography>
            <Stack flexDirection={"row"} flexWrap={"wrap"} columnGap={6} rowGap={4} mt={4}>
                {favorites?.map((favItem: any, index: number) => (
                    <motion.div
                        key={index}
                        whileHover={{ scale: 1.05 }}
                        transition={{ duration: 0.2, ease: "easeInOut" }}
                    >
                        <Box
                            onClick={() => {
                                const urlPath = type === "Movies" ? "movies" : "series";
                                const formattedTitle =
                                    type === "Movies"
                                        ? favItem.movie.title
                                        : favItem.serie.title
                                              .split("")
                                              .map((char: string) => (char === " " ? "-" : char))
                                              .join("");
                                              
                                navigate(`/${urlPath}/${formattedTitle}`);
                                window.scrollTo(0, 0);
                            }}
                            sx={{
                                height: "100%",
                                width: "100%",
                                cursor: "pointer",
                            }}
                        >
                            <img
                                src={
                                    type === "Movies"
                                        ? favItem.movie.photoSrc
                                        : favItem.serie.photoSrc
                                }
                                alt={type === "Movies" ? favItem.movie.title : favItem.serie.title}
                                style={{
                                    height: "300px",
                                    width: "200px",
                                    objectFit: "cover",
                                }}
                            />
                            <Typography component={"h4"} fontSize={14}>
                                {type === "Movies" ? favItem.movie.title : favItem.serie.title}
                            </Typography>
                        </Box>
                    </motion.div>
                ))}
            </Stack>
        </Box>
    );
}
