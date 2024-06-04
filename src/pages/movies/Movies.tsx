import { useSearchParams } from "react-router-dom";
import movieService from "~/services/api/movieService";
import type IMovie from "~/types/IMovie";
import { Box, CircularProgress, Container, Pagination, Stack, Typography } from "@mui/material";
import { getRandomElements } from "~/utils/utils";
import SEOHelmet from "~/components/seoHelmet/SEOHelmet";
import { useSorting } from "~/hooks/useSorting";
import Carousel from "~/components/carousel/Carousel";
import CardItem from "~/components/cardItem/CardItem";
import { useQuery } from "@tanstack/react-query";
import SortSelect from "~/components/sortSelect/SortSelect";

export default function Movies() {
    const [searchParams, setSearchParams] = useSearchParams();
    const handleChangeSorting = useSorting();

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
            if (sortBy) {
                queryParams.sortBy = sortBy;
            }

            if (ascOrDesc) {
                queryParams.ascOrDesc = ascOrDesc;
            }

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

    const pageCount = Math.ceil(moviesCount / 10);

    const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
        searchParams.set("page", String(value));
        setSearchParams(searchParams);
    };

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

    return (
        <>
            <SEOHelmet
                title="Watch the Latest Movies | High-Quality and Always Updated"
                description="Discover and watch the latest and most amazing movies in high quality. Our collection is always updated with the newest episodes and releases."
                name="MovieLand24"
                type="website"
                canonicalUrl="https://example.com/movies"
            />
            <Container>
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
                            justifyContent={"space-between"}
                            alignItems="center"
                            component="section"
                        >
                            <Box ml={1}>
                                <Typography fontSize={28} color="secondary" variant="h2">
                                    Movies
                                </Typography>
                            </Box>
                            <Box mr={1}>
                                <SortSelect
                                    sortBy={searchParams.get("sortBy")}
                                    ascOrDesc={searchParams.get("ascOrDesc")}
                                    onChange={handleChangeSorting}
                                    type="list"
                                />
                            </Box>
                        </Stack>
                    )}
                    {movies.length !== 0 ? (
                        <Box display={"flex"} flexDirection={"column"}>
                            {searchParams.get("search")! && (
                                <Box ml={1} mt={4}>
                                    <Typography fontSize={28} color="secondary" variant="h2">
                                        Movies
                                    </Typography>
                                </Box>
                            )}
                            <Stack
                                direction="row"
                                flexWrap="wrap"
                                justifyContent={"flex-start"}
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
                        </Box>
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
                            <Typography component={"h1"} fontSize={24} textAlign={"center"}>
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
                        </Box>
                    )}
                </Box>
            </Container>
        </>
    );
}
