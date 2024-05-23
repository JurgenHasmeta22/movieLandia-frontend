import { motion } from "framer-motion";
import { Typography, Button, Box } from "@mui/material";
import { useNavigate } from "react-router-dom";

const HomeHeroSection = () => {
    const navigate = useNavigate();

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 10 }} transition={{ duration: 2 }}>
            <Box
                display={"flex"}
                flexDirection="column"
                alignItems="center"
                justifyContent="center"
                rowGap={1}
                component={"section"}
                sx={{
                    height: "100vh",
                    backgroundImage: "url('/src/assets/images/netflix.png')",
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                }}
            >
                <Typography variant="h1" fontSize={56}>
                    Welcome to MovieLandia24
                </Typography>
                <Typography variant="h3" textAlign={"center"}>
                    Watch your favorite movies and discover new series!
                </Typography>
                <Box marginTop={3}>
                    <Typography variant="body1" textAlign={"center"}>
                        Discover latest movies and series with all kinds of different genres, and
                        watch them in HD
                    </Typography>
                </Box>
                <Button
                    variant="contained"
                    color="secondary"
                    size="large"
                    sx={{
                        textTransform: "capitalize",
                        mt: 2,
                    }}
                    onClick={() => {
                        navigate("/movies");
                    }}
                >
                    Start Watching
                </Button>
            </Box>
        </motion.div>
    );
};

export default HomeHeroSection;
