import React, { useEffect, useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import movieService from "~/services/movieService";
import type IGenreResponse from "~/interfaces/IGenreResponse";
import MovieItem from "~/components/movieItem/MovieItem";
import type IMovie from "~/interfaces/IMovie";
import { Box, CircularProgress, Pagination, Stack, Typography, useTheme } from "@mui/material";
import { tokens } from "~/utils/theme";

export default function Genre(): React.JSX.Element {
    const [pageNumber, setPageNumber] = useState<number>(0);
    const [itemsPerPage, setItemsPerPage] = useState<number>(20);
    const [moviesCountGenre, setMoviesCountGenres] = useState<number>(0);
    const [moviesOfGenre, setMoviesOfGenre] = useState<IMovie[]>([]);

    const params = useParams();
    const [searchParams, setSearchParams] = useSearchParams();

    const theme = useTheme();
    const colors = tokens(theme.palette.mode);

    const pageCount: number = Math.ceil(moviesCountGenre / itemsPerPage);

    function handleChangingPageNumber(selected: any): void {
        setPageNumber(selected);
    }

    const changePage = ({ selected }: { selected: number }): void => {
        handleChangingPageNumber(selected);
        searchParams.set("page", (selected + 1).toString());
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

    if (!moviesOfGenre) {
        return <Box><CircularProgress size={80} thickness={4} /></Box>;
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
            <Box>
                <Typography>Total movies in this genre: {moviesCountGenre}</Typography>
                <Stack
                    direction="row"
                    flexWrap="wrap"
                    justifyContent={"center"}
                    alignContent={"center"}
                    rowGap={4}
                    columnGap={4}
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
        </Box>
    );
}
