import { useEffect, useState } from "react";
import ReactLoading from "react-loading";
import ReactPaginate from "react-paginate";
import { useNavigate, useParams } from "react-router";
import { Link } from "react-router-dom";
import Card from "../../../../main/components/card";
import Footer from "../../../../main/components/footer";
import Header from "../../../../main/components/header";
import Label from "../../../../main/components/label";
import moviesController from "../../../../main/controllers/moviesController";
import { useStore } from "../../../../main/store/zustand/store";
import IMovie from "../../../../main/store/zustand/types/IMovie";
import IMoviesCount from "../../../../main/store/zustand/types/IMoviesCount";
import IMoviesSearchResponse from "../../../../main/store/zustand/types/IMovieSearchResponse";
import IMoviesResponse from "../../../../main/store/zustand/types/IMoviesResponse";
import HomeCarousel from "./homeCarousel";
import "./style.css";

export default function Home() {
  const navigate = useNavigate();
  const params = useParams();
  const [moviesCount, setMoviesCount] = useState<IMoviesCount>();
  const [moviesCountSearch, setMoviesCountSearch] = useState<number>();
  const [pageNumber, setPageNumber] = useState<number>(0);
  const [itemsPerPage, setItemsPerPage] = useState<number>(20);
  const {
    movies, 
    setMovies, 
    latestMovies,
    setLatestMovies
  } = useStore();

  let pageCount;
  if (params.query) {
    pageCount = Math.ceil(moviesCountSearch! / itemsPerPage);
  } else {
    pageCount = Math.ceil(moviesCount?.count! / itemsPerPage);
  }

  function handleChangingPageNumber(selected: any) {
    setPageNumber(selected);
  }

  const changePage = ({ selected }: any) => {
    if (!params.sort && !params.query) {
      handleChangingPageNumber(selected);
      navigate(`/movies/page/${selected + 1}`);
    } else if (params.sort && !params.query) {
      handleChangingPageNumber(selected);
      navigate(`/movies/sortBy/${params.sort}/page/${selected + 1}`);
    } else {
      handleChangingPageNumber(selected);
      navigate(`/movies/search/${params.query}/page/${selected + 1}`);
    }
  };

  async function getMoviesCount(): Promise<void> {
    const moviesCount: IMoviesCount = await moviesController.getMovieCount();
    setMoviesCount(moviesCount);
  }

  async function getLatestMovies(): Promise<void> {
    const latestMovies: IMovie[] = await moviesController.getLatestMovies();
    setLatestMovies(latestMovies);
  }

  async function getMovies(): Promise<void> {
    if (!params.page && !params.query && !params.sort) {
      const movies: IMovie[] = await moviesController.getMoviesDefault();
      setMovies(movies);
    } else if (params.page && !params.query && !params.sort) {
      const movies: IMovie[] = await moviesController.getMoviesPagination(params.page);
      setMovies(movies);
    } else if (!params.page && params.query && !params.sort) {
        const responseSearch: IMoviesSearchResponse = await moviesController.getMoviesSearchNoPagination(params.query);
        setMovies(responseSearch.movies);
        setMoviesCountSearch(responseSearch.count);
    } else if (params.page && params.query && !params.sort) {
        const responseSearch: IMoviesSearchResponse = await moviesController.getMoviesSearchWithPagination(params.query, params.page);
        setMovies(responseSearch.movies);
        setMoviesCountSearch(responseSearch.count);
    } else if (!params.page && !params.query && params.sort) {
      const responseMovies: IMoviesResponse = await moviesController.getMoviesSortingNoPagination(params.sort);
      setMovies(responseMovies.rows);
    } else if (params.page && !params.query && params.sort) {
      const responseMovies: IMoviesResponse = await moviesController.getMoviesSortingWithPagination(params.sort, params.page);
      setMovies(responseMovies.rows);
    }
  }

  if (!params.page && !params.query && !params.sort) {
    useEffect(() => {
      getMovies()
    }, [params.page]);
  } else if (params.page && !params.query && !params.sort) {
    useEffect(() => {
      getMovies()
    }, [params.page]);
  } else if (!params.page && params.query && !params.sort) {
    useEffect(() => {
      getMovies()
    }, [params.query]);
  } else if (params.page && params.query && !params.sort) {
    useEffect(() => {
      getMovies()
    }, [params.page]);
  } else if (!params.page && !params.query && params.sort) {
    useEffect(() => {
      getMovies()
    }, [params.sort]);
  } else if (params.page && !params.query && params.sort) {
    useEffect(() => {
      getMovies()
    }, [params.page]);
  }

  useEffect(() => {
    getMoviesCount(),
    getLatestMovies()
  }, []);

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
      <div className="home-wrapper-menus">
        <Header />
        {!params.query && movies && (<HomeCarousel />)}
        <div className="home-ribbon-2">
          {params.query ? (
            <Label classname="movie-count-span">
              Total movies: {moviesCountSearch}{" "}
            </Label>
          ) : (
            <Label classname="movie-count-span">
              Total movies: {moviesCount?.count}{" "}
            </Label>
          )}
          {!params.query && (
            <>
              <h3>Sort By: </h3>
              <ul className="list-sort">
                <Link to="/movies/sortBy/views">Most viewed (Desc)</Link>
                <Link to="/movies/sortBy/ratingImdb">Imdb rating (Desc)</Link>
                <Link to="/movies/sortBy/title">Title (Desc)</Link>
              </ul>
            </>
          )}
          {movies.length !== 0 ? (
            <div className="image-ribbon-2-wrapper">
              {movies.map((movie: any) => (
                <Card
                  classname="movie-item"
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
                  <img src={movie.photoSrc} />
                  <Label classname="movie-title">{movie.title}</Label>
                  <div className="genres-holder-span">
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
                  </div>
                  <Label classname="imdb-span">
                    {movie.ratingImdb !== 0
                      ? `Imdb: ${movie.ratingImdb}`
                      : "Imdb: N/A"}
                  </Label>
                </Card>
              ))}
            </div>
          ) : (
            <div className="no-search">
              <Label>No Search Result, no movie found with that criteria.</Label>
            </div>
          )}
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
        {!params.query && movies.length !== 0 && (
          <div className="home-ribbon-3">
            <ul className="list-latest">
              <li className="special-last">LATEST MOVIES</li>
            </ul>
            <div className="image-ribbon-3-wrapper">
              {latestMovies?.map((latestMovie: any) => (
                <Card
                  classname="movie-item-latest"
                  key={latestMovie.id}
                  onClick={function (e) {
                    e.stopPropagation();
                    navigate(
                      `/movies/${latestMovie.title
                        .split("")
                        .map((char: any) => (char === " " ? "-" : char))
                        .join("")}`
                    );
                    window.scrollTo(0, 0);
                  }}
                >
                  <img src={latestMovie.photoSrc} />
                  <Label classname="movie-title">{latestMovie.title}</Label>
                  <div className="genres-holder-span">
                    {latestMovie.genres.map((genre: any) => (
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
                  </div>
                  <Label classname="imdb-span">
                    {latestMovie.ratingImdb !== 0 && `Imdb: ${latestMovie.ratingImdb}`}
                  </Label>
                </Card>
              ))}
            </div>
          </div>
        )}
        <Footer />
      </div>
    </>
  );
}
