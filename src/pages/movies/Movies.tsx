import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import movieService from "~/services/api/movieService";
import type IMovie from "~/types/IMovie";
import {
    Box,
    CircularProgress,
    MenuItem,
    Pagination,
    Select,
    Stack,
    Typography,
} from "@mui/material";
import { getRandomElements, toFirstWordUpperCase } from "~/utils/utils";
import SEOHelmet from "~/components/seoHelmet/SEOHelmet";
import { useSorting } from "~/hooks/useSorting";
import Carousel from "~/components/carousel/Carousel";
import CardItem from "~/components/cardItem/CardItem";
import { motion, useAnimation } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { useQuery } from "@tanstack/react-query";

const sectionVariants = {
    hidden: { opacity: 0, y: 100 },
    visible: { opacity: 1, y: 0 },
};

export default function Movies() {
    const [searchParams, setSearchParams] = useSearchParams();
    const handleChangeSorting = useSorting();

    // #region "Data fetching and handling data"
    const page = searchParams.get("page") || 1;
    const search = searchParams.get("search");
    const sortBy = searchParams.get("sortBy");
    const ascOrDesc = searchParams.get("ascOrDesc");

    const fetchMovies = async () => {
        let response;
        const queryParams: Record<string, string | number> = { page };

        if (search) {
            response = await movieService.searchMoviesByTitle(search, String(page));
        } else {
            if (sortBy) queryParams.sortBy = sortBy;
            if (ascOrDesc) queryParams.ascOrDesc = ascOrDesc;
            response = await movieService.getMovies(queryParams);
        }

        return response;
    };

    const moviesQuery = useQuery({
        queryKey: ["movies", search, sortBy, ascOrDesc, page],
        queryFn: () => fetchMovies(),
    });
    const latestMoviesQuery = useQuery({
        queryKey: ["latestMovies"],
        queryFn: () => movieService.getLatestMovies(),
    });
    const movies: IMovie[] = moviesQuery.data?.movies! ?? [];
    const moviesCount: number = moviesQuery.data?.count! ?? 0;
    const latestMovies: IMovie[] = latestMoviesQuery.data! ?? [];
    const moviesCarouselImages = getRandomElements(movies, 5);
    // #endregion

    // #region "Pagination logic"
    const pageCount = Math.ceil(moviesCount / 10);
    const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
        searchParams.set("page", String(value));
        setSearchParams(searchParams);
    };
    // #endregion

    // #region "Framer Motion animations logic"
    const [moviesRef, moviesInView] = useInView({ triggerOnce: false });
    const [moviesLatestRef, moviesLatestInView] = useInView({ triggerOnce: false });
    const moviesControls = useAnimation();
    const moviesLatestControls = useAnimation();

    useEffect(() => {
        if (moviesInView) {
            moviesControls.start("visible");
        }
    }, [moviesInView, moviesControls]);

    useEffect(() => {
        if (moviesLatestInView) {
            moviesLatestControls.start("visible");
        }
    }, [moviesLatestInView, moviesLatestControls]);
    // #endregion

    // #region "Data state spinners, errrors check"
    if (moviesQuery.isLoading || latestMoviesQuery.isLoading) {
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

    if (moviesQuery.isError || latestMoviesQuery.isError) {
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
    // #endregion

    return (
        <>
            <SEOHelmet
                title="MovieLand24 - Your Ultimate Destination for Movies"
                description="Welcome to MovieLand24 - your ultimate destination for movies. Discover a vast collection of movies and enjoy streaming your favorites."
                name="MovieLand24"
                type="website"
                canonicalUrl="https://example.com/movies"
            />
            <main>
                <Box
                    sx={{
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "center",
                        rowGap: 4,
                        paddingTop: 4,
                    }}
                    component={"section"}
                >
                    {!searchParams.get("search") && (
                        <Box mt={4} component={"section"}>
                            <Carousel data={moviesCarouselImages} type="movies" />
                        </Box>
                    )}
                    {!searchParams.get("search") && (
                        <Stack
                            display="flex"
                            flexDirection="row"
                            alignItems="center"
                            component="section"
                        >
                            <Box
                                display="flex"
                                justifyContent="center"
                                alignItems="center"
                                sx={{ flexGrow: 1 }}
                                pl={18}
                            >
                                <Typography fontSize={22} color="secondary" variant="h2">
                                    All Movies
                                </Typography>
                            </Box>
                            <Box
                                sx={{
                                    display: "flex",
                                    flexDirection: "row",
                                    justifyContent: "flex-end",
                                    alignItems: "center",
                                    columnGap: 1,
                                    mr: 4,
                                }}
                            >
                                <Typography color={"secondary"} fontSize={16} variant="h3">
                                    Sort by:
                                </Typography>
                                <Box sx={{ display: "flex", flexDirection: "row", columnGap: 1 }}>
                                    <Select
                                        defaultValue={"none"}
                                        value={
                                            searchParams.get("sortBy") &&
                                            searchParams.get("ascOrDesc")
                                                ? searchParams.get("sortBy")! +
                                                  toFirstWordUpperCase(
                                                      searchParams.get("ascOrDesc")!,
                                                  )
                                                : "none"
                                        }
                                        onChange={handleChangeSorting}
                                    >
                                        <MenuItem value={"none"}>None</MenuItem>
                                        <MenuItem value={"ratingImdbAsc"}>
                                            Imdb rating (Asc)
                                        </MenuItem>
                                        <MenuItem value={"ratingImdbDesc"}>
                                            Imdb rating (Desc)
                                        </MenuItem>
                                        <MenuItem value={"titleAsc"}>Title (Asc)</MenuItem>
                                        <MenuItem value={"titleDesc"}>Title (Desc)</MenuItem>
                                    </Select>
                                </Box>
                            </Box>
                        </Stack>
                    )}
                    {movies.length !== 0 ? (
                        <motion.div
                            ref={moviesRef}
                            animate={moviesControls}
                            variants={sectionVariants}
                            transition={{ duration: 1 }}
                            initial="hidden"
                            style={{ position: "relative" }}
                        >
                            <Stack
                                direction="row"
                                flexWrap="wrap"
                                justifyContent={"center"}
                                alignContent={"center"}
                                rowGap={8}
                                columnGap={4}
                                sx={{
                                    marginTop: `${searchParams.get("search") ? 2.5 : 0.2}rem`,
                                }}
                            >
                                {movies.map((movie: IMovie) => (
                                    <CardItem data={movie} key={movie.id} />
                                ))}
                            </Stack>
                        </motion.div>
                    ) : (
                        <Box
                            sx={{
                                height: "50vh",
                                display: "flex",
                                placeItems: "center",
                                placeContent: "center",
                            }}
                            component={"section"}
                        >
                            <Typography component={"h1"} fontSize={20} textAlign={"center"}>
                                No Search Result, no movie found with that criteria.
                            </Typography>
                        </Box>
                    )}
                    <Stack
                        spacing={2}
                        sx={{
                            display: "flex",
                            placeItems: "center",
                            marginTop: 2,
                            marginBottom: 4,
                        }}
                    >
                        <Pagination
                            page={searchParams.get("page") ? Number(searchParams.get("page")) : 1}
                            size="large"
                            count={pageCount}
                            showFirstButton
                            showLastButton
                            onChange={handlePageChange}
                            color="secondary"
                        />
                    </Stack>
                    {!searchParams.get("search") && (
                        <Box
                            component={"section"}
                            sx={{
                                display: "flex",
                                flexDirection: "column",
                                rowGap: 2,
                                marginBottom: 4,
                            }}
                        >
                            <Box sx={{ display: "flex", placeContent: "center" }}>
                                <Typography fontSize={22} color={"secondary"} variant="h2">
                                    Latest Movies
                                </Typography>
                            </Box>
                            <motion.div
                                ref={moviesLatestRef}
                                animate={moviesLatestControls}
                                variants={sectionVariants}
                                transition={{ duration: 1 }}
                                initial="hidden"
                                style={{ position: "relative" }}
                            >
                                <Stack
                                    direction="row"
                                    flexWrap="wrap"
                                    rowGap={8}
                                    columnGap={4}
                                    justifyContent={"center"}
                                    alignContent={"center"}
                                    marginTop={3}
                                    mb={4}
                                >
                                    {latestMovies?.map((latestMovie: IMovie) => (
                                        <CardItem data={latestMovie} key={latestMovie.id} />
                                    ))}
                                </Stack>
                            </motion.div>
                        </Box>
                    )}
                </Box>
            </main>
        </>
    );
}
