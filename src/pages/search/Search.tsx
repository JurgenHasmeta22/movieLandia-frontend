import { Box, Container, Divider, Stack, Typography, useTheme } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "react-router-dom";
import CardItem from "~/components/cardItem/CardItem";
import PaginationControl from "~/components/paginationControl/PaginationControl";
import SortSelect from "~/components/sortSelect/SortSelect";
import { useSorting } from "~/hooks/useSorting";
import movieService from "~/services/api/movieService";
import serieService from "~/services/api/serieService";
import IMovie from "~/types/IMovie";
import ISerie from "~/types/ISerie";
import { tokens } from "~/utils/theme";
import Loading from "~/components/loading/Loading";

export function Search() {
    // #region "State, hooks, searchParams"
    const [searchParams, setSearchParams] = useSearchParams();
    const handleChangeSorting = useSorting();
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);

    const term = searchParams.get("term");
    const pageMovies = searchParams.get("pageMovies") || 1;
    const pageSeries = searchParams.get("pageSeries") || 1;
    const moviesSortBy = searchParams.get("moviesSortBy");
    const moviesAscOrDesc = searchParams.get("moviesAscOrDesc");
    const seriesSortBy = searchParams.get("seriesSortBy");
    const seriesAscOrDesc = searchParams.get("seriesAscOrDesc");
    // #endregion

    // #region "Data fetching"
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
    // #endregion

    // #region "Pagination"
    const pageCountMovies = Math.ceil(moviesCount / 10);
    const handlePageChangeMovies = (event: React.ChangeEvent<unknown>, value: number) => {
        searchParams.set("pageMovies", String(value));
        setSearchParams(searchParams);
    };

    const pageCountSeries = Math.ceil(seriesCount / 10);
    const handlePageChangeSeries = (event: React.ChangeEvent<unknown>, value: number) => {
        searchParams.set("pageSeries", String(value));
        setSearchParams(searchParams);
    };
    // #endregion

    // #region "Fetching State"
    if (moviesQuery.isLoading || seriesQuery.isLoading) {
        return <Loading />;
    }

    if (moviesQuery.isError || seriesQuery.isError) {
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
                    <>
                        <Box display={"flex"} flexDirection={"column"} rowGap={3}>
                            <Box ml={1} mt={4} display="flex" justifyContent="space-between" alignItems="center">
                                <Box>
                                    <Typography fontSize={28} color="secondary" variant="h2">
                                        Movies
                                    </Typography>
                                    <Divider
                                        sx={{ borderBottomWidth: 3, background: colors.greenAccent[500], mt: 1 }}
                                    />
                                </Box>
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
                                        onChange={(event) => handleChangeSorting("movies", event)}
                                        type="list"
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
                                />
                            </Box>
                        </Box>
                        <Divider sx={{ borderBottomWidth: 3, background: colors.greenAccent[500] }} />
                    </>
                ) : (
                    <>
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
                                No search result, no movie found with that criteria.
                            </Typography>
                        </Box>
                        <Divider sx={{ borderBottomWidth: 3, background: colors.greenAccent[500] }} />
                    </>
                )}
                {series.length !== 0 ? (
                    <Box display={"flex"} flexDirection={"column"} rowGap={3}>
                        <Box ml={1} mt={4} display="flex" justifyContent="space-between" alignItems="center">
                            <Box>
                                <Typography fontSize={28} color="secondary" variant="h2">
                                    Series
                                </Typography>
                                <Divider sx={{ borderBottomWidth: 3, background: colors.greenAccent[500], mt: 1 }} />
                            </Box>
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
                                    onChange={(event) => handleChangeSorting("series", event)}
                                    type="list"
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
                            No search result, no serie found with that criteria.
                        </Typography>
                    </Box>
                )}
            </Box>
        </Container>
    );
}

export default Search;
