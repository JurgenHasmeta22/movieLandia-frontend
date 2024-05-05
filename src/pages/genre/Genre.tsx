import React, { useEffect, useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import movieService from "~/services/movieService";
import type IGenreResponse from "~/interfaces/IGenreResponse";
import MovieItem from "~/components/movieItem/MovieItem";
import type IMovie from "~/interfaces/IMovie";
import { Box, Typography } from "@mui/material";

export default function Genre(): React.JSX.Element {
    const params = useParams();
    const [searchParams, setSearchParams] = useSearchParams();
    const [pageNumber, setPageNumber] = useState<number>(0);
    const [itemsPerPage, setItemsPerPage] = useState<number>(20);
    const [moviesCountGenre, setMoviesCountGenres] = useState<number>(0);
    const [moviesOfGenre, setMoviesOfGenre] = useState<IMovie[]>([]);
    const pageCount: number = Math.ceil(moviesCountGenre / itemsPerPage);

    function handleChangingPageNumber(selected: number): void {
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
        return <Box>...</Box>;
    }

    return (
        <Box>
            <Box>
                <Typography>Total movies in this genre: {moviesCountGenre}</Typography>
                <Box>
                    {moviesOfGenre.map((movie: any) => (
                        <MovieItem movie={movie} type="genreMovie" key={movie.id} />
                    ))}
                </Box>
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
        </Box>
    );
}
