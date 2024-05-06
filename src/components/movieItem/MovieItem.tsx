import { Box, Typography } from "@mui/material";
import React from "react";
import { useNavigate } from "react-router-dom";
import type IMovie from "~/interfaces/IMovie";

interface IMovieItemProps {
    movie: IMovie;
    type: string;
}

const MovieItem = ({ movie, type }: IMovieItemProps): React.JSX.Element => {
    const navigate = useNavigate();

    return (
        <Box
            key={movie.id}
            onClick={function (e) {
                navigate(
                    `/movies/${movie.title
                        .split("")
                        .map((char: any) => (char === " " ? "-" : char))
                        .join("")}`,
                );
            }}
            sx={{
                cursor: "pointer",
                display: "flex",
                flexDirection: "column",
            }}
        >
            <img
                src={movie.photoSrc}
                style={{
                    height: "300px",
                    width: "260px",
                }}
            />
            <Typography
                variant="h5"
                color={"secondary"}
                style={{
                    width: "20ch",
                }}
            >
                {movie.title}
            </Typography>
            {type !== "serie" && (
                <Box sx={{ display: "flex", flexDirection: "row", flewWrap: "wrap", columnGap: 1 }}>
                    {movie.genres?.map((genre: any) => (
                        <Typography
                            key={genre.genre.name}
                            onClick={function (e) {
                                navigate(`/genres/${genre.genre.name}`);
                            }}
                            variant="overline"
                            color={"primary"}
                            fontWeight={"bold"}
                        >
                            {genre.genre.name}
                        </Typography>
                    ))}
                </Box>
            )}
            <Typography color={"secondary"}>
                {movie.ratingImdb !== 0 ? `Imdb: ${movie.ratingImdb}` : "Imdb: N/A"}
            </Typography>
        </Box>
    );
};

export default MovieItem;
