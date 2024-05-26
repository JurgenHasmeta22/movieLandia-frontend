import { Box, CircularProgress, Container, Stack } from "@mui/material";
import HomeHeroSection from "./components/HomeHero";
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
import { motion, useAnimation } from "framer-motion";
import { useInView } from "react-intersection-observer";
import CardItem from "~/components/cardItem/CardItem";

export default function Home() {
    // #region "Data needed state, useEffect and API calls"
    const [series, setSeries] = useState<ISerie[]>([]);
    const [genres, setGenres] = useState<IGenre[]>([]);
    const [movies, setMovies] = useState<IMovie[]>([]);

    const getMovies = async () => {
        try {
            const response: IMoviesResponse = await movieService.getMovies({});

            if (response && response.movies) {
                const shuffledArray = response.movies.sort(() => Math.random() - 0.5);
                const randomElements = shuffledArray.slice(0, 5);
                setMovies(randomElements);
            }
        } catch (error) {
            console.error("Error fetching movies:", error);
        }
    };

    const getSeries = async () => {
        try {
            const response = await serieService.getSeries({});

            if (response && response.rows) {
                const shuffledArray = response.rows.sort(() => Math.random() - 0.5);
                const randomElements = shuffledArray.slice(0, 5);
                setSeries(randomElements);
            }
        } catch (error) {
            console.error("Error fetching series:", error);
        }
    };

    const getGenres = async () => {
        try {
            const response = await genreService.getGenres({});

            if (response && response.rows) {
                const shuffledArray = response.rows.sort(() => Math.random() - 0.5);
                const randomElements = shuffledArray.slice(0, 5);
                setGenres(randomElements);
            }
        } catch (error) {
            console.error("Error fetching genres:", error);
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            await Promise.all([getMovies(), getSeries(), getGenres()]);
        };

        fetchData();
    }, []);
    // #endregion

    // #region "Framer Motion stuff to make divs animated"
    const sectionVariants = {
        hidden: { opacity: 0, transform: "translateX(50px)" },
        visible: { opacity: 1, transform: "translateX(0px)" },
    };

    const [moviesRef, moviesInView] = useInView({ triggerOnce: true });
    const moviesControls = useAnimation();

    useEffect(() => {
        if (moviesInView) {
            moviesControls.start("visible");
        }
    }, [moviesInView, moviesControls]);

    const [seriesRef, seriesInView] = useInView({ triggerOnce: true });
    const seriesControls = useAnimation();

    useEffect(() => {
        if (seriesInView) {
            seriesControls.start("visible");
        }
    }, [seriesInView, seriesControls]);

    const [genresRef, genresInView] = useInView({ triggerOnce: true });
    const genresControls = useAnimation();

    useEffect(() => {
        if (genresInView) {
            genresControls.start("visible");
        }
    }, [genresInView, genresControls]);
    // #endregion

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
                <CircularProgress size={80} thickness={4} color="secondary" />
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
                <HomeHeroSection />
                <Container component={"section"}>
                    <Stack flexDirection={"column"} rowGap={10} mb={6} mt={6}>
                        <motion.div
                            ref={moviesRef}
                            animate={moviesControls}
                            variants={sectionVariants}
                            transition={{ duration: 1 }}
                            initial="hidden"
                            style={{ position: "relative" }}
                        >
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
                                    Explore Movies
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
                                        <CardItem data={movie} key={movie.id} />
                                    ))}
                                </Stack>
                            </Box>
                        </motion.div>
                        <motion.div
                            ref={seriesRef}
                            animate={seriesControls}
                            variants={sectionVariants}
                            transition={{ duration: 1 }}
                            initial="hidden"
                            style={{ position: "relative" }}
                        >
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
                                    Explore Series
                                </Link>
                                <Stack
                                    direction="row"
                                    flexWrap="wrap"
                                    justifyContent={"center"}
                                    alignContent={"center"}
                                    rowGap={4}
                                    columnGap={4}
                                >
                                    {series.map((serie: ISerie) => (
                                        <CardItem data={serie} type="serie" key={serie.id} />
                                    ))}
                                </Stack>
                            </Box>
                        </motion.div>
                        <motion.div
                            ref={genresRef}
                            animate={genresControls}
                            variants={sectionVariants}
                            transition={{ duration: 1 }}
                            initial="hidden"
                            style={{ position: "relative" }}
                        >
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
                                    Explore Genres
                                </Link>
                                <Stack
                                    direction="row"
                                    flexWrap="wrap"
                                    justifyContent={"center"}
                                    alignContent={"center"}
                                    rowGap={4}
                                    columnGap={4}
                                >
                                    {genres.map((genre: IGenre) => (
                                        <GenreItem key={genre.id} genre={genre} />
                                    ))}
                                </Stack>
                            </Box>
                        </motion.div>
                    </Stack>
                </Container>
            </motion.div>
        </main>
    );
}
