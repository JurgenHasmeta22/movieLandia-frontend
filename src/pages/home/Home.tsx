import { Box, Container, Stack, Typography } from "@mui/material";
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
import Loading from "~/components/loading/Loading";

const sectionVariants = {
    hidden: { opacity: 0, y: 100 },
    visible: { opacity: 1, y: 0 },
};

export default function Home() {
    // #region "Data fetching"
    const moviesQuery = useQuery({
        queryKey: ["movies"],
        queryFn: () => movieService.getMovies({}),
    });
    const movies: IMovie[] = moviesQuery.data?.movies! ?? [];
    const finalMovies: IMovie[] = movies.slice(0, 5);

    const seriesQuery = useQuery({
        queryKey: ["series"],
        queryFn: () => serieService.getSeries({}),
    });
    const series: ISerie[] = seriesQuery.data?.rows! ?? [];
    const finalSeries: ISerie[] = series.slice(0, 5);

    const genresQuery = useQuery({
        queryKey: ["genres"],
        queryFn: () => genreService.getGenres({}),
    });
    const genres: IGenre[] = genresQuery.data?.rows! ?? [];
    const finalGenres: IGenre[] = genres.slice(0, 5);
    // #endregion

    // #region "Refs, animation"
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

    // #region "Checking fetching state"
    if (moviesQuery.isLoading || seriesQuery.isLoading || genresQuery.isLoading) {
        return (
            <Loading />
        );
    }

    if (moviesQuery.isError || seriesQuery.isError || genresQuery.isError) {
        return (
            <Box
                sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    height: "200vh",
                }}
            >
                <Typography variant="h1">An Error occurred the server is down!</Typography>
            </Box>
        );
    }
    // #endregion

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
                        key={"movie"}
                        data={finalMovies}
                        dataControls={moviesControls}
                        dataRef={moviesRef}
                        dataVariants={sectionVariants}
                        type="movie"
                        link="/movies"
                        linkText="Explore All Movies"
                    />
                    <ListHomeSection
                        key={"serie"}
                        data={finalSeries}
                        dataControls={seriesControls}
                        dataRef={seriesRef}
                        dataVariants={sectionVariants}
                        type="serie"
                        link="/series"
                        linkText="Explore All Series"
                    />
                    <ListHomeSection
                        key={"genre"}
                        data={finalGenres}
                        dataControls={genresControls}
                        dataRef={genresRef}
                        dataVariants={sectionVariants}
                        type="genre"
                        link="/genres"
                        linkText="Explore All Genres"
                    />
                </Stack>
            </Container>
        </>
    );
}
