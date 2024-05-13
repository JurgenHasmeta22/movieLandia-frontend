import React, { useEffect, useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import type IGenreResponse from "~/types/IGenreResponse";
import MovieItem from "~/components/movieItem/MovieItem";
import type IMovie from "~/types/IMovie";
import { Box, CircularProgress, Pagination, Stack, Typography, useTheme } from "@mui/material";
import { tokens } from "~/utils/theme";
import genreService from "~/services/api/genreService";
import SEOHelmet from "~/components/seoHelmet/SEOHelmet";

export default function Genre(): React.JSX.Element {
    const [itemsPerPage, setItemsPerPage] = useState<number>(20);
    const [moviesCountGenre, setMoviesCountGenres] = useState<number>(0);
    const [moviesOfGenre, setMoviesOfGenre] = useState<IMovie[] | undefined>(undefined);
    const params = useParams();
    const [searchParams, setSearchParams] = useSearchParams();
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const pageCount: number = Math.ceil(moviesCountGenre / itemsPerPage);

    const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
        searchParams.set("page", String(value));
        setSearchParams(searchParams);
    };

    async function getMoviesOnGenre(): Promise<void> {
        if (!searchParams.get("page") && params.name) {
            const response: IGenreResponse = await genreService.getGenreByName(params.name, {});

            setMoviesOfGenre(response.rows);
            setMoviesCountGenres(response.count);
        } else if (searchParams.get("page") && params.name) {
            const queryParams = {
                page: searchParams.get("page")!,
            };

            const response: IGenreResponse = await genreService.getGenreByName(
                params.name,
                queryParams,
            );

            setMoviesOfGenre(response.rows);
            setMoviesCountGenres(response.count);
        }
    }

    useEffect(() => {
        getMoviesOnGenre();
    }, [params.name, searchParams.get("page")]);

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
