import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import movieService from "~/services/movieService";
import type IMovie from "~/interfaces/IMovie";
import type IMoviesCount from "~/interfaces/IMoviesCount";
import type IMoviesSearchResponse from "~/interfaces/IMovieSearchResponse";
import type IMoviesResponse from "~/interfaces/IMoviesResponse";
import HomeCarousel from "~/pages/home/homeCarousel/HomeCarousel";
import MovieItem from "~/components/movieItem/MovieItem";
import { Box, List, ListItem, Typography } from "@mui/material";

export default function Home() {
    const [moviesCount, setMoviesCount] = useState<IMoviesCount | null>(null);
    const [moviesCountSearch, setMoviesCountSearch] = useState<number | null>(null);
    const [pageNumber, setPageNumber] = useState<number>(0);
    const [itemsPerPage, setItemsPerPage] = useState<number>(20);
    const [sortBy, setSortBy] = useState<string>("");
    const [movies, setMovies] = useState<IMovie[]>([]);
    const [latestMovies, setLatestMovies] = useState<IMovie[]>([]);
    const [searchTerm, setSearchTerm] = useState<string>("");

    const [searchParams, setSearchParams] = useSearchParams();

    let pageCount;

    if (searchParams.get("search")) {
        pageCount = Math.ceil(moviesCountSearch! / itemsPerPage);
    } else {
        pageCount = Math.ceil(moviesCount?.count! / itemsPerPage);
    }

    function handleChangingPageNumber(selected: any) {
        setPageNumber(selected);
    }

    const changePage = ({ selected }: any) => {
        if (!searchParams.get("sort") && !searchParams.get("search")) {
            handleChangingPageNumber(selected);
            searchParams.set("page", selected + 1);
            setSearchParams(searchParams);
        } else if (searchParams.get("sort") && !searchParams.get("search")) {
            handleChangingPageNumber(selected);
            searchParams.set("sortBy", sortBy);
            searchParams.set("page", selected + 1);
            setSearchParams(searchParams);
        } else {
            handleChangingPageNumber(selected);
            searchParams.set("page", selected + 1);
            setSearchParams(searchParams);
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
        if (
            !searchParams.get("page") &&
            !searchParams.get("search") &&
            !searchParams.get("sortBy")
        ) {
            const movies: IMovie[] = await movieService.getMoviesDefault();
            setMovies(movies);
        } else if (
            searchParams.get("page") &&
            !searchParams.get("search") &&
            !searchParams.get("sortBy")
        ) {
            const movies: IMovie[] = await movieService.getMoviesPagination(
                searchParams.get("page"),
            );
            setMovies(movies);
        } else if (
            !searchParams.get("page") &&
            searchParams.get("search") &&
            !searchParams.get("sortBy")
        ) {
            const responseSearch: IMoviesSearchResponse =
                await movieService.getMoviesSearchNoPagination(searchParams.get("search"));
            setMovies(responseSearch.movies);
            setMoviesCountSearch(responseSearch.count);
        } else if (
            searchParams.get("page") &&
            searchParams.get("search") &&
            !searchParams.get("sortBy")
        ) {
            const responseSearch: IMoviesSearchResponse =
                await movieService.getMoviesSearchWithPagination(
                    searchParams.get("search"),
                    searchParams.get("page"),
                );
            setMovies(responseSearch.movies);
            setMoviesCountSearch(responseSearch.count);
        } else if (
            !searchParams.get("page") &&
            !searchParams.get("search") &&
            searchParams.get("sortBy")
        ) {
            const responseMovies: IMoviesResponse = await movieService.getMoviesSortingNoPagination(
                searchParams.get("sortBy"),
            );
            setMovies(responseMovies.rows);
        } else if (
            searchParams.get("page") &&
            !searchParams.get("search") &&
            searchParams.get("sortBy")
        ) {
            const responseMovies: IMoviesResponse =
                await movieService.getMoviesSortingWithPagination(
                    searchParams.get("sortBy"),
                    searchParams.get("page"),
                );
            setMovies(responseMovies.rows);
        }
    }

    if (!searchParams.get("page") && !searchParams.get("search") && !searchParams.get("sortBy")) {
        useEffect(() => {
            getMovies();
        }, [searchParams.get("page")]);
    } else if (
        searchParams.get("page") &&
        !searchParams.get("search") &&
        !searchParams.get("sortBy")
    ) {
        useEffect(() => {
            getMovies();
        }, [searchParams.get("page")]);
    } else if (
        !searchParams.get("page") &&
        searchParams.get("search") &&
        !searchParams.get("sortBy")
    ) {
        useEffect(() => {
            getMovies();
        }, [searchParams.get("search")]);
    } else if (
        searchParams.get("page") &&
        searchParams.get("search") &&
        !searchParams.get("sortBy")
    ) {
        useEffect(() => {
            getMovies();
        }, [searchParams.get("page")]);
    } else if (
        !searchParams.get("page") &&
        !searchParams.get("search") &&
        searchParams.get("sortBy")
    ) {
        useEffect(() => {
            getMovies();
        }, [searchParams.get("sortBy")]);
    } else if (
        searchParams.get("page") &&
        !searchParams.get("search") &&
        searchParams.get("sortBy")
    ) {
        useEffect(() => {
            getMovies();
        }, [searchParams.get("page")]);
    }

    useEffect(() => {
        getMoviesCount(), getLatestMovies();
    }, []);

    useEffect(() => {
        if (searchTerm && searchTerm.length > 0) {
            searchParams.set("search", searchTerm);
            setSearchParams(searchParams);
        } else if (searchTerm.length === 0) {
            searchParams.delete("search");
            if (searchParams.get("page")) searchParams.delete("page");
            if (searchParams.get("sortBy")) searchParams.delete("sortBy");
            setSearchParams(searchParams);
        }
    }, [searchTerm]);

    if (!movies) {
        return <Box>...</Box>;
    }

    return (
        <Box>
            {!searchParams.get("search") && <HomeCarousel />}
            <Box>
                {searchParams.get("search") ? (
                    <Typography>Total movies: {moviesCountSearch}</Typography>
                ) : (
                    <Typography>Total movies: {moviesCount?.count}</Typography>
                )}
                {!searchParams.get("search") && (
                    <>
                        <h3>Sort By: </h3>
                        <List>
                            <Typography
                                onClick={() => {
                                    setSearchParams({ sortBy: "views" });
                                }}
                            >
                                Most viewed (Desc)
                            </Typography>
                            <Typography
                                onClick={() => {
                                    setSearchParams({ sortBy: "imdbRating" });
                                }}
                            >
                                Imdb rating (Desc)
                            </Typography>
                            <Typography
                                onClick={() => {
                                    setSearchParams({ sortBy: "title" });
                                }}
                            >
                                Title (Desc)
                            </Typography>
                        </List>
                    </>
                )}
                {movies.length !== 0 ? (
                    <Box>
                        {movies.map((movie: any) => (
                            <MovieItem movie={movie} type="homeMovie" key={movie.id} />
                        ))}
                    </Box>
                ) : (
                    <Box>
                        <Typography>
                            No Search Result, no movie found with that criteria.
                        </Typography>
                    </Box>
                )}
                {/* <ReactPaginate
                    previousLabel={"< Previous"}
                    nextLabel={"Next >"}
                    pageCount={pageCount}
                    onPageChange={changePage}
                    containerClassName={"paginationBttns"}
                    previousLinkClassName={"previousBttn"}
                    nextLinkClassName={"nextBttn"}
                    disabledClassName={"paginationDisabled"}
                    activeClassName={"paginationActive"}
                /> */}
            </Box>
            {!searchParams.get("search") && (
                <Box>
                    <List>
                        <ListItem>LATEST MOVIES</ListItem>
                    </List>
                    <Box>
                        {latestMovies?.map((latestMovie: any) => (
                            <MovieItem type="homeLatest" movie={latestMovie} key={latestMovie} />
                        ))}
                    </Box>
                </Box>
            )}
        </Box>
    );
}
