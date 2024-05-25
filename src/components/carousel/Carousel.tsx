import { useState, useEffect } from "react";
import { Box, IconButton, Button } from "@mui/material";
import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import PlayCircleIcon from "@mui/icons-material/PlayCircle";
import { Link } from "react-router-dom";
import IMovie from "~/types/IMovie";
import ISerie from "~/types/ISerie";

interface ICarouselProps {
    data: IMovie[] | ISerie[];
    type: string;
}

const Carousel = ({ data, type }: ICarouselProps) => {
    const [startIndex, setStartIndex] = useState(0);

    const handleNext = () => {
        setStartIndex((prevIndex) => (prevIndex === data.length - 3 ? 0 : prevIndex + 1));
    };

    const handlePrev = () => {
        setStartIndex((prevIndex) => (prevIndex === 0 ? data.length - 3 : prevIndex - 1));
    };

    useEffect(() => {
        const interval = setInterval(() => {
            setStartIndex((prevIndex) => (prevIndex === data.length - 3 ? 0 : prevIndex + 1));
        }, 3000);

        return () => clearInterval(interval);
    }, [data]);

    return (
        <Box
            display="flex"
            alignItems="center"
            justifyContent="center"
            position="relative"
            overflow="hidden"
            sx={{ gap: 2, px: 6 }}
            flexWrap={"wrap"}
        >
            <IconButton onClick={handlePrev} size="large">
                <NavigateBeforeIcon />
            </IconButton>
            {data
                .slice(startIndex, startIndex + 3)
                .map((element: IMovie | ISerie, index: number) => (
                    <Box
                        key={index}
                        position="relative"
                        sx={{
                            mr: index === 1 ? 0 : 1,
                            overflow: "hidden",
                            "&:hover img": {
                                filter: "blur(5px)",
                            },
                            "&:hover .carousel-button": {
                                display: "block",
                            },
                        }}
                    >
                        <img
                            src={element.photoSrc}
                            alt={`Slide ${startIndex + index}`}
                            style={{ width: "280px", height: "auto", transition: "filter 1s ease" }}
                        />
                        <Link
                            to={
                                `/${type}/${element.title
                                    .split("")
                                    .map((char: string) => (char === " " ? "-" : char))
                                    .join("")}` || "#"
                            }
                        >
                            <Button
                                variant="text"
                                color="primary"
                                className="carousel-button"
                                size="medium"
                                sx={{
                                    position: "absolute",
                                    top: "50%",
                                    left: "50%",
                                    transform: "translate(-50%, -50%)",
                                    display: "none",
                                }}
                            >
                                <PlayCircleIcon fontSize="large" color="secondary" />
                            </Button>
                        </Link>
                    </Box>
                ))}
            <IconButton onClick={handleNext} size="large">
                <NavigateNextIcon />
            </IconButton>
        </Box>
    );
};

export default Carousel;
