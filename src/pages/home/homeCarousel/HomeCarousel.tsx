import { useState, useEffect } from "react";
import { Box, IconButton, Button } from "@mui/material";
import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import PlayCircleIcon from "@mui/icons-material/PlayCircle";
import { Link } from "react-router-dom";

const Carousel = ({ images }: any) => {
    const [startIndex, setStartIndex] = useState(0);

    const handleNext = () => {
        setStartIndex((prevIndex) => (prevIndex === images.length - 3 ? 0 : prevIndex + 1));
    };

    const handlePrev = () => {
        setStartIndex((prevIndex) => (prevIndex === 0 ? images.length - 3 : prevIndex - 1));
    };

    useEffect(() => {
        const interval = setInterval(() => {
            setStartIndex((prevIndex) => (prevIndex === images.length - 3 ? 0 : prevIndex + 1));
        }, 3000);

        return () => clearInterval(interval);
    }, [images]);

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
            <IconButton onClick={handlePrev} size="large" sx={{ position: "absolute", left: 0 }}>
                <NavigateBeforeIcon />
            </IconButton>
            {images.slice(startIndex, startIndex + 3).map((image: any, index: number) => (
                <Box
                    key={index}
                    position="relative"
                    sx={{
                        mr: index === 2 ? 0 : 2,
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
                        src={image.source}
                        alt={`Slide ${startIndex + index}`}
                        style={{ width: "300px", height: "auto", transition: "filter 0.5s ease" }}
                    />
                    <Link
                        to={
                            `/movies/${image.title
                                .split("")
                                .map((char: any) => (char === " " ? "-" : char))
                                .join("")}` || "#"
                        }
                    >
                        <Button
                            variant="contained"
                            color="primary"
                            className="carousel-button"
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
            <IconButton onClick={handleNext} size="large" sx={{ position: "absolute", right: 0 }}>
                <NavigateNextIcon />
            </IconButton>
        </Box>
    );
};

export default Carousel;
