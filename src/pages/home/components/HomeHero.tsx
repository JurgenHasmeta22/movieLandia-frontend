import { Typography, Button, Box } from "@mui/material";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import LocalMoviesIcon from "@mui/icons-material/LocalMovies";
import MovieIcon from "@mui/icons-material/Movie";

const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            delay: 0.2,
            duration: 0.8,
            type: "spring",
        },
    },
};

const itemVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: (custom: number) => ({
        opacity: 1,
        y: 0,
        transition: { delay: custom * 0.2 },
    }),
};

const HomeHeroSection = () => {
    const navigate = useNavigate();

    return (
        <Box
            display={"flex"}
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
            rowGap={0.5}
            component={"section"}
            sx={{
                height: "100vh",
                position: "relative",
                overflow: "hidden",
                textAlign: "center",
            }}
        >
            <Box
                sx={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: "100%",
                    backgroundImage: "url('/assets/images/netflix.png')",
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    filter: "blur(2px) opacity(0.7)",
                    zIndex: -1,
                }}
            />
            <motion.div variants={containerVariants} initial="hidden" animate="visible">
                <motion.div variants={itemVariants} custom={0}>
                    <Typography
                        variant="h1"
                        fontSize={60}
                        component={motion.h1}
                        fontWeight={900}
                        letterSpacing={1}
                        color={"secondary"}
                    >
                        Dive into MovieLandia24
                    </Typography>
                </motion.div>
                <motion.div variants={itemVariants} custom={1}>
                    <Typography
                        variant="h2"
                        textAlign={"center"}
                        component={motion.h2}
                        fontWeight={800}
                        letterSpacing={0.5}
                        color={"secondary"}
                    >
                        Your Gateway to the World of Cinema and Series!
                    </Typography>
                </motion.div>
                <motion.div variants={itemVariants} custom={2}>
                    <Box marginTop={1}>
                        <Typography variant="body1" textAlign={"center"} fontWeight={700} letterSpacing={0.5}>
                            Explore the latest blockbusters and timeless classics, all in stunning HD quality.
                        </Typography>
                    </Box>
                </motion.div>
                <motion.div variants={itemVariants} custom={3}>
                    <Box display="flex" justifyContent="center" marginTop={2} columnGap={3}>
                        <Button
                            variant="contained"
                            color="secondary"
                            size="large"
                            sx={{
                                textTransform: "capitalize",
                            }}
                            onClick={() => {
                                navigate("/movies");
                            }}
                        >
                            <MovieIcon fontSize={"large"} color="error" />
                            <Typography component={"span"} paddingLeft={1}>
                                Start Watching Movies
                            </Typography>
                        </Button>
                        <Button
                            variant="contained"
                            color="secondary"
                            size="large"
                            sx={{
                                textTransform: "capitalize",
                            }}
                            onClick={() => {
                                navigate("/series");
                            }}
                        >
                            <LocalMoviesIcon fontSize={"large"} color="error" />
                            <Typography component={"span"} paddingLeft={1}>
                                Start Watching Series
                            </Typography>
                        </Button>
                    </Box>
                </motion.div>
            </motion.div>
        </Box>
    );
};

export default HomeHeroSection;
