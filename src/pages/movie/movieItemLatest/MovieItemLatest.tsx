import { Card, CardMedia } from "@mui/material";
import { useNavigate } from "react-router";
import { motion } from "framer-motion";
import type IMovie from "~/types/IMovie";
import { useStore } from "~/store/store";

interface IMovieItemLatestProps {
    latestMovie: IMovie;
}

export default function MovieItemLatest({ latestMovie }: IMovieItemLatestProps) {
    const { mobileOpen } = useStore();
    const navigate = useNavigate();

    return (
        <motion.div
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
            onClick={() => {
                navigate(
                    `/movies/${latestMovie.title
                        .split("")
                        .map((char: any) => (char === " " ? "-" : char))
                        .join("")}`,
                );
                window.scrollTo(0, 0);
            }}
        >
            <Card
                key={latestMovie.id}
                sx={{
                    maxWidth: `${mobileOpen ? "150px" : "200px"}`,
                    height: "100%",
                    width: "100%",
                    display: "flex",
                    flexDirection: "column",
                    cursor: "pointer",
                }}
            >
                <CardMedia
                    component="img"
                    image={latestMovie.photoSrc}
                    alt={latestMovie.description}
                    sx={{
                        height: "317px",
                        width: "214px",
                        objectFit: "cover",
                    }}
                />
            </Card>
        </motion.div>
    );
}
