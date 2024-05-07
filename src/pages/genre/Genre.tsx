import React, { useEffect, useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import movieService from "~/services/api/movieService";
import type IGenreResponse from "~/types/IGenreResponse";
import MovieItem from "~/components/movieItem/MovieItem";
import type IMovie from "~/types/IMovie";
import { Box, CircularProgress, Pagination, Stack, Typography, useTheme } from "@mui/material";
import { tokens } from "~/utils/theme";

export default function Genre(): React.JSX.Element {
    const [itemsPerPage, setItemsPerPage] = useState<number>(20);
    const [moviesCountGenre, setMoviesCountGenres] = useState<number>(0);
    const [moviesOfGenre, setMoviesOfGenre] = useState<IMovie[]>([]);

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
            const response: IGenreResponse = await movieService.getGenreMoviesNoPagination(
                params.name,
            );

            setMoviesOfGenre(response.movies);
            setMoviesCountGenres(response.count);
        } else {
            const response: IGenreResponse = await movieService.getGenreMoviesWithPagination(
                params.name,
                searchParams.get("page"),
            );

            setMoviesOfGenre(response.movies);
            setMoviesCountGenres(response.count);
        }
    }

    useEffect(() => {
        getMoviesOnGenre();
    }, [params.name, searchParams.get("page")]);

    if (moviesOfGenre?.length === 0) {
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

    return (
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
    );
}
