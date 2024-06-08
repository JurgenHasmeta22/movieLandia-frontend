import { Typography, Button, Box, useTheme } from "@mui/material";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import LocalMoviesIcon from "@mui/icons-material/LocalMovies";
import MovieIcon from "@mui/icons-material/Movie";
import { tokens } from "~/utils/theme";

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
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);

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
                    filter: theme.palette.mode === "dark" ? "blur(2px) opacity(0.5)" : "blur(2px) opacity(0.8)",
                    zIndex: -1,
                }}
            />
            <motion.div variants={containerVariants} initial="hidden" animate="visible">
                <motion.div variants={itemVariants} custom={0}>
                    <Typography
                        variant="h1"
                        fontSize={[22, 30, 40, 55, 60]}
                        component={motion.h1}
                        fontWeight={900}
                        letterSpacing={3}
                        sx={{
                            color: theme.palette.mode === "dark" ? colors.primary[100] : colors.blueAccent[900],
                        }}
                    >
                        Dive into MovieLandia24
                    </Typography>
                </motion.div>
                <motion.div variants={itemVariants} custom={1}>
                    <Typography
                        variant="h2"
                        textAlign={"center"}
                        component={motion.h2}
                        fontSize={[16, 22, 30, 35, 40]}
                        fontWeight={900}
                        letterSpacing={1}
                        sx={{
                            color: theme.palette.mode === "dark" ? colors.primary[100] : colors.blueAccent[900],
                        }}
                    >
                        Your Gateway to the World of Cinema and Series!
                    </Typography>
                </motion.div>
                <motion.div variants={itemVariants} custom={2}>
                    <Box marginTop={1}>
                        <Typography
                            variant="body1"
                            textAlign={"center"}
                            fontWeight={700}
                            letterSpacing={0.5}
                            sx={{
                                fontSize: [12, 14, 16, 18, 20],
                                color: theme.palette.mode === "dark" ? colors.primary[100] : colors.primary[400],
                            }}
                        >
                            Explore the latest blockbusters and timeless classics.
                        </Typography>
                    </Box>
                </motion.div>
                <motion.div variants={itemVariants} custom={3}>
                    <Box display="flex" justifyContent="center" marginTop={2} columnGap={3}>
                        <Link to={"/movies"}>
                            <Button
                                variant="contained"
                                sx={{
                                    textTransform: "capitalize",
                                    backgroundColor: colors.primary[900],
                                    "&:hover": {
                                        backgroundColor: colors.greenAccent[800],
                                    },
                                }}
                            >
                                <MovieIcon
                                    sx={{
                                        color: colors.primary[100],
                                        fontSize: [12, 14, 16, 18, 20],
                                    }}
                                />
                                <Typography
                                    component={"span"}
                                    paddingLeft={1}
                                    fontWeight={800}
                                    sx={{
                                        color: colors.primary[100],
                                        fontSize: [10, 12, 14, 16, 18],
                                        py: 0.5,
                                    }}
                                >
                                    Start Watching Movies
                                </Typography>
                            </Button>
                        </Link>
                        <Link to={"/series"}>
                            <Button
                                variant="contained"
                                sx={{
                                    textTransform: "capitalize",
                                    backgroundColor: colors.primary[900],
                                    "&:hover": {
                                        backgroundColor: colors.greenAccent[800],
                                    },
                                }}
                                onClick={() => {
                                    navigate("/series");
                                }}
                            >
                                <LocalMoviesIcon
                                    sx={{
                                        color: colors.primary[100],
                                        fontSize: [12, 14, 16, 18, 20],
                                    }}
                                />
                                <Typography
                                    component={"span"}
                                    paddingLeft={1}
                                    fontWeight={700}
                                    sx={{
                                        color: colors.primary[100],
                                        fontSize: [10, 12, 14, 16, 18],
                                        py: 0.5,
                                    }}
                                >
                                    Start Watching Series
                                </Typography>
                            </Button>
                        </Link>
                    </Box>
                </motion.div>
            </motion.div>
        </Box>
    );
};

export default HomeHeroSection;
