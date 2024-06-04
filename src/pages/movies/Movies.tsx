import movieService from "~/services/api/movieService";
import type IMovie from "~/types/IMovie";
import { Box, CircularProgress, Container, Pagination, Stack, Typography } from "@mui/material";
import { getRandomElements } from "~/utils/utils";
import SEOHelmet from "~/components/seoHelmet/SEOHelmet";
import Carousel from "~/components/carousel/Carousel";
import CardItem from "~/components/cardItem/CardItem";
import { useQuery } from "@tanstack/react-query";
import SortSelect from "~/components/sortSelect/SortSelect";
import { useListPageData } from "~/hooks/useListPageData";
import { useListPageFetching } from "~/hooks/useListPageFetching";
import PaginationControl from "~/components/paginationControl/PaginationControl";

export default function Movies() {
    const { searchParams, setSearchParams, handleChangeSorting, page, search, sortBy, ascOrDesc } =
        useListPageData();

    const { fetchListData } = useListPageFetching({
        type: "movies",
        page,
        sortBy,
        ascOrDesc,
    });

    const moviesQuery = useQuery({
        queryKey: ["movies", search, sortBy, ascOrDesc, page],
        queryFn: () => fetchListData(),
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
                    <Box mt={4} component={"section"}>
                        <Carousel data={moviesCarouselImages} type="movies" />
                    </Box>
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
                    <PaginationControl
                        currentPage={Number(page)!}
                        pageCount={pageCount}
                        onPageChange={handlePageChange}
                    />
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
                </Box>
            </Container>
        </>
    );
}
