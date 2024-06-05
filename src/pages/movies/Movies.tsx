import movieService from "~/services/api/movieService";
import type IMovie from "~/types/IMovie";
import { Box, CircularProgress, Container, Stack, Typography } from "@mui/material";
import { getRandomElements } from "~/utils/utils";
import SEOHelmet from "~/components/seoHelmet/SEOHelmet";
import Carousel from "~/components/carousel/Carousel";
import CardItem from "~/components/cardItem/CardItem";
import { useQuery } from "@tanstack/react-query";
import SortSelect from "~/components/sortSelect/SortSelect";
import { useListPageData } from "~/hooks/useListPageData";
import PaginationControl from "~/components/paginationControl/PaginationControl";
import LatestList from "~/components/latestList/LatestList";
import { useState, useRef, useEffect } from "react";

export default function Movies() {
    const { searchParams, setSearchParams, page, handleChangeSorting } = useListPageData();
    const sortBy = searchParams.get("moviesSortBy");
    const ascOrDesc = searchParams.get("moviesAscOrDesc");

    const [focusTarget, setFocusTarget] = useState<"pagination" | "select" | null>(null);
    const paginationRef = useRef<HTMLDivElement | null>(null);
    const selectRef = useRef<HTMLDivElement | null>(null);

    const fetchMovies = async () => {
        const queryParams: Record<string, string | number> = { page };

        if (sortBy) {
            queryParams.sortBy = sortBy;
        }

        if (ascOrDesc) {
            queryParams.ascOrDesc = ascOrDesc;
        }

        const response = await movieService.getMovies(queryParams);
        return response;
    };

    const moviesQuery = useQuery({
        queryKey: ["movies", sortBy, ascOrDesc, page],
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
        setFocusTarget("pagination");
        setSearchParams(searchParams);
    };

    useEffect(() => {
        if (focusTarget === "pagination" && paginationRef.current) {
            paginationRef.current.focus();
        } else if (focusTarget === "select" && selectRef.current) {
            selectRef.current.focus();
        }
    }, [focusTarget, page, sortBy, ascOrDesc]);

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
                                sortBy={sortBy!}
                                ascOrDesc={ascOrDesc!}
                                onChange={(event) =>
                                    handleChangeSorting("movies", event, setFocusTarget, "select")
                                }
                                type="list"
                                ref={selectRef}
                            />
                        </Box>
                    </Stack>
                    <Box
                        component={"section"}
                        sx={{
                            display: "flex",
                            flexDirection: "column",
                            placeItems: "center",
                            placeContent: "center",
                            rowGap: 4,
                        }}
                    >
                        <Stack
                            direction="row"
                            flexWrap="wrap"
                            justifyContent={"center"}
                            alignContent={"center"}
                            rowGap={8}
                            columnGap={4}
                        >
                            {movies.map((movie: IMovie) => (
                                <CardItem data={movie} type="movie" key={movie.id} />
                            ))}
                        </Stack>
                        <PaginationControl
                            currentPage={Number(page)!}
                            pageCount={pageCount}
                            onPageChange={handlePageChange}
                            ref={paginationRef}
                        />
                    </Box>
                    <LatestList data={latestMovies} type="Movies" />
                </Box>
            </Container>
        </>
    );
}
