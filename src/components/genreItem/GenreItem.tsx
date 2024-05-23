import { Card, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import IGenre from "~/types/IGenre";

interface IGenreItemProps {
    genre: IGenre;
}

export default function GenreItem({ genre }: IGenreItemProps) {
    const navigate = useNavigate();

    return (
        <Card
            key={genre.id}
            onClick={function () {
                navigate(`/genres/${genre.name}`);
                window.scrollTo(0, 0);
            }}
            sx={{
                display: "flex",
                placeItems: "center",
                placeContent: "center",
                cursor: "pointer",
                height: "200px",
                width: "200px",
                backgroundColor: `colors.secondary`,
            }}
            elevation={4}
        >
            <Typography component={"span"}>{genre.name}</Typography>
        </Card>
    );
}
