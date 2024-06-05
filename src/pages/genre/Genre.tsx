import React from "react";
import { useParams, useSearchParams } from "react-router-dom";
import type IMovie from "~/types/IMovie";
import { Box, CircularProgress, Container, Stack, Typography } from "@mui/material";
import genreService from "~/services/api/genreService";
import SEOHelmet from "~/components/seoHelmet/SEOHelmet";
import { useSorting } from "~/hooks/useSorting";
import CardItem from "~/components/cardItem/CardItem";
import { useQuery } from "@tanstack/react-query";
import Error404 from "../error/Error";
import ISerie from "~/types/ISerie";
import SortSelect from "~/components/sortSelect/SortSelect";
import PaginationControl from "~/components/paginationControl/PaginationControl";

export default function Genre(): React.JSX.Element {
    // #region "State, hooks, searchparams"
    const [searchParams, setSearchParams] = useSearchParams();
    const handleChangeSorting = useSorting();
    const params = useParams();

    const pageMovies = searchParams.get("pageMovies") || 1;
    const pageSeries = searchParams.get("pageSeries") || 1;
    const moviesSortBy = searchParams.get("moviesSortBy");
    const moviesAscOrDesc = searchParams.get("moviesAscOrDesc");
    const seriesSortBy = searchParams.get("seriesSortBy");
    const seriesAscOrDesc = searchParams.get("seriesAscOrDesc");
    // #endregion

    // #region "Data fetching"
    const fetchMoviesByGenre = async () => {
        const queryParams: any = { page: pageMovies };

        if (moviesSortBy) {
            queryParams.sortBy = moviesSortBy;
        }

        if (moviesAscOrDesc) {
            queryParams.ascOrDesc = moviesAscOrDesc;
        }

        queryParams.type = "movie";
        return genreService.getGenreByName(params?.name!, queryParams);
    };

    const fetchSeriesByGenre = async () => {
        const queryParams: any = { page: pageSeries };

        if (seriesSortBy) {
            queryParams.sortBy = seriesSortBy;
        }

        if (seriesAscOrDesc) {
            queryParams.ascOrDesc = seriesAscOrDesc;
        }

        queryParams.type = "serie";
        return genreService.getGenreByName(params?.name!, queryParams);
    };

    const moviesByGenreQuery = useQuery({
        queryKey: ["moviesByGenre", moviesSortBy, moviesAscOrDesc, pageMovies],
        queryFn: () => fetchMoviesByGenre(),
    });
    const moviesByGenre: IMovie[] = moviesByGenreQuery.data?.movies! ?? [];
    const moviesByGenreCount: number = moviesByGenreQuery.data?.count! ?? 0;

    const seriesByGenreQuery = useQuery({
        queryKey: ["seriesByGenre", seriesSortBy, seriesAscOrDesc, pageSeries],
        queryFn: () => fetchSeriesByGenre(),
    });
    const seriesByGenre: ISerie[] = seriesByGenreQuery.data?.series! ?? [];
    const seriesByGenreCount: number = seriesByGenreQuery.data?.count! ?? 0;
    // #endregion

    // #region "Pagination"
    const pageCountMovies = Math.ceil(moviesByGenreCount / 10);
    const handlePageChangeMovies = (event: React.ChangeEvent<unknown>, value: number) => {
        searchParams.set("pageMovies", String(value));
        setSearchParams(searchParams);
    };

    const pageCountSeries = Math.ceil(seriesByGenreCount / 10);
    const handlePageChangeSeries = (event: React.ChangeEvent<unknown>, value: number) => {
        searchParams.set("pageSeries", String(value));
        setSearchParams(searchParams);
    };
    // #endregion

    // #region "Fetching state checking"
    if (moviesByGenreQuery.isLoading) {
        return (
            <Box
                sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    height: "200vh",
                }}
            >
                <CircularProgress size={80} thickness={4} color="secondary" />
            </Box>
        );
    }

    if (moviesByGenreQuery.isError || moviesByGenreQuery.data.error) {
        return <Error404 />;
    }

    if (moviesByGenre?.length === 0) {
        return (
            <Box
                sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    height: "200vh",
                }}
            >
                <Typography fontSize={40} color={"secondary"}>
                    There are no movies with this genre
                </Typography>
            </Box>
        );
    }
    // #endregion

    return (
        <>
            <SEOHelmet
                title={`Watch movies of genre ${params?.name} on MovieLand24`}
                description={`Watch all movies related to this genres in high quality and including the latest movies and series to this genre  ${params?.name}`}
                name="MovieLand24"
                type="article"
                canonicalUrl={`https://example.com/genre/${params?.name}`}
            />
            <Container>
                <Box
                    sx={{
                        display: "flex",
                        flexDirection: "column",
                        rowGap: 4,
                        paddingTop: 4,
                    }}
                >
                    <Box display="flex" justifyContent="space-between" alignItems="center" mt={4}>
                        <Typography
                            sx={{
                                fontSize: [16, 18, 20, 24, 26],
                            }}
                            color={"secondary"}
                            variant="h2"
                            textAlign={"center"}
                        >
                            {`Movies of genre ${params.name}`}
                        </Typography>
                        <Box
                            sx={{
                                display: "flex",
                                justifyContent: "flex-end",
                                alignItems: "center",
                            }}
                        >
                            <SortSelect
                                sortBy={searchParams.get("moviesSortBy")}
                                ascOrDesc={searchParams.get("moviesAscOrDesc")}
                                onChange={(event) => handleChangeSorting("movies", event)}
                                type="list"
                            />
                        </Box>
                    </Box>
                    <Stack
                        direction="row"
                        flexWrap="wrap"
                        justifyContent={"start"}
                        alignContent={"center"}
                        rowGap={8}
                        columnGap={4}
                    >
                        {moviesByGenre.map((movie: IMovie, index: number) => (
                            <CardItem data={movie} key={index} type="movie" />
                        ))}
                    </Stack>
                    <PaginationControl
                        currentPage={Number(pageMovies)!}
                        pageCount={pageCountMovies}
                        onPageChange={handlePageChangeMovies}
                    />
                    <Stack
                        display="flex"
                        flexDirection="row"
                        alignItems="center"
                        component="section"
                        mt={4}
                    >
                        <Box
                            display="flex"
                            justifyContent="start"
                            alignItems="center"
                            sx={{ flexGrow: 1 }}
                        >
                            <Typography
                                sx={{
                                    fontSize: [16, 18, 20, 24, 26],
                                }}
                                color={"secondary"}
                                variant="h2"
                                textAlign={"center"}
                            >
                                {`Series of genre ${params.name}`}
                            </Typography>
                        </Box>
                        <Box
                            sx={{
                                display: "flex",
                                justifyContent: "flex-end",
                                alignItems: "center",
                            }}
                        >
                            <SortSelect
                                sortBy={searchParams.get("seriesSortBy")}
                                ascOrDesc={searchParams.get("seriesAscOrDesc")}
                                onChange={(event) => handleChangeSorting("series", event)}
                                type="list"
                            />
                        </Box>
                    </Stack>
                    <Stack
                        direction="row"
                        flexWrap="wrap"
                        justifyContent={"start"}
                        alignContent={"center"}
                        rowGap={8}
                        columnGap={4}
                    >
                        {seriesByGenre.map((serie: ISerie, index: number) => (
                            <CardItem data={serie} key={index} type="serie" />
                        ))}
                    </Stack>
                    <PaginationControl
                        currentPage={Number(pageSeries)!}
                        pageCount={pageCountSeries}
                        onPageChange={handlePageChangeSeries}
                    />
                </Box>
            </Container>
        </>
    );
}
