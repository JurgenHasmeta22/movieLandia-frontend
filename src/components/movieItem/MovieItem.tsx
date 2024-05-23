import React from "react";
import { Card, CardContent, CardMedia, Stack, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import type IMovie from "~/types/IMovie";
// import { useStore } from "~/store/store";

interface IMovieItemProps {
    movie: IMovie;
    type?: string;
}

const MovieItem = ({ movie, type }: IMovieItemProps): React.JSX.Element => {
    // const { mobileOpen } = useStore();
    const navigate = useNavigate();

    return (
        <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 1.1 }}>
            <Card
                sx={{
                    display: "flex",
                    flexDirection: "column",
                    backgroundColor: "transparent",
                    maxWidth: "200px",
                    cursor: "pointer",
                    height: "100%",
                    width: "100%",
                }}
                onClick={() => {
                    if (type !== "serie") {
                        navigate(
                            `/movies/${movie.title
                                .split("")
                                .map((char: any) => (char === " " ? "-" : char))
                                .join("")}`,
                        );
                    } else {
                        navigate(
                            `/series/${movie.title
                                .split("")
                                .map((char: any) => (char === " " ? "-" : char))
                                .join("")}`,
                        );
                    }
                }}
                elevation={4}
            >
                <CardMedia
                    component="img"
                    alt={`${movie.description}`}
                    image={movie.photoSrc}
                    sx={{
                        maxHeight: "300px",
                        maxWidth: "200px",
                    }}
                />
                <CardContent
                    sx={{
                        flexGrow: 1,
                        display: "flex",
                        flexDirection: "column",
                        placeContent: "space-between",
                        letterSpacing: 2,
                    }}
                >
                    <Typography variant="body1" color={"secondary"} fontWeight={600} fontSize={14}>
                        {movie.title}
                    </Typography>
                    {!type && movie.genres && movie.genres.length > 0 && (
                        <Stack
                            sx={{
                                display: "flex",
                                flexDirection: "row",
                                flexWrap: "wrap",
                                columnGap: 1,
                                pt: 1,
                                pb: 1,
                            }}
                        >
                            {movie.genres?.map((genre: any) => (
                                <span
                                    key={genre.genre.name}
                                    onClick={function (e) {
                                        e.stopPropagation();
                                        navigate(`/genres/${genre.genre.name}`);
                                    }}
                                    style={{
                                        fontWeight: "500",
                                        cursor: "pointer",
                                        whiteSpace: "nowrap",
                                        textOverflow: "ellipsis",
                                        overflow: "hidden",
                                    }}
                                >
                                    {genre.genre.name}
                                </span>
                            ))}
                        </Stack>
                    )}
                    <Typography color={"secondary"} fontSize={12}>
                        {movie.ratingImdb !== 0 ? `Rating Imdb: ${movie.ratingImdb}` : "Imdb: N/A"}
                    </Typography>
                </CardContent>
            </Card>
        </motion.div>
    );
};

export default MovieItem;
