import { Box, ListItem, Paper } from "@mui/material";
import { useNavigate } from "react-router";
import type IMovie from "~/interfaces/IMovie";

interface IMovieItemLatestProps {
    latestMovie: IMovie;
}

export default function MovieItemLatest(props: IMovieItemLatestProps) {
    const { latestMovie } = props;

    const navigate = useNavigate();

    return (
        <Paper
            key={latestMovie.id}
            sx={{ cursor: "pointer" }}
            onClick={function () {
                navigate(
                    `/movies/${latestMovie.title
                        .split("")
                        .map((char: any) => (char === " " ? "-" : char))
                        .join("")}`,
                );
                window.scrollTo(0, 0);
            }}
        >
            <img src={latestMovie.photoSrc} />
        </Paper>
    );
}