import { Box, CircularProgress, Container, Pagination, Stack, Typography } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "react-router-dom";
import CardItem from "~/components/cardItem/CardItem";
import movieService from "~/services/api/movieService";
import serieService from "~/services/api/serieService";
import IMovie from "~/types/IMovie";
import ISerie from "~/types/ISerie";

export function Search() {
    const [searchParams, setSearchParams] = useSearchParams();
    const term = searchParams.get("term");
    const pageMovies = searchParams.get("pageMovies") || 1;
    const pageSeries = searchParams.get("pageSeries") || 1;

    async function searchMoviesByTitle() {
        let response;

        if (term) {
            response = await movieService.searchMoviesByTitle(term, String(pageMovies));
        }

        return response;
    }

    async function searchSeriesByTitle() {
        let response;

        if (term) {
            response = await serieService.searchSeriesByTitle(term, String(pageSeries));
        }

        return response;
    }

    const moviesQuery = useQuery({
        queryKey: ["movies", term, pageMovies],
        queryFn: () => searchMoviesByTitle(),
    });

    const seriesQuery = useQuery({
        queryKey: ["series", term, pageSeries],
        queryFn: () => searchSeriesByTitle(),
    });

    const movies: IMovie[] = moviesQuery.data?.movies! ?? [];
    const moviesCount: number = moviesQuery.data?.count! ?? 0;
    const series: ISerie[] = seriesQuery.data?.series! ?? [];
    const seriesCount: number = seriesQuery.data?.count! ?? 0;

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
                    rowGap: 8,
                    marginTop: 6,
                    marginBottom: 6,
                }}
                component={"section"}
            >
                {movies.length !== 0 ? (
                    <Box display={"flex"} flexDirection={"column"} rowGap={2}>
                        <Box ml={1} mt={4}>
                            <Typography fontSize={28} color="secondary" variant="h2">
                                Movies
                            </Typography>
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
                                    marginTop: `${searchParams.get("search") ? 2.5 : 0.2}rem`,
                                }}
                            >
                                {movies.map((movie: IMovie) => (
                                    <CardItem data={movie} type="movie" key={movie.id} />
                                ))}
                            </Stack>
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
                                    page={
                                        searchParams.get("pageMovies")
                                            ? Number(searchParams.get("pageMovies"))
                                            : 1
                                    }
                                    size="large"
                                    count={pageCountMovies}
                                    showFirstButton
                                    showLastButton
                                    onChange={handlePageChangeMovies}
                                    color="secondary"
                                />
                            </Stack>
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
                    <Box display={"flex"} flexDirection={"column"} rowGap={2}>
                        <Box ml={1} mt={4}>
                            <Typography fontSize={28} color="secondary" variant="h2">
                                Series
                            </Typography>
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
                                    marginTop: `${searchParams.get("search") ? 2.5 : 0.2}rem`,
                                }}
                            >
                                {series.map((serie: ISerie) => (
                                    <CardItem data={serie} type="serie" key={serie.id} />
                                ))}
                            </Stack>
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
                                    page={
                                        searchParams.get("pageSeries")
                                            ? Number(searchParams.get("pageSeries"))
                                            : 1
                                    }
                                    size="large"
                                    count={pageCountSeries}
                                    showFirstButton
                                    showLastButton
                                    onChange={handlePageChangeSeries}
                                    color="secondary"
                                />
                            </Stack>
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
