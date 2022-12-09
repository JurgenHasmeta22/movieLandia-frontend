import { useEffect, useState } from "react";
import ReactLoading from "react-loading";
import ReactPaginate from "react-paginate";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import Card from "~/main/components/card/index";
import Container from "~/main/components/container/index";
import Header from "~/main/components/header/index";
import Label from "~/main/components/label/index";
import Picture from "~/main/components/picture/index";
import moviesController from "~/main/controllers/moviesController";
import { useStore } from "~/main/store/zustand/store";
import IGenreResponse from "~/main/interfaces/IGenreResponse";
import "~/modules/base/pages/genre/style.css";
import Footer from "~/main/components/footer";

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
      const response: IGenreResponse = await moviesController.getGenreMoviesNoPagination(params.name);
      setMovies(response.movies);
      setMoviesCountGenres(response.count);
    } else {
      const response: IGenreResponse = await moviesController.getGenreMoviesWithPagination(params.name, searchParams.get("page"));
      setMovies(response.movies);
      setMoviesCountGenres(response.count);
    }
  }
  
  useEffect(() => {
    getMoviesOnGenre()
  }, [params.name, searchParams.get("page")]);

  if (!movies) {
    return (
      <Container classname="loading-wrapper">
        <ReactLoading
          type={"spin"}
          color={"#000"}
          height={200}
          width={100}
          className="loading"
        />
      </Container>
    );
  }

  return (
    <Container classname="genre-wrapper-menus">
      <Header />
      <Container classname="genre-ribbon-1">
        <Label classname="movie-count-span">
          Total movies in this genre: {moviesCountGenre}
        </Label>
        <Container classname="image-ribbon-1-genre-wrapper">
          {movies.map((movie: any) => (
            <Card
              classname="movie-item-genre"
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
              <Picture src={movie.photoSrc} classname={'genre-cateogory-image'} />
              <Label classname="movie-title">{movie.title}</Label>
              <Container classname="genres-holder-span">
                {movie.genres.map((genre: any) => (
                  <Label
                    key={genre.genre.name}
                    onClick={function (e) {
                      e.stopPropagation();
                      navigate(`/genres/${genre.genre.name}`);
                      window.scrollTo(0, 0);
                    }}
                  >
                    {genre.genre.name}
                  </Label>
                ))}
              </Container>
              <Label classname="imdb-span">
                {movie.ratingImdb !== 0 ? `Imdb: ${movie.ratingImdb}` : "Imdb: N/A"}
              </Label>
            </Card>
          ))}
        </Container>
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
      </Container>
      <Footer />
    </Container>
  );
}
