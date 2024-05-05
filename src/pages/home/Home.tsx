import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import movieService from "~/services/movieService";
import type IMovie from "~/interfaces/IMovie";
import type IMoviesCount from "~/interfaces/IMoviesCount";
import type IMoviesSearchResponse from "~/interfaces/IMovieSearchResponse";
import type IMoviesResponse from "~/interfaces/IMoviesResponse";
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
import { toCamelCase, toFirstWordUpperCase } from "~/utils/utils";

const api = {
    url: import.meta.env.VITE_API_URL,
};

export default function Home() {
    const [moviesCount, setMoviesCount] = useState<IMoviesCount | null>(null);
    const [moviesCountSearch, setMoviesCountSearch] = useState<number | null>(null);
    const [pageNumber, setPageNumber] = useState<number>(0);
    const [itemsPerPage, setItemsPerPage] = useState<number>(20);
    const [movies, setMovies] = useState<IMovie[]>([]);
    const [latestMovies, setLatestMovies] = useState<IMovie[]>([]);

    const [searchParams, setSearchParams] = useSearchParams();
    const navigate = useNavigate();

    let pageCount;

    const theme = useTheme();
    const colors = tokens(theme.palette.mode);

    const images = [
        { source: `${api.url}/images/rsz_fistful_of_vengeance.png` },
        { source: `${api.url}/images/rsz_texas.png` },
        { source: `${api.url}/images/rsz_movieposter_en.png` },
        { source: `${api.url}/images/rsz_wyihsxwyqn8ejsdut2p1p0o97n0.png` },
        { source: `${api.url}/images/rsz_elevjj3yg279mmpwuygyrhbjbbq.png` },
    ];

    if (searchParams.get("search")) {
        pageCount = Math.ceil(moviesCountSearch! / itemsPerPage);
    } else {
        pageCount = Math.ceil(moviesCount?.count! / itemsPerPage);
    }

    function handleChangingPageNumber(selected: any) {
        setPageNumber(selected);
    }

    const changePage = ({ selected }: any) => {
        handleChangingPageNumber(selected);
        searchParams.set("page", selected + 1);
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
                searchParams.set("sortBy", sortByValue.toLowerCase());
                searchParams.set("sortDirection", ascOrDesc.toLowerCase());
                setSearchParams(searchParams);
                navigate(`/movies?sortBy=${sortByValue}&ascOrDesc=${ascOrDesc.toLowerCase()}`);
            }
        }
    };

    async function getMoviesCount(): Promise<void> {
        const moviesCount: IMoviesCount = await movieService.getMovieCount();
        setMoviesCount(moviesCount);
    }

    async function getLatestMovies(): Promise<void> {
        const latestMovies: IMovie[] = await movieService.getLatestMovies();
        setLatestMovies(latestMovies);
    }

    async function getMovies(): Promise<void> {
        let moviesResponse: IMovie[] = [];

        if (searchParams.get("search")) {
            if (searchParams.get("page")) {
                const responseSearch: IMoviesSearchResponse =
                    await movieService.getMoviesSearchWithPagination(
                        searchParams.get("search"),
                        searchParams.get("page"),
                    );

                moviesResponse = responseSearch.movies;
                setMoviesCountSearch(responseSearch.count);
            } else {
                const responseSearch: IMoviesSearchResponse =
                    await movieService.getMoviesSearchNoPagination(searchParams.get("search"));

                moviesResponse = responseSearch.movies;
                setMoviesCountSearch(responseSearch.count);
            }
        } else {
            if (searchParams.get("sortBy") && searchParams.get("ascOrDesc")) {
                if (searchParams.get("page")) {
                    const responseMovies: IMoviesResponse =
                        await movieService.getMoviesSortingWithPagination(
                            searchParams.get("sortBy"),
                            searchParams.get("page"),
                            searchParams.get("ascOrDesc"),
                        );

                    moviesResponse = responseMovies.rows;
                } else {
                    const responseMovies: IMoviesResponse =
                        await movieService.getMoviesSortingNoPagination(
                            searchParams.get("sortBy"),
                            searchParams.get("ascOrDesc"),
                        );

                    moviesResponse = responseMovies.rows;
                }
            } else if (searchParams.get("page")) {
                const movies: IMovie[] = await movieService.getMoviesPagination(
                    searchParams.get("page"),
                );

                moviesResponse = movies;
            } else {
                const movies: IMovie[] = await movieService.getMoviesDefault();
                moviesResponse = movies;
            }
        }

        setMovies(moviesResponse);
    }

    useEffect(() => {
        const fetchData = async () => {
            await Promise.all([getMovies(), getMoviesCount(), getLatestMovies()]);
        };

        fetchData();
    }, [searchParams]);

    if (!movies) {
        return (
            <Box>
                <CircularProgress size={80} thickness={4} />
            </Box>
        );
    }

    return (
        <Box
            sx={{
                display: "flex",
                flexDirection: "column",
                rowGap: 4,
                backgroundColor: `${colors.blueAccent[700]}`,
            }}
        >
            {!searchParams.get("search") && (
                <Box mt={4} mb={2}>
                    <HomeCarousel images={images} />{" "}
                </Box>
            )}
            <Box>
                <Box
                    sx={{
                        display: "flex",
                        flexDirection: "row",
                        columnGap: 4,
                        placeContent: "center",
                        placeItems: "center",
                        marginBottom: 4,
                    }}
                >
                    {searchParams.get("search") ? (
                        <Box mt={4}>
                            <Typography fontSize={18}>Total movies: {moviesCountSearch}</Typography>
                        </Box>
                    ) : (
                        <Box>
                            <Typography fontSize={18}>
                                Total movies: {moviesCount?.count}
                            </Typography>
                        </Box>
                    )}
                    {!searchParams.get("search") && (
                        <Box
                            sx={{
                                display: "flex",
                                flexDirection: "row",
                                placeItems: "center",
                                placeContent: "center",
                                gap: 2,
                            }}
                        >
                            <Typography>Sort By: </Typography>
                            <Box sx={{ display: "flex", flexDirection: "row", gap: 3 }}>
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
                                    <MenuItem value={"viewsAsc"}>Most viewed (Asc)</MenuItem>
                                    <MenuItem value={"viewsDesc"}>Most viewed (Desc)</MenuItem>
                                    <MenuItem value={"ratingImdbAsc"}>Imdb rating (Asc)</MenuItem>
                                    <MenuItem value={"ratingImdbDesc"}>Imdb rating (Desc)</MenuItem>
                                    <MenuItem value={"titleAsc"}>Title (Asc)</MenuItem>
                                    <MenuItem value={"titleDesc"}>Title (Desc)</MenuItem>
                                </Select>
                            </Box>
                        </Box>
                    )}
                </Box>
                {movies.length !== 0 ? (
                    <Stack
                        direction="row"
                        flexWrap="wrap"
                        justifyContent={"center"}
                        alignContent={"center"}
                        rowGap={8}
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
                    >
                        <Typography>
                            No Search Result, no movie found with that criteria.
                        </Typography>
                    </Box>
                )}
                <Stack
                    spacing={2}
                    sx={{ display: "flex", placeItems: "center", marginTop: 4, marginBottom: 4 }}
                >
                    <Pagination
                        page={pageNumber}
                        size="large"
                        count={pageCount}
                        showFirstButton
                        showLastButton
                        onChange={(page) => {
                            handleChangingPageNumber(page);
                        }}
                    />
                </Stack>
            </Box>
            {!searchParams.get("search") && (
                <Box sx={{ display: "flex", flexDirection: "column", rowGap: 4, marginBottom: 4 }}>
                    <Box sx={{ display: "flex", placeContent: "center" }}>
                        <Typography fontSize={"22px"}>Latest Movies</Typography>
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
                            <MovieItem type="homeLatest" movie={latestMovie} key={latestMovie} />
                        ))}
                    </Stack>
                    <Stack
                        spacing={2}
                        sx={{
                            display: "flex",
                            placeItems: "center",
                            marginTop: 4,
                            marginBottom: 4,
                        }}
                    >
                        <Pagination
                            page={pageNumber}
                            size="large"
                            count={pageCount}
                            showFirstButton
                            showLastButton
                            onChange={(page) => {
                                handleChangingPageNumber(page);
                            }}
                        />
                    </Stack>
                </Box>
            )}
        </Box>
    );
}
