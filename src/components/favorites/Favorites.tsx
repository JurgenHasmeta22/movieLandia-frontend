import { Box, Stack, Typography, useTheme } from "@mui/material";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useStore } from "~/store/store";
import { tokens } from "~/utils/theme";
import ClearIcon from "@mui/icons-material/Clear";
import { toast } from "react-toastify";
import movieService from "~/services/api/movieService";
import IMovie from "~/types/IMovie";
import ISerie from "~/types/ISerie";
import serieService from "~/services/api/serieService";

interface FavoritesTabProps {
    type: "Movies" | "Series";
}

export default function FavoritesTab({ type }: FavoritesTabProps) {
    const navigate = useNavigate();
    const { user, setUser } = useStore();
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const favorites = type === "Movies" ? user?.favMovies : user?.favSeries;

    async function onRemoveBookmarkMovie(movie: IMovie) {
        if (!user || !movie) return;

        try {
            const response = await movieService.removeFromFavorites(movie?.id!, user?.id);

            if (response && !response.error) {
                setUser(response);
                toast.success("Movie unbookmarked successfully!");
                window.scrollTo(0, 0);
            } else {
                toast.error("Movie not unbookmarked successfully!");
            }
        } catch (error) {
            toast.error("An error occurred while removing the movie from favorites.");
        }
    }

    async function onRemoveBookmarkSerie(serie: ISerie) {
        if (!user || !serie) return;

        try {
            const response = await serieService.removeFromFavorites(serie.id, user.id);

            if (response && !response.error) {
                setUser(response);
                toast.success("Serie unbookmarked successfully!");
                window.scrollTo(0, 0);
            } else {
                toast.error("Serie not unbookmarked successfully!");
            }
        } catch (error) {
            toast.error("An error occurred while removing the serie from favorites.");
        }
    }

    return (
        <Box
            component={"section"}
            height={`${user?.favMovies?.length! > 0 || user?.favSeries?.length! > 0 ? "auto" : "100vh"}`}
        >
            <Typography variant="h4">Bookmarked {type}</Typography>
            <Stack flexDirection={"row"} flexWrap={"wrap"} columnGap={6} rowGap={4} mt={4}>
                {favorites?.map((favItem: any, index: number) => (
                    <motion.div
                        key={index}
                        whileHover={{ scale: 1.03 }}
                        transition={{ duration: 0.2, ease: "easeInOut" }}
                        style={{ position: "relative" }}
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
                                src={type === "Movies" ? favItem.movie.photoSrc : favItem.serie.photoSrc}
                                alt={type === "Movies" ? favItem.movie.title : favItem.serie.title}
                                style={{
                                    height: "200px",
                                    width: "150px",
                                    objectFit: "cover",
                                }}
                            />
                            <Typography component={"h4"} fontSize={14}>
                                {type === "Movies" ? favItem.movie.title : favItem.serie.title}
                            </Typography>
                        </Box>
                        <Box
                            sx={{
                                position: "absolute",
                                top: 0,
                                right: 0,
                                padding: "6px 6px",
                                cursor: "pointer",
                                backgroundColor: colors.primary[100],
                                borderRadius: "50%",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                            }}
                            onClick={async (e) => {
                                e.stopPropagation();

                                if (type === "Movies") {
                                    await onRemoveBookmarkMovie(favItem.movie);
                                } else {
                                    await onRemoveBookmarkSerie(favItem.serie);
                                }
                            }}
                        >
                            <ClearIcon
                                sx={{
                                    color: colors.primary[900],
                                }}
                            />
                        </Box>
                    </motion.div>
                ))}
            </Stack>
        </Box>
    );
}
