import { Box, CircularProgress, Container, Stack } from "@mui/material";
import HomeHeroSection from "./components/HomeHero";
import MovieItem from "~/components/movieItem/MovieItem";
import { useEffect, useState } from "react";
import ISerie from "~/types/ISerie";
import IGenre from "~/types/IGenre";
import IMovie from "~/types/IMovie";
import { Link } from "react-router-dom";
import movieService from "~/services/api/movieService";
import IMoviesResponse from "~/types/IMoviesResponse";
import serieService from "~/services/api/serieService";
import genreService from "~/services/api/genreService";
import GenreItem from "~/components/genreItem/GenreItem";
import { motion } from "framer-motion";

export default function Home() {
    const [series, setSeries] = useState<ISerie[]>([]);
    const [genres, setGenres] = useState<IGenre[]>([]);
    const [movies, setMovies] = useState<IMovie[]>([]);

    const getMovies = async () => {
        const response: IMoviesResponse = await movieService.getMovies({});

        if (response && response.movies) {
            const shuffledArray = response.movies.sort(() => Math.random() - 0.5);
            const randomElements = shuffledArray.slice(0, 5);
            setMovies(randomElements);
        }
    };

    const getSeries = async () => {
        const response = await serieService.getSeries({});

        if (response && response.rows) {
            const shuffledArray = response.rows.sort(() => Math.random() - 0.5);
            const randomElements = shuffledArray.slice(0, 5);
            setSeries(randomElements);
        }
    };

    const getGenres = async () => {
        const response = await genreService.getGenres({});

        if (response && response.rows) {
            const shuffledArray = response.rows.sort(() => Math.random() - 0.5);
            const randomElements = shuffledArray.slice(0, 5);
            setGenres(randomElements);
        }
    };
    useEffect(() => {
        const fetchData = async () => {
            await Promise.all([getMovies(), getSeries(), getGenres()]);
        };
        fetchData();
    }, []);

    if (
        (!movies || movies?.length === 0) &&
        (!series || series?.length === 0) &&
        (!genres || genres?.length === 0)
    ) {
        return (
            <Box
                sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    height: "100vh",
                }}
            >
                <CircularProgress size={80} thickness={4} />
            </Box>
        );
    }

    return (
        <main>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.35, ease: "easeInOut" }}
                >
                <HomeHeroSection />
                <Container component={"section"}>
                    <Stack flexDirection={"column"} rowGap={10} mb={6} mt={6}>
                        <Box display={"flex"} flexDirection={"column"} rowGap={3}>
                            <Link
                                to="/movies"
                                style={{
                                    textDecoration: "none",
                                    fontWeight: 600,
                                    fontSize: 18,
                                    marginLeft: 8,
                                }}
                            >
                                Explore more Movies
                            </Link>
                            <Stack
                                direction="row"
                                flexWrap="wrap"
                                justifyContent={"center"}
                                alignContent={"center"}
                                rowGap={4}
                                columnGap={4}
                            >
                                {movies.map((movie: any) => (
                                    <MovieItem movie={movie} key={movie.id} />
                                ))}
                            </Stack>
                        </Box>
                        <Box display={"flex"} flexDirection={"column"} rowGap={3}>
                            <Link
                                to="/series"
                                style={{
                                    textDecoration: "none",
                                    fontWeight: 600,
                                    fontSize: 18,
                                    marginLeft: 8,
                                }}
                            >
                                Explore more Series
                            </Link>
                            <Stack
                                direction="row"
                                flexWrap="wrap"
                                justifyContent={"center"}
                                alignContent={"center"}
                                rowGap={4}
                                columnGap={4}
                            >
                                {series.map((serie: any) => (
                                    <MovieItem movie={serie} type="serie" key={serie.id} />
                                ))}
                            </Stack>
                        </Box>
                        <Box display={"flex"} flexDirection={"column"} rowGap={3}>
                            <Link
                                to="/genres"
                                style={{
                                    textDecoration: "none",
                                    fontWeight: 600,
                                    fontSize: 18,
                                    marginLeft: 8,
                                }}
                            >
                                Explore more Genres
                            </Link>
                            <Stack
                                direction="row"
                                flexWrap="wrap"
                                justifyContent={"center"}
                                alignContent={"center"}
                                rowGap={4}
                                columnGap={4}
                            >
                                {genres.map((genre: any) => (
                                    <GenreItem key={genre.id} genre={genre} />
                                ))}
                            </Stack>
                        </Box>
                    </Stack>
                </Container>
            </motion.div>
        </main>
    );
}
