import { Box, Card, CardContent, CardMedia, Stack, Typography } from "@mui/material";
import React from "react";
import { useNavigate } from "react-router-dom";
import type IMovie from "~/types/IMovie";

interface IMovieItemProps {
    movie: IMovie;
    type: string;
}

const MovieItem = ({ movie, type }: IMovieItemProps): React.JSX.Element => {
    const navigate = useNavigate();

    return (
        <Card
            onClick={function () {
                if (type !== "serie") {
                    navigate(
                        `/movies/${movie.title
                            .split("")
                            .map((char: any) => (char === " " ? "-" : char))
                            .join("")}`,
                    );
                }
            }}
            sx={{
                cursor: "pointer",
                display: "flex",
                flexDirection: "column",
                maxWidth: "200px",
                backgroundColor: "transparent",
            }}
        >
            <CardMedia
                component="img"
                alt={`${movie.description}`}
                image={movie.photoSrc}
                sx={{
                    height: "300px",
                    maxHeight: "300px",
                    maxWidth: "200px",
                }}
            />
            <CardContent>
                <Typography variant="body1" color={"secondary"}>
                    {movie.title}
                </Typography>
                {type !== "serie" && (
                    <Stack
                        sx={{
                            display: "flex",
                            flexDirection: "row",
                            flewWrap: "wrap",
                            columnGap: 1,
                        }}
                    >
                        {movie.genres?.map((genre: any) => (
                            <span
                                key={genre.genre.name}
                                onClick={function (e) {
                                    navigate(`/genres/${genre.genre.name}`);
                                }}
                                style={{
                                    fontWeight: "500",
                                }}
                            >
                                {genre.genre.name}
                            </span>
                        ))}
                    </Stack>
                )}
                <Typography color={"secondary"}>
                    {movie.ratingImdb !== 0 ? `Imdb: ${movie.ratingImdb}` : "Imdb: N/A"}
                </Typography>
            </CardContent>
        </Card>
    );
};

export default MovieItem;
