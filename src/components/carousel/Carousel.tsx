import { useState, useEffect } from "react";
import { Box, IconButton, Button, useMediaQuery } from "@mui/material";
import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import PlayCircleIcon from "@mui/icons-material/PlayCircle";
import { Link } from "react-router-dom";
import IMovie from "~/types/IMovie";
import ISerie from "~/types/ISerie";

interface ICarouselProps {
    data: IMovie[] | ISerie[];
    type: string;
    visibleItems?: number;
}

const Carousel = ({ data, type, visibleItems = 3 }: ICarouselProps) => {
    const [startIndex, setStartIndex] = useState(0);
    const isMobile = useMediaQuery("(max-width:600px)");
    const isTablet = useMediaQuery("(max-width:960px)");
    const mobileVisibleItems = isMobile ? 1 : isTablet ? 2 : visibleItems;

    const handleNext = () => {
        setStartIndex((prevIndex) =>
            prevIndex >= data.length - mobileVisibleItems ? 0 : prevIndex + 1,
        );
    };

    const handlePrev = () => {
        setStartIndex((prevIndex) =>
            prevIndex === 0 ? data.length - mobileVisibleItems : prevIndex - 1,
        );
    };

    useEffect(() => {
        const interval = setInterval(() => {
            setStartIndex((prevIndex) =>
                prevIndex >= data.length - mobileVisibleItems ? 0 : prevIndex + 1,
            );
        }, 3000);

        return () => clearInterval(interval);
    }, [data, mobileVisibleItems]);

    return (
        <Box
            display="flex"
            alignItems="center"
            justifyContent="center"
            position="relative"
            overflow="hidden"
            sx={{ gap: 2, px: isMobile ? 2 : 6 }}
            flexWrap={"wrap"}
        >
            {data.length > mobileVisibleItems && (
                <IconButton
                    onClick={handlePrev}
                    size="large"
                    sx={{
                        position: isMobile ? "absolute" : "static",
                        left: isMobile ? "10px" : "auto",
                        top: isMobile ? "calc(50% - 20px)" : "auto",
                        zIndex: isMobile ? 10 : "auto",
                    }}
                >
                    <NavigateBeforeIcon />
                </IconButton>
            )}
            {data
                .slice(startIndex, startIndex + mobileVisibleItems)
                .map((element: IMovie | ISerie, index: number) => (
                    <Box
                        key={index}
                        position="relative"
                        sx={{
                            mr: index === mobileVisibleItems - 1 ? 0 : 1,
                            overflow: "hidden",
                            width: isMobile ? "100%" : "auto",
                            "&:hover img": {
                                filter: "blur(3px)",
                            },
                            "&:hover .carousel-button": {
                                display: "block",
                            },
                        }}
                    >
                        <img
                            src={element.photoSrc}
                            alt={`Slide ${startIndex + index}`}
                            style={{
                                width: `${isMobile || isTablet ? "100%" : "290px"}`,
                                height: "auto",
                                transition: "filter 1s ease",
                            }}
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
            {data.length > mobileVisibleItems && (
                <IconButton
                    onClick={handleNext}
                    size="large"
                    sx={{
                        position: isMobile ? "absolute" : "static",
                        right: isMobile ? "10px" : "auto",
                        top: isMobile ? "calc(50% - 20px)" : "auto",
                        zIndex: isMobile ? 10 : "auto",
                    }}
                >
                    <NavigateNextIcon />
                </IconButton>
            )}
        </Box>
    );
};

export default Carousel;
