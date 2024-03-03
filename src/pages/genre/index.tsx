import React, { useEffect, useState } from "react";
import ReactPaginate from "react-paginate";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { Header } from "~/components/header/index";
import moviesController from "~/services/movies";
import type IGenreResponse from "~/interfaces/IGenreResponse";
import "./style.css";
import { Footer } from "~/components/footer/index";
import MovieItem from "~/components/MovieItem";
import type IMovie from "~/interfaces/IMovie";

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
            const response: IGenreResponse = await moviesController.getGenreMoviesNoPagination(
                params.name,
            );
            setMoviesOfGenre(response.movies);
            setMoviesCountGenres(response.count);
        } else {
            const response: IGenreResponse = await moviesController.getGenreMoviesWithPagination(
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
        return <div className="loading-wrapper">...</div>;
    }

    return (
        <div className="genre-wrapper-menus">
            <Header />
            <div className="genre-ribbon-1">
                <span className="movie-count-span">
                    Total movies in this genre: {moviesCountGenre}
                </span>
                <div className="image-ribbon-1-genre-wrapper">
                    {moviesOfGenre.map((movie: any) => (
                        <MovieItem movie={movie} type="genreMovie" key={movie.id} />
                    ))}
                </div>
                <ReactPaginate
                    previousLabel={"< Previous"}
                    nextLabel={"Next >"}
                    pageCount={pageCount}
                    onPageChange={changePage}
                    containerClassName={"paginationBttns"}
                    previousLinkClassName={"previousBttn"}
                    nextLinkClassName={"nextBttn"}
                    disabledClassName={"paginationDisabled"}
                    activeClassName={"paginationActive"}
                />
            </div>
            <Footer />
        </div>
    );
}
