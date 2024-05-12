import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import movieService from "~/services/api/movieService";
import type IMovie from "~/types/IMovie";
import type IMoviesSearchResponse from "~/types/IMovieSearchResponse";
import type IMoviesResponse from "~/types/IMoviesResponse";
import HomeCarousel from "~/pages/home/homeCarousel/HomeCarousel";
import MovieItem from "~/components/movieItem/MovieItem";
import {
    Box,
    CircularProgress,
    MenuItem,
    Pagination,
    Select,
    SelectChangeEvent,
    Stack,
    Typography,
    useTheme,
} from "@mui/material";
import { tokens } from "~/utils/theme";
import { toFirstWordUpperCase } from "~/utils/utils";

const api = {
    url: import.meta.env.VITE_API_URL,
};

export default function Home() {
    const [movies, setMovies] = useState<IMovie[] | undefined>(undefined);
    const [latestMovies, setLatestMovies] = useState<IMovie[]>([]);
    const [moviesCount, setMoviesCount] = useState<number | null>(null);
    const [moviesCountSearch, setMoviesCountSearch] = useState<number | null>(null);

    const [moviesCarouselImages, setMoviesCarouselImages] = useState<any[]>([
        { source: `${api.url}/images/movies/1gxZrx9gL9ov2c1NpXimEUzMTmh.jpg` },
        { source: `${api.url}/images/movies/1RjyfPLsZTq3lUdJY7pTzcmpPKl.jpg` },
        { source: `${api.url}/images/movies/1TkkTo8UiRl5lWM5qkAISHXg0fU.jpg` },
        { source: `${api.url}/images/movies/1ZiZ3eVUWPxJROTkYbH8FBC9UuB.jpg` },
        { source: `${api.url}/images/movies/4kiVg3QJQghjtRupyfWYI3T1R0O-1.jpg` },
    ]);

    const [searchParams, setSearchParams] = useSearchParams();
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);

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

    const handleChangeSorting = (event: SelectChangeEvent) => {
        const selectedValue = event.target.value as string;

        if (selectedValue === "none") {
            if (searchParams.get("sortBy") && searchParams.get("ascOrDesc")) {
                searchParams.delete("sortBy");
                searchParams.delete("ascOrDesc");
                setSearchParams(searchParams);
            }
        } else {
            const [, sortByValue, ascOrDesc] = selectedValue.match(/(\w+)(Asc|Desc)/) || [];

            if (sortByValue && ascOrDesc) {
                searchParams.set("sortBy", sortByValue);
                searchParams.set("ascOrDesc", ascOrDesc.toLowerCase());
                setSearchParams(searchParams);
            }
        }
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
                <Box mt={4} mb={2} component={"section"}>
                    <HomeCarousel images={moviesCarouselImages} />
                </Box>
            )}
            {!searchParams.get("search") && (
                <Box
                    sx={{
                        display: "flex",
                        flexDirection: "row",
                        justifyContent: "flex-end",
                        alignItems: "center",
                        gap: 2,
                        mr: 4,
                    }}
                    component={"section"}
                >
                    <Typography color={"secondary"} fontSize={18}>
                        Sort By:
                    </Typography>
                    <Box sx={{ display: "flex", flexDirection: "row", gap: 4 }}>
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
            )}
            {movies.length !== 0 ? (
                <Stack
                    direction="row"
                    flexWrap="wrap"
                    justifyContent={"center"}
                    alignContent={"center"}
                    rowGap={8}
                    columnGap={4}
                    mt={4}
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
                    <Typography component={"h2"} fontSize={24} textAlign={"center"}>
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
                    sx={{ display: "flex", flexDirection: "column", rowGap: 4, marginBottom: 6 }}
                >
                    <Box sx={{ display: "flex", placeContent: "center" }}>
                        <Typography fontSize={22} color={"secondary"}>
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
                    >
                        {latestMovies?.map((latestMovie: any) => (
                            <MovieItem type="homeLatest" movie={latestMovie} key={latestMovie.id} />
                        ))}
                    </Stack>
                </Box>
            )}
        </Box>
    );
}
