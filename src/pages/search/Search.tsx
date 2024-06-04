import { Box, CircularProgress, Container, Stack, Typography } from "@mui/material";
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
    const page = searchParams.get("page") || 1;

    async function searchMoviesByTitle() {
        let response;

        if (term) {
            response = await movieService.searchMoviesByTitle(term, String(page));
        }

        return response;
    }

    async function searchSeriesByTitle() {
        let response;

        if (term) {
            response = await serieService.searchSeriesByTitle(term, String(page));
        }

        return response;
    }

    const moviesQuery = useQuery({
        queryKey: ["movies", term, page],
        queryFn: () => searchMoviesByTitle(),
    });

    const seriesQuery = useQuery({
        queryKey: ["series", term, page],
        queryFn: () => searchSeriesByTitle(),
    });

    const movies: IMovie[] = moviesQuery.data?.movies! ?? [];
    const series: ISerie[] = seriesQuery.data?.series! ?? [];

    // const pageCount = Math.ceil(moviesCount / 10);
    // const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
    //     searchParams.set("page", String(value));
    //     setSearchParams(searchParams);
    // };

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
