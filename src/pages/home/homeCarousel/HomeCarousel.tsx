import { useState } from "react";
import { IconButton, Box } from "@mui/material";
import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";

const Carousel = ({ images }: any) => {
    const [index, setIndex] = useState(0);

    const handleNext = () => {
        setIndex((prevIndex) => (prevIndex === images.length - 1 ? 0 : prevIndex + 1));
    };

    const handlePrev = () => {
        setIndex((prevIndex) => (prevIndex === 0 ? images.length - 1 : prevIndex - 1));
    };

    return (
        <Box
            display="flex"
            alignItems="center"
            justifyContent="center"
            width="100%"
            overflow="hidden"
        >
            <IconButton onClick={handlePrev}>
                <NavigateBeforeIcon />
            </IconButton>
            <img
                src={images[index].source}
                alt={`Slide ${index}`}
                style={{
                    maxWidth: "80%",
                    maxHeight: "100%",
                    width: "auto",
                }}
            />
            <IconButton onClick={handleNext}>
                <NavigateNextIcon />
            </IconButton>
        </Box>
    );
};

export default Carousel;
