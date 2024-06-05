import { Typography, Button, Box } from "@mui/material";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

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
            rowGap={1}
            component={"section"}
            sx={{
                height: "200vh",
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
                    filter: "blur(4px)",
                    zIndex: -1,
                }}
            />
            <motion.div variants={containerVariants} initial="hidden" animate="visible">
                <motion.div variants={itemVariants} custom={0}>
                    <Typography variant="h1" fontSize={56} component={motion.h1}>
                        Dive into MovieLandia24
                    </Typography>
                </motion.div>
                <motion.div variants={itemVariants} custom={1}>
                    <Typography variant="h3" textAlign={"center"} component={motion.h3}>
                        Your Gateway to the World of Cinema and Series!
                    </Typography>
                </motion.div>
                <motion.div variants={itemVariants} custom={2}>
                    <Box marginTop={3}>
                        <Typography variant="body1" textAlign={"center"}>
                            Explore the latest blockbusters and timeless classics, all in stunning
                            HD quality.
                        </Typography>
                    </Box>
                </motion.div>
                <motion.div variants={itemVariants} custom={3}>
                    <Box display="flex" justifyContent="center" marginTop={3}>
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
                            Start Your Journey
                        </Button>
                    </Box>
                </motion.div>
            </motion.div>
        </Box>
    );
};

export default HomeHeroSection;
