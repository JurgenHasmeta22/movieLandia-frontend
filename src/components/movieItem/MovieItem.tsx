import React from "react";
import { Card, CardContent, CardMedia, Stack, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import type IMovie from "~/types/IMovie";

interface IMovieItemProps {
    movie: IMovie;
    type?: string;
}

const MovieItem = ({ movie, type }: IMovieItemProps): React.JSX.Element => {
    const navigate = useNavigate();

    return (
        <motion.div
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
        >
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
                    if (type && type === "serie") {
                        navigate(
                            `/series/${movie.title
                                .split("")
                                .map((char: string | number) => (char === " " ? "-" : char))
                                .join("")}`,
                        );
                    } else {
                        navigate(
                            `/movies/${movie.title
                                .split("")
                                .map((char: string | number) => (char === " " ? "-" : char))
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
                        height: "300px",
                        width: "200px",
                    }}
                />
                <CardContent
                    sx={{
                        flexGrow: 1,
                        display: "flex",
                        flexDirection: "column",
                        placeContent: "flex-start",
                        letterSpacing: 0.5,
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
                                pt: 0.5,
                                pb: 0.5,
                            }}
                        >
                            {movie.genres?.map((genre: any) => (
                                <Typography
                                    component={"span"}
                                    key={genre.id}
                                    onClick={function (e) {
                                        e.stopPropagation();
                                        navigate(`/genres/${genre.name}`);
                                    }}
                                    style={{
                                        fontWeight: "400",
                                        cursor: "pointer",
                                        fontSize: 10,
                                    }}
                                >
                                    {genre.name}
                                </Typography>
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
