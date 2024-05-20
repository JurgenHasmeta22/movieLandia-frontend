import { Card, CardMedia } from "@mui/material";
import { useNavigate } from "react-router";
import type IMovie from "~/types/IMovie";

interface IMovieItemLatestProps {
    latestMovie: IMovie;
}

export default function MovieItemLatest(props: IMovieItemLatestProps) {
    const { latestMovie } = props;
    const navigate = useNavigate();

    return (
        <Card
            key={latestMovie.id}
            sx={{ cursor: "pointer", maxHeight: "250px", maxWidth: "200px" }}
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
            <CardMedia
                component="img"
                image={latestMovie.photoSrc}
                alt={latestMovie.description}
                sx={{
                    maxHeight: "250px",
                    maxWidth: "200px",
                }}
            />
        </Card>
    );
}
