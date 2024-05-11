import { useState, useEffect } from "react";
import { Box, IconButton } from "@mui/material";
import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";

const Carousel = ({ images }: any) => {
    const [startIndex, setStartIndex] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setStartIndex((prevIndex) => (prevIndex === images.length - 3 ? 0 : prevIndex + 1));
        }, 3000);

        return () => clearInterval(interval);
    }, [images]);

    const handleNext = () => {
        setStartIndex((prevIndex) => (prevIndex === images.length - 3 ? 0 : prevIndex + 1));
    };

    const handlePrev = () => {
        setStartIndex((prevIndex) => (prevIndex === 0 ? images.length - 3 : prevIndex - 1));
    };

    return (
        <Box
            display="flex"
            alignItems="center"
            justifyContent="center"
            overflow="hidden"
            style={{ gap: "20px" }}
        >
            <IconButton onClick={handlePrev}>
                <NavigateBeforeIcon />
            </IconButton>
            {images.slice(startIndex, startIndex + 3).map((image: any, index: number) => (
                <img
                    key={index}
                    src={image.source}
                    alt={`Slide ${startIndex + index}`}
                    style={{ marginRight: index === 2 ? 0 : "20px" }}
                />
            ))}
            <IconButton onClick={handleNext}>
                <NavigateNextIcon />
            </IconButton>
        </Box>
    );
};

export default Carousel;
