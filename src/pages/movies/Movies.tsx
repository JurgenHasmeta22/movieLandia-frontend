import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import movieService from "~/services/api/movieService";
import type IMovie from "~/types/IMovie";
import type IMoviesSearchResponse from "~/types/IMovieSearchResponse";
import type IMoviesResponse from "~/types/IMoviesResponse";
import MoviesCarousel from "~/pages/movies/moviesCarousel/MoviesCarousel";
import MovieItem from "~/components/movieItem/MovieItem";
import {
    Box,
    CircularProgress,
    MenuItem,
    Pagination,
    Select,
    Stack,
    Typography,
    useTheme,
} from "@mui/material";
import { tokens } from "~/utils/theme";
import { toFirstWordUpperCase } from "~/utils/utils";
import SEOHelmet from "~/components/seoHelmet/SEOHelmet";
import { useSorting } from "~/hooks/useSorting";

const api = {
    url: import.meta.env.VITE_API_URL,
};

export default function Movies() {
    const [movies, setMovies] = useState<IMovie[] | undefined>(undefined);
    const [latestMovies, setLatestMovies] = useState<IMovie[]>([]);
    const [moviesCount, setMoviesCount] = useState<number | null>(null);
    const [moviesCountSearch, setMoviesCountSearch] = useState<number | null>(null);
    const [moviesCarouselImages, setMoviesCarouselImages] = useState<any[]>([
        {
            source: `${api.url}/images/movies/1gxZrx9gL9ov2c1NpXimEUzMTmh.jpg`,
            title: "Spider-Man: No Way Home (2021)",
        },
        {
            source: `${api.url}/images/movies/1RjyfPLsZTq3lUdJY7pTzcmpPKl.jpg`,
            title: "Eternals (2021)",
        },
        {
            source: `${api.url}/images/movies/1TkkTo8UiRl5lWM5qkAISHXg0fU.jpg`,
            title: "Freaks Out (2021)",
        },
        {
            source: `${api.url}/images/movies/1ZiZ3eVUWPxJROTkYbH8FBC9UuB.jpg`,
            title: "The Girl on the Mountain (2022)",
        },
        {
            source: `${api.url}/images/movies/4kiVg3QJQghjtRupyfWYI3T1R0O-1.jpg`,
            title: "Money Trap (2019) a.k.a. Organize Isler: Sazan Sarmali",
        },
    ]);

    const [searchParams, setSearchParams] = useSearchParams();
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const handleChangeSorting = useSorting();

    let pageCount;

    if (searchParams.get("search")) {
        pageCount = Math.ceil(moviesCountSearch! / 10);
    } else {
        pageCount = Math.ceil(moviesCount! / 10);
    }

    const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
        searchParams.set("page", String(value));
        setSearchParams(searchParams);
    };

    async function getLatestMovies(): Promise<void> {
        const latestMovies: IMovie[] = await movieService.getLatestMovies();
        setLatestMovies(latestMovies);
    }

    async function getMovies(): Promise<void> {
        let moviesResponse: IMovie[] = [];

        if (searchParams.get("search")) {
            if (searchParams.get("page")) {
                const response: IMoviesResponse = await movieService.searchMoviesByTitle(
                    searchParams.get("search")!,
                    searchParams.get("page")!,
                );
                moviesResponse = response.movies;
                setMoviesCountSearch(response.count);
            } else {
                const response: IMoviesResponse = await movieService.searchMoviesByTitle(
                    searchParams.get("search")!,
                );
                moviesResponse = response.movies;
                setMoviesCountSearch(response.count);
            }
        } else {
            if (searchParams.get("sortBy") && searchParams.get("ascOrDesc")) {
                if (searchParams.get("page")) {
                    const queryParams = {
                        sortBy: searchParams.get("sortBy")!,
                        page: searchParams.get("page")!,
                        ascOrDesc: searchParams.get("ascOrDesc")!,
                    };
                    const responseMovies: IMoviesResponse =
                        await movieService.getMovies(queryParams);
                    moviesResponse = responseMovies.movies;
                    setMoviesCount(responseMovies.count);
                } else {
                    const queryParams = {
                        sortBy: searchParams.get("sortBy")!,
                        ascOrDesc: searchParams.get("ascOrDesc")!,
                    };
                    const responseMovies: IMoviesResponse =
                        await movieService.getMovies(queryParams);
                    moviesResponse = responseMovies.movies;
                    setMoviesCount(responseMovies.count);
                }
            } else if (searchParams.get("page")) {
                const queryParams = {
                    page: searchParams.get("page")!,
                };
                const response: IMoviesSearchResponse = await movieService.getMovies(queryParams);
                moviesResponse = response.movies;
                setMoviesCount(response.count);
            } else {
                const response: IMoviesSearchResponse = await movieService.getMovies({});
                moviesResponse = response.movies;
                setMoviesCount(response.count);
            }
        }

        setMovies(moviesResponse);
    }

    useEffect(() => {
        const fetchData = async () => {
            await Promise.all([getMovies(), getLatestMovies()]);
        };

        fetchData();
    }, [searchParams]);

    if (!movies) {
        return (
            <Box
                sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    height: "100vh",
                }}
            >
                <CircularProgress size={80} thickness={4} />
            </Box>
        );
    }

    if (movies && movies?.length === 0 && !searchParams?.get("search")) {
        return (
            <Box
                sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    height: "100vh",
                }}
            >
                <Typography fontSize={40} color={"secondary"}>
                    There are no movies
                </Typography>
            </Box>
        );
    }

    return (
        <>
            <SEOHelmet
                title="MovieLand24 - Your Ultimate Destination for Movies"
                description="Welcome to MovieLand24 - your ultimate destination for movies. Discover a vast collection of movies and enjoy streaming your favorites."
                name="MovieLand24"
                type="website"
                canonicalUrl="https://example.com/movies"
            />
            <Box
                sx={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    rowGap: 4,
                    backgroundColor: `${colors.blueAccent[700]}`,
                }}
                component={"main"}
            >
                {!searchParams.get("search") && (
                    <Box mt={4} component={"section"}>
                        <MoviesCarousel images={moviesCarouselImages} />
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
                                        searchParams.get("sortBy") && searchParams.get("ascOrDesc")
                                            ? searchParams.get("sortBy")! +
                                              toFirstWordUpperCase(searchParams.get("ascOrDesc")!)
                                            : "none"
                                    }
                                    onChange={handleChangeSorting}
                                >
                                    <MenuItem value={"none"}>None</MenuItem>
                                    <MenuItem value={"ratingImdbAsc"}>Imdb rating (Asc)</MenuItem>
                                    <MenuItem value={"ratingImdbDesc"}>Imdb rating (Desc)</MenuItem>
                                    <MenuItem value={"titleAsc"}>Title (Asc)</MenuItem>
                                    <MenuItem value={"titleDesc"}>Title (Desc)</MenuItem>
                                </Select>
                            </Box>
                        </Box>
                    </Stack>
                )}
                {movies.length !== 0 ? (
                    <Stack
                        direction="row"
                        flexWrap="wrap"
                        justifyContent={"center"}
                        alignContent={"center"}
                        rowGap={4}
                        columnGap={4}
                    >
                        {movies.map((movie: any) => (
                            <MovieItem movie={movie} type="homeMovie" key={movie.id} />
                        ))}
                    </Stack>
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
                    sx={{ display: "flex", placeItems: "center", marginTop: 2, marginBottom: 2 }}
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
                            rowGap={6}
                            columnGap={4}
                            justifyContent={"center"}
                            alignContent={"center"}
                            marginTop={3}
                            mb={4}
                        >
                            {latestMovies?.map((latestMovie: any) => (
                                <MovieItem
                                    type="homeLatest"
                                    movie={latestMovie}
                                    key={latestMovie.id}
                                />
                            ))}
                        </Stack>
                    </Box>
                )}
            </Box>
        </>
    );
}
