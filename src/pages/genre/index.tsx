import { useEffect, useState } from "react";
import ReactLoading from "react-loading";
import ReactPaginate from "react-paginate";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import Header from "~/components/header/index";
import moviesController from "~/services/movies";
import { useStore } from "~/store/zustand/store";
import IGenreResponse from "~/interfaces/IGenreResponse";
import "./style.css";
import Footer from "~/components/footer";

export default function Genre() {
  const params = useParams();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [pageNumber, setPageNumber] = useState<number>(0);
  const [itemsPerPage, setItemsPerPage] = useState<number>(20);
  const [moviesCountGenre, setMoviesCountGenres] = useState<number>(0);
  const { movies, setMovies } = useStore();

  const pageCount: number = Math.ceil(moviesCountGenre / itemsPerPage);
  function handleChangingPageNumber(selected: any): void {
    setPageNumber(selected);
  }

  const changePage = ({ selected }: any): void => {
    handleChangingPageNumber(selected);
    searchParams.set("page", selected + 1);
    setSearchParams(searchParams);
  };

  async function getMoviesOnGenre(): Promise<void> {
    if (!searchParams.get("page") && params.name) {
      const response: IGenreResponse =
        await moviesController.getGenreMoviesNoPagination(params.name);
      setMovies(response.movies);
      setMoviesCountGenres(response.count);
    } else {
      const response: IGenreResponse =
        await moviesController.getGenreMoviesWithPagination(
          params.name,
          searchParams.get("page")
        );
      setMovies(response.movies);
      setMoviesCountGenres(response.count);
    }
  }

  useEffect(() => {
    getMoviesOnGenre();
  }, [params.name, searchParams.get("page")]);

  if (!movies) {
    return (
      <div className="loading-wrapper">
        <ReactLoading
          type={"spin"}
          color={"#000"}
          height={200}
          width={100}
          className="loading"
        />
      </div>
    );
  }

  return (
    <div className="genre-wrapper-menus">
      <Header />
      <div className="genre-ribbon-1">
        <label className="movie-count-span">
          Total movies in this genre: {moviesCountGenre}
        </label>
        <div className="image-ribbon-1-genre-wrapper">
          {movies.map((movie: any) => (
            <div
              className="movie-item-genre"
              key={movie.id}
              onClick={function (e) {
                e.stopPropagation();
                navigate(
                  `/movies/${movie.title
                    .split("")
                    .map((char: any) => (char === " " ? "-" : char))
                    .join("")}`
                );
                window.scrollTo(0, 0);
              }}
            >
              <img src={movie.photoSrc} className={"genre-cateogory-image"} />
              <label className="movie-title">{movie.title}</label>
              <div className="genres-holder-span">
                {movie.genres.map((genre: any) => (
                  <label
                    key={genre.genre.name}
                    onClick={function (e) {
                      e.stopPropagation();
                      navigate(`/genres/${genre.genre.name}`);
                      window.scrollTo(0, 0);
                    }}
                  >
                    {genre.genre.name}
                  </label>
                ))}
              </div>
              <label className="imdb-span">
                {movie.ratingImdb !== 0
                  ? `Imdb: ${movie.ratingImdb}`
                  : "Imdb: N/A"}
              </label>
            </div>
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
