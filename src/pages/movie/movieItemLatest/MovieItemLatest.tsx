import { Box } from "@mui/material";
import { useNavigate } from "react-router";
import type IMovie from "~/interfaces/IMovie";

interface IMovieItemLatestProps {
    latestMovie: IMovie;
}

export default function MovieItemLatest(props: IMovieItemLatestProps) {
    const { latestMovie } = props;
    const navigate = useNavigate();

    return (
        <Box
            key={latestMovie.id}
            sx={{ cursor: "pointer" }}
            onClick={function () {
                navigate(
                    `/movies/${latestMovie.title
                        .split("")
                        .map((char: any) => (char === " " ? "-" : char))
                        .join("")}`,
                );
            }}
        >
            <img
                src={latestMovie.photoSrc}
                style={{
                    height: "200px",
                    width: "150px",
                }}
            />
        </Box>
    );
}
