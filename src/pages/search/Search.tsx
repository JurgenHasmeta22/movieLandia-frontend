import { Box, CircularProgress, Container, Stack, Typography } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import CardItem from "~/components/cardItem/CardItem";
import PaginationControl from "~/components/paginationControl/PaginationControl";
import SortSelect from "~/components/sortSelect/SortSelect";
import { useSorting } from "~/hooks/useSorting";
import movieService from "~/services/api/movieService";
import serieService from "~/services/api/serieService";
import IMovie from "~/types/IMovie";
import ISerie from "~/types/ISerie";

export function Search() {
    const [searchParams, setSearchParams] = useSearchParams();
    const handleChangeSorting = useSorting();

    const term = searchParams.get("term");
    const pageMovies = searchParams.get("pageMovies") || 1;
    const pageSeries = searchParams.get("pageSeries") || 1;
    const moviesSortBy = searchParams.get("moviesSortBy");
    const moviesAscOrDesc = searchParams.get("moviesAscOrDesc");
    const seriesSortBy = searchParams.get("seriesSortBy");
    const seriesAscOrDesc = searchParams.get("seriesAscOrDesc");

    const [focusTarget, setFocusTarget] = useState<
        "paginationMovies" | "paginationSeries" | "selectMovies" | "selectSeries" | null
    >(null);
    const paginationMoviesRef = useRef<HTMLDivElement | null>(null);
    const selectMoviesRef = useRef<HTMLDivElement | null>(null);
    const paginationSeriesRef = useRef<HTMLDivElement | null>(null);
    const selectSeriesRef = useRef<HTMLDivElement | null>(null);

    async function searchMoviesByTitle() {
        let response;
        const queryParams: any = { page: pageMovies };

        if (moviesSortBy) {
            queryParams.sortBy = moviesSortBy;
        }

        if (moviesAscOrDesc) {
            queryParams.ascOrDesc = moviesAscOrDesc;
        }

        if (term) {
            response = await movieService.searchMoviesByTitle(term, queryParams);
        } else {
            response = await movieService.getMovies(queryParams);
        }

        return response;
    }

    async function searchSeriesByTitle() {
        let response;
        const queryParams: any = { page: pageSeries };

        if (seriesSortBy) {
            queryParams.sortBy = seriesSortBy;
        }

        if (seriesAscOrDesc) {
            queryParams.ascOrDesc = seriesAscOrDesc;
        }

        if (term) {
            response = await serieService.searchSeriesByTitle(term, queryParams);
        } else {
            response = await serieService.searchSeriesByTitle("", queryParams);
        }

        return response;
    }

    const moviesQuery = useQuery({
        queryKey: ["movies", term, pageMovies, moviesSortBy, moviesAscOrDesc],
        queryFn: () => searchMoviesByTitle(),
    });
    const movies: IMovie[] = moviesQuery.data?.movies! ?? [];
    const moviesCount: number = moviesQuery.data?.count! ?? 0;

    const seriesQuery = useQuery({
        queryKey: ["series", term, pageSeries, seriesSortBy, seriesAscOrDesc],
        queryFn: () => searchSeriesByTitle(),
    });
    const series: ISerie[] = seriesQuery.data?.series! ?? [];
    const seriesCount: number = seriesQuery.data?.count! ?? 0;

    const pageCountMovies = Math.ceil(moviesCount / 10);
    const handlePageChangeMovies = (event: React.ChangeEvent<unknown>, value: number) => {
        searchParams.set("pageMovies", String(value));
        setFocusTarget("paginationMovies");
        setSearchParams(searchParams);
    };

    const pageCountSeries = Math.ceil(seriesCount / 10);
    const handlePageChangeSeries = (event: React.ChangeEvent<unknown>, value: number) => {
        searchParams.set("pageSeries", String(value));
        setFocusTarget("paginationSeries");
        setSearchParams(searchParams);
    };

    useEffect(() => {
        if (focusTarget === "paginationMovies" && paginationMoviesRef.current) {
            paginationMoviesRef.current.focus();
        } else if (focusTarget === "paginationSeries" && paginationSeriesRef.current) {
            paginationSeriesRef.current.focus();
        } else if (focusTarget === "selectMovies" && selectMoviesRef.current) {
            selectMoviesRef.current.focus();
        } else if (focusTarget === "selectSeries" && selectSeriesRef.current) {
            selectSeriesRef.current.focus();
        }
    }, [
        focusTarget,
        pageMovies,
        pageSeries,
        moviesSortBy,
        seriesSortBy,
        moviesAscOrDesc,
        seriesAscOrDesc,
    ]);

    if (moviesQuery.isLoading || seriesQuery.isLoading) {
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

    if (moviesQuery.isError || seriesQuery.isError) {
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
        <Container>
            <Box
                sx={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    rowGap: 2,
                    marginTop: 4,
                    marginBottom: 4,
                }}
                component={"section"}
            >
                {movies.length !== 0 ? (
                    <Box display={"flex"} flexDirection={"column"} rowGap={3}>
                        <Box
                            ml={1}
                            mt={4}
                            display="flex"
                            justifyContent="space-between"
                            alignItems="center"
                        >
                            <Typography fontSize={28} color="secondary" variant="h2">
                                Movies
                            </Typography>
                            <Box
                                sx={{
                                    display: "flex",
                                    justifyContent: "flex-end",
                                    alignItems: "center",
                                }}
                            >
                                <SortSelect
                                    sortBy={moviesSortBy}
                                    ascOrDesc={moviesAscOrDesc}
                                    onChange={(event) =>
                                        handleChangeSorting(
                                            "movies",
                                            event,
                                            setFocusTarget,
                                            "selectMovies",
                                        )
                                    }
                                    type="list"
                                    ref={selectMoviesRef}
                                />
                            </Box>
                        </Box>
                        <Box>
                            <Stack
                                direction="row"
                                flexWrap="wrap"
                                justifyContent={"flex-start"}
                                alignContent={"center"}
                                rowGap={8}
                                columnGap={4}
                                sx={{
                                    marginTop: `${term} ? 2.5 : 0.2}rem`,
                                }}
                            >
                                {movies.map((movie: IMovie) => (
                                    <CardItem data={movie} type="movie" key={movie.id} />
                                ))}
                            </Stack>
                            <PaginationControl
                                currentPage={Number(pageMovies)!}
                                pageCount={pageCountMovies}
                                onPageChange={handlePageChangeMovies}
                                ref={paginationMoviesRef}
                            />
                        </Box>
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
                {series.length !== 0 ? (
                    <Box display={"flex"} flexDirection={"column"} rowGap={3}>
                        <Box
                            ml={1}
                            mt={4}
                            display="flex"
                            justifyContent="space-between"
                            alignItems="center"
                        >
                            <Typography fontSize={28} color="secondary" variant="h2">
                                Series
                            </Typography>
                            <Box
                                sx={{
                                    display: "flex",
                                    justifyContent: "flex-end",
                                    alignItems: "center",
                                }}
                            >
                                <SortSelect
                                    sortBy={seriesSortBy}
                                    ascOrDesc={seriesAscOrDesc}
                                    onChange={(event) =>
                                        handleChangeSorting(
                                            "series",
                                            event,
                                            setFocusTarget,
                                            "selectSeries",
                                        )
                                    }
                                    type="list"
                                    ref={selectSeriesRef}
                                />
                            </Box>
                        </Box>
                        <Box>
                            <Stack
                                direction="row"
                                flexWrap="wrap"
                                justifyContent={"flex-start"}
                                alignContent={"center"}
                                rowGap={8}
                                columnGap={4}
                                sx={{
                                    marginTop: `${term} ? 2.5 : 0.2}rem`,
                                }}
                            >
                                {series.map((serie: ISerie) => (
                                    <CardItem data={serie} type="serie" key={serie.id} />
                                ))}
                            </Stack>
                            <PaginationControl
                                currentPage={Number(pageSeries)!}
                                pageCount={pageCountSeries}
                                onPageChange={handlePageChangeSeries}
                                ref={paginationSeriesRef}
                            />
                        </Box>
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
                            No Search Result, no serie found with that criteria.
                        </Typography>
                    </Box>
                )}
            </Box>
        </Container>
    );
}

export default Search;
