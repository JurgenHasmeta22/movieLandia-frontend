import { Box, CircularProgress, Container, Stack, Typography } from "@mui/material";
import HomeHeroSection from "./components/HomeHero";
import { useEffect } from "react";
import ISerie from "~/types/ISerie";
import IGenre from "~/types/IGenre";
import IMovie from "~/types/IMovie";
import { Link } from "react-router-dom";
import movieService from "~/services/api/movieService";
import serieService from "~/services/api/serieService";
import genreService from "~/services/api/genreService";
import GenreItem from "~/components/genreItem/GenreItem";
import { motion, useAnimation } from "framer-motion";
import { useInView } from "react-intersection-observer";
import CardItem from "~/components/cardItem/CardItem";
import { useQuery } from "@tanstack/react-query";
import SEOHelmet from "~/components/seoHelmet/SEOHelmet";

const sectionVariants = {
    hidden: { opacity: 0, y: 100 },
    visible: { opacity: 1, y: 0 },
};

export default function Home() {
    // #region Using Tanstack Query to fetch and store data
    const moviesQuery = useQuery({
        queryKey: ["movies"],
        queryFn: () => movieService.getMovies({}),
    });
    const seriesQuery = useQuery({
        queryKey: ["series"],
        queryFn: () => serieService.getSeries({}),
    });
    const genresQuery = useQuery({
        queryKey: ["genres"],
        queryFn: () => genreService.getGenres({}),
    });

    const movies: IMovie[] = moviesQuery.data?.movies! ?? [];
    const shuffledMovies: IMovie[] = movies.sort(() => Math.random() - 0.5);
    const finalMovies: IMovie[] = shuffledMovies.slice(0, 5);

    const series: ISerie[] = seriesQuery.data?.rows! ?? [];
    const shuffledSeries: ISerie[] = series.sort(() => Math.random() - 0.5);
    const finalSeries: ISerie[] = shuffledSeries.slice(0, 5);

    const genres: IGenre[] = genresQuery.data?.rows! ?? [];
    const shuffledGenres: IGenre[] = genres.sort(() => Math.random() - 0.5);
    const finalGenres: IGenre[] = shuffledGenres.slice(0, 5);
    // #endregion

    // #region "Framer Motion stuff to make divs animated"
    const [moviesRef, moviesInView] = useInView({ triggerOnce: true });
    const moviesControls = useAnimation();

    const [seriesRef, seriesInView] = useInView({ triggerOnce: true });
    const seriesControls = useAnimation();

    const [genresRef, genresInView] = useInView({ triggerOnce: true });
    const genresControls = useAnimation();

    useEffect(() => {
        if (moviesInView) {
            moviesControls.start("visible");
        }
    }, [moviesInView, moviesControls]);

    useEffect(() => {
        if (seriesInView) {
            seriesControls.start("visible");
        }
    }, [seriesInView, seriesControls]);

    useEffect(() => {
        if (genresInView) {
            genresControls.start("visible");
        }
    }, [genresInView, genresControls]);
    // #endregion

    if (moviesQuery.isLoading || seriesQuery.isLoading || genresQuery.isLoading) {
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

    if (moviesQuery.isError || seriesQuery.isError || genresQuery.isError) {
        return (
            <Box
                sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    height: "100vh",
                }}
            >
                <Typography variant="h1">An Error occurred the server is down!</Typography>
            </Box>
        );
    }

    return (
        <>
            <SEOHelmet
                title="MovieLand24 - Your Ultimate Destination for Movies"
                description="Welcome to MovieLand24 - your ultimate destination for movies. Discover a vast collection of movies and enjoy streaming your favorites."
                name="MovieLand24"
                type="website"
                canonicalUrl={"https://example.com/"}
            />
            <HomeHeroSection />
            <Container>
                <Stack flexDirection={"column"} rowGap={10} mb={6} mt={6}>
                    <motion.div
                        ref={moviesRef}
                        animate={moviesControls}
                        variants={sectionVariants}
                        transition={{ duration: 0.5 }}
                        initial="hidden"
                        style={{ position: "relative" }}
                    >
                        <Box
                            display={"flex"}
                            flexDirection={"column"}
                            rowGap={3}
                            component={"section"}
                        >
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
                                {finalMovies.map((movie: any) => (
                                    <CardItem data={movie} key={movie.id} />
                                ))}
                            </Stack>
                        </Box>
                    </motion.div>
                    <motion.div
                        ref={seriesRef}
                        animate={seriesControls}
                        variants={sectionVariants}
                        transition={{ duration: 0.5 }}
                        initial="hidden"
                        style={{ position: "relative" }}
                    >
                        <Box
                            display={"flex"}
                            flexDirection={"column"}
                            rowGap={3}
                            component={"section"}
                        >
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
                                {finalSeries.map((serie: ISerie) => (
                                    <CardItem data={serie} type="serie" key={serie.id} />
                                ))}
                            </Stack>
                        </Box>
                    </motion.div>
                    <motion.div
                        ref={genresRef}
                        animate={genresControls}
                        variants={sectionVariants}
                        transition={{ duration: 0.5 }}
                        initial="hidden"
                        style={{ position: "relative" }}
                    >
                        <Box
                            display={"flex"}
                            flexDirection={"column"}
                            rowGap={3}
                            component={"section"}
                        >
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
                                {finalGenres.map((genre: IGenre) => (
                                    <GenreItem key={genre.id} genre={genre} />
                                ))}
                            </Stack>
                        </Box>
                    </motion.div>
                </Stack>
            </Container>
        </>
    );
}
