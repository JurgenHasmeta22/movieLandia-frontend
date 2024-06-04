import { Box, CircularProgress, Container, Stack, Typography } from "@mui/material";
import HomeHeroSection from "./components/HomeHero";
import { useEffect } from "react";
import ISerie from "~/types/ISerie";
import IGenre from "~/types/IGenre";
import IMovie from "~/types/IMovie";
import movieService from "~/services/api/movieService";
import serieService from "~/services/api/serieService";
import genreService from "~/services/api/genreService";
import { useAnimation } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { useQuery } from "@tanstack/react-query";
import SEOHelmet from "~/components/seoHelmet/SEOHelmet";
import ListHomeSection from "./components/ListHomeSection";

const sectionVariants = {
    hidden: { opacity: 0, y: 100 },
    visible: { opacity: 1, y: 0 },
};

export default function Home() {
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
                    <ListHomeSection
                        data={finalMovies}
                        dataControls={moviesControls}
                        dataRef={moviesRef}
                        dataVariants={sectionVariants}
                        type="movie"
                        link="/movies"
                        linkText="Explore Movies"
                    />
                    <ListHomeSection
                        data={finalSeries}
                        dataControls={seriesControls}
                        dataRef={seriesRef}
                        dataVariants={sectionVariants}
                        type="serie"
                        link="/series"
                        linkText="Explore Series"
                    />
                    <ListHomeSection
                        data={finalGenres}
                        dataControls={genresControls}
                        dataRef={genresRef}
                        dataVariants={sectionVariants}
                        type="genre"
                        link="/genres"
                        linkText="Explore Genres"
                    />
                </Stack>
            </Container>
        </>
    );
}
