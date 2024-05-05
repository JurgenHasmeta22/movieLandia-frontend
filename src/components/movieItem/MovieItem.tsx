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
                e.stopPropagation();
                navigate(
                    `/movies/${movie.title
                        .split("")
                        .map((char: any) => (char === " " ? "-" : char))
                        .join("")}`,
                );

                window.scrollTo(0, 0);
            }}
        >
            <img src={movie.photoSrc} />
            <Typography>{movie.title}</Typography>
            {type !== "serie" && (
                <Box>
                    {movie.genres?.map((genre: any) => (
                        <Typography
                            key={genre.genre.name}
                            onClick={function (e) {
                                e.stopPropagation();
                                navigate(`/genres/${genre.genre.name}`);
                                window.scrollTo(0, 0);
                            }}
                        >
                            {genre.genre.name}
                        </Typography>
                    ))}
                </Box>
            )}
            <Typography>
                {movie.ratingImdb !== 0 ? `Imdb: ${movie.ratingImdb}` : "Imdb: N/A"}
            </Typography>
        </Box>
    );
};

export default MovieItem;
