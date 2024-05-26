import { useEffect, useState } from "react";
import type IGenre from "~/types/IGenre";
import { Box, CircularProgress, Typography } from "@mui/material";
import genreService from "~/services/api/genreService";
import GenreItem from "~/components/genreItem/GenreItem";
import { motion } from "framer-motion";

export default function Genres() {
    const [genres, setGenres] = useState<IGenre[]>([]);

    async function getGenres(): Promise<void> {
        const response: any = await genreService.getGenres({});

        if (response && response.rows) {
            setGenres(response.rows);
        }
    }

    useEffect(() => {
        getGenres();
    }, []);

    if (!genres || genres?.length === 0) {
        return (
            <Box
                sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    height: "100vh",
                }}
            >
                <CircularProgress size={80} thickness={4} color="secondary"/>
            </Box>
        );
    }

    return (
        <main>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
            >
                <Box
                    sx={{
                        display: "flex",
                        flexDirection: "column",
                        placeItems: "center",
                        paddingTop: 4,
                    }}
                    component={"section"}
                >
                    <Typography mt={4} fontSize={"30px"}>
                        Choose your favorite genre
                    </Typography>
                    <Box
                        sx={{
                            display: "grid",
                            gridTemplateColumns: "1fr 1fr 1fr 1fr",
                            rowGap: 6,
                            columnGap: 4,
                        }}
                        mb={6}
                        mt={4}
                    >
                        {genres?.map((genre: any) => <GenreItem genre={genre} />)}
                    </Box>
                </Box>
            </motion.div>
        </main>
    );
}
