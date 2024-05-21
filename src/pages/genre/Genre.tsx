import React, { useEffect, useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import MovieItem from "~/components/movieItem/MovieItem";
import type IMovie from "~/types/IMovie";
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
import genreService from "~/services/api/genreService";
import SEOHelmet from "~/components/seoHelmet/SEOHelmet";
import { useSorting } from "~/hooks/useSorting";
import { toFirstWordUpperCase } from "~/utils/utils";
import IMoviesResponse from "~/types/IMoviesResponse";

export default function Genre(): React.JSX.Element {
    const [itemsPerPage, setItemsPerPage] = useState<number>(20);
    const [moviesCountGenre, setMoviesCountGenres] = useState<number>(0);
    const [moviesOfGenre, setMoviesOfGenre] = useState<IMovie[] | undefined>(undefined);

    const params = useParams();
    const [searchParams, setSearchParams] = useSearchParams();
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const pageCount: number = Math.ceil(moviesCountGenre / itemsPerPage);
    const handleChangeSorting = useSorting();

    const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
        searchParams.set("page", String(value));
        setSearchParams(searchParams);
    };

    async function getMoviesOnGenre(): Promise<void> {
        if (!searchParams.get("page") && params.name && !searchParams.get("sortBy")) {
            const response: IMoviesResponse = await genreService.getGenreByName(params.name, {});

            setMoviesOfGenre(response.movies);
            setMoviesCountGenres(response.count);
        } else if (searchParams.get("page") && params.name && !searchParams.get("sortBy")) {
            const queryParams = {
                page: searchParams.get("page")!,
            };
            const response: IMoviesResponse = await genreService.getGenreByName(
                params?.name,
                queryParams,
            );

            setMoviesOfGenre(response.movies);
            setMoviesCountGenres(response.count);
        } else {
            if (searchParams.get("sortBy") && searchParams.get("ascOrDesc") && params.name) {
                if (searchParams.get("page")) {
                    const queryParams = {
                        sortBy: searchParams.get("sortBy")!,
                        page: searchParams.get("page")!,
                        ascOrDesc: searchParams.get("ascOrDesc")!,
                    };
                    const response: IMoviesResponse = await genreService.getGenreByName(
                        params!.name!,
                        queryParams,
                    );

                    setMoviesOfGenre(response.movies);
                    setMoviesCountGenres(response.count);
                } else {
                    const queryParams = {
                        sortBy: searchParams.get("sortBy")!,
                        ascOrDesc: searchParams.get("ascOrDesc")!,
                    };
                    const response: IMoviesResponse = await genreService.getGenreByName(
                        params!.name!,
                        queryParams,
                    );

                    setMoviesOfGenre(response.movies);
                    setMoviesCountGenres(response.count);
                }
            } else if (searchParams.get("page")) {
                const queryParams = {
                    page: searchParams.get("page")!,
                };
                const response: IMoviesResponse = await genreService.getGenreByName(
                    params!.name!,
                    queryParams,
                );

                setMoviesOfGenre(response.movies);
                setMoviesCountGenres(response.count);
            } else {
                const response: IMoviesResponse = await genreService.getGenreByName(
                    params!.name!,
                    {},
                );

                setMoviesOfGenre(response.movies);
                setMoviesCountGenres(response.count);
            }
        }
    }

    useEffect(() => {
        getMoviesOnGenre();
    }, [params.name, searchParams]);

    if (!moviesOfGenre) {
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

    if (moviesOfGenre && moviesOfGenre?.length === 0) {
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
                    There are no movies with this genre
                </Typography>
            </Box>
        );
    }

    return (
        <>
            <SEOHelmet
                title={`Watch movies of genre ${params?.name} on MovieLand24`}
                description={`Watch all movies related to this genres in high quality and including the latest movies and series to this genre  ${params?.name}`}
                name="MovieLand24"
                type="article"
                canonicalUrl={`https://example.com/genre/${params?.name}`}
            />
            <Box
                sx={{
                    display: "flex",
                    flexDirection: "column",
                    rowGap: 4,
                    backgroundColor: `${colors.blueAccent[700]}`,
                }}
                component={"main"}
            >
                <Box
                    sx={{
                        display: "flex",
                        flexDirection: "row",
                        justifyContent: "flex-end",
                        alignItems: "center",
                        columnGap: 2,
                        mr: 4,
                        mt: 4,
                    }}
                    component={"section"}
                >
                    <Typography color={"secondary"} fontSize={16}>
                        <span>Sort by:</span>
                    </Typography>
                    <Box sx={{ display: "flex", flexDirection: "row", columnGap: 2 }}>
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
                <Box sx={{ display: "flex", placeContent: "center" }}>
                    <Typography fontSize={22} color={"secondary"} variant="h2">
                        {`All Movies of the ${params.name}`}
                    </Typography>
                </Box>
                <Stack
                    direction="row"
                    flexWrap="wrap"
                    justifyContent={"center"}
                    alignContent={"center"}
                    rowGap={4}
                    columnGap={4}
                    marginTop={4}
                >
                    {moviesOfGenre.map((movie: any) => (
                        <MovieItem movie={movie} type="genreMovie" key={movie.id} />
                    ))}
                </Stack>
                <Stack
                    spacing={2}
                    sx={{ display: "flex", placeItems: "center", marginTop: 4, marginBottom: 4 }}
                >
                    <Pagination
                        page={searchParams.get("page") ? Number(searchParams.get("page")) : 1}
                        size="large"
                        count={pageCount}
                        showFirstButton
                        showLastButton
                        onChange={handlePageChange}
                    />
                </Stack>
            </Box>
        </>
    );
}
