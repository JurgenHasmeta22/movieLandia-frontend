import { useEffect, useState } from "react";
import ReactLoading from "react-loading";
import ReactPaginate from "react-paginate";
import { useNavigate, useParams } from "react-router";
import Card from "../../../../main/components/card";
import Footer from "../../../../main/components/footer";
import Header from "../../../../main/components/header";
import Label from "../../../../main/components/label";
import moviesController from "../../../../main/controllers/moviesController";
import { useStore } from "../../../../main/store/zustand/store";
import IGenreResponse from "../../../../main/store/zustand/types/IGenreResponse";
import "./style.css";

export default function Genre() {
  const params = useParams();
  const navigate = useNavigate();
  const [pageNumber, setPageNumber] = useState<number>(0);
  const [itemsPerPage, setItemsPerPage] = useState<number>(20);
  const [moviesCountGenre, setMoviesCountGenres] = useState<number>(0);
  const { 
    movies, 
    setMovies 
  } = useStore();

  const pageCount = Math.ceil(moviesCountGenre / itemsPerPage);
  function handleChangingPageNumber(selected: any) {
    setPageNumber(selected);
  }
  const changePage = ({ selected }: any) => {
    handleChangingPageNumber(selected);
    navigate(`/genres/${params.name}/page/${selected + 1}`);
  };

  async function getMoviesOnGenre(): Promise<void> {
    if (!params.page && params.name) {
      const response: IGenreResponse = await moviesController.getGenreMoviesNoPagination(params.name);
      setMovies(response.movies);
      setMoviesCountGenres(response.count);
    } else {
      const response: IGenreResponse = await moviesController.getGenreMoviesWithPagination(params.name, params.page);
      setMovies(response.movies);
      setMoviesCountGenres(response.count);
    }
  }
  
  useEffect(() => {
    getMoviesOnGenre()
  }, [params.name, params.page]);

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
    <>
      <div className="genre-wrapper-menus">
        <Header />
        <div className="genre-ribbon-1">
          <span className="movie-count-span">
            Total movies in this genre: {moviesCountGenre}{" "}
          </span>
          <div className="image-ribbon-1-genre-wrapper">
            {movies?.map((movie: any) => (
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
                <img src={movie?.photoSrc} />
                <span className="movie-title">{movie?.title}</span>
                <div className="genres-holder-span">
                  {movie?.genres.map((genre: any) => (
                    <span
                      key={genre.genre.name}
                      onClick={function (e) {
                        e.stopPropagation();
                        navigate(`/genres/${genre.genre.name}`);
                        window.scrollTo(0, 0);
                      }}
                    >
                      {genre.genre.name}
                    </span>
                  ))}
                </div>
                <span className="imdb-span">
                  {movie?.ratingImdb !== 0
                    ? "Imdb: " + movie?.ratingImdb
                    : "Imdb: " + "N/A"}
                </span>
              </Card>
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
    </>
  );
}
