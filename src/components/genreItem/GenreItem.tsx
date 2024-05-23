import { Card, Typography } from "@mui/material";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import IGenre from "~/types/IGenre";

interface IGenreItemProps {
    genre: IGenre;
}

export default function GenreItem({ genre }: IGenreItemProps) {
    const navigate = useNavigate();

    return (
        <motion.div whileHover={{ scale: 1.15 }} whileTap={{ scale: 1.15 }}>
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
        </motion.div>
    );
}
