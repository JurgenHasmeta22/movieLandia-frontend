import Carousel from "@palustris/react-images";
import { useEffect, useState } from "react";
import ReactLoading from "react-loading";
import ReactPaginate from "react-paginate";
import { useNavigate, useParams } from "react-router";
import { Link } from "react-router-dom";
import Footer from "../../components/footer";
import Header from "../../components/header";
import moviesController from "../../controllers/moviesController";
import { useStore } from "../../store/zustand/store";
import IMovie from "../../store/zustand/types/IMovie";
import IMoviesCount from "../../store/zustand/types/IMoviesCount";
import IMoviesResponse from "../../store/zustand/types/IMoviesResponse";
import "./style.css";

export default function Home() {
  const navigate = useNavigate();
  const params = useParams();
  const [moviesCount, setMoviesCount] = useState<IMoviesCount>();
  const [moviesCountSearch, setMoviesCountSearch] = useState<number>();
  const {movies, setMovies, latestMovies, setLatestMovies} = useStore();
  const [pageNumber, setPageNumber] = useState<number>(0);
  const [itemsPerPage, setItemsPerPage] = useState<number>(20);

  const images = [
    { source: "http://localhost:4000/images/rsz_fistful_of_vengeance.png" },
    { source: "http://localhost:4000/images/rsz_texas.png" },
    { source: "http://localhost:4000/images/rsz_movieposter_en.png" },
    {
      source:
        "http://localhost:4000/images/rsz_wyihsxwyqn8ejsdut2p1p0o97n0.png",
    },
    {
      source:
        "http://localhost:4000/images/rsz_elevjj3yg279mmpwuygyrhbjbbq.png",
    },
  ];

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
    if (params.sort === undefined && params.query === undefined) {
      handleChangingPageNumber(selected);
      navigate(`../movies/page/${selected + 1}`);
    } else if (params.sort && params.query === undefined) {
      handleChangingPageNumber(selected);
      navigate(`../movies/sortBy/${params.sort}/page/${selected + 1}`);
    } else {
      handleChangingPageNumber(selected);
      navigate(`../movies/search/${params.query}/page/${selected + 1}`);
    }
  };

  async function getMovieCount(): Promise<void> {
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
        const responseSearch: IMoviesResponse = await moviesController.getMoviesSearchNoPagination(params.query);
        setMovies(responseSearch.rows);
        setMoviesCountSearch(responseSearch.count);
    } else if (params.page && params.query && !params.sort) {
        const responseSearch: IMoviesResponse = await moviesController.getMoviesSearchWithPagination(params.query, params.page);
        setMovies(responseSearch.rows);
        setMoviesCountSearch(responseSearch.count);
    } else if (!params.page && !params.query && params.sort) {
      const movies: IMovie[] = await moviesController.getMoviesSortingNoPagination(params.sort);
      setMovies(movies);
    } else if (params.page && !params.query && params.sort) {
      const movies: IMovie[] = await moviesController.getMoviesSortingWithPagination(params.sort, params.page);
      setMovies(movies);
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
    getMovieCount(),
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
  } else if (movies.length === 0) {
    return (
      <div className="home-wrapper-menus">
        <Header />
        <div className="home-ribbon-2">
          <div className="no-search">
            <span>No Search Result or the array is getting populated.</span>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <>
      <div className="home-wrapper-menus">
        <Header />
        {( params.query === undefined || params.query.length === 0 ) &&
        movies ? (
          <div className="home-ribbon-1">
            <Carousel views={images} />
          </div>
        ) : null}
        <div className="home-ribbon-2">
          {params.query ? (
            <span className="movie-count-span">
              Total movies: {moviesCountSearch}{" "}
            </span>
          ) : (
            <span className="movie-count-span">
              Total movies: {moviesCount?.count}{" "}
            </span>
          )}
          {params.query === undefined || params.query.length === 0 ? (
            <>
              <h3>Sort By: </h3>
              <ul className="list-sort">
                <Link to="/movies/sortBy/views">Most viewed (Desc)</Link>
                <Link to="/movies/sortBy/ratingImdb">Imdb rating (Desc)</Link>
                <Link to="/movies/sortBy/title">Title (Desc)</Link>
              </ul>
            </>
          ) : null}
          {movies.length !== 0 ? (
            <div className="image-ribbon-2-wrapper">
              {movies?.map((movie: any) => (
                <div
                  className="movie-item"
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
                  <span className="movie-title">{movie.title}</span>
                  <div className="genres-holder-span">
                    {movie.genres.map((genre: any) => (
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
                    {movie.ratingImdb !== 0
                      ? "Imdb: " + movie.ratingImdb
                      : "Imdb: " + "N/A"}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="no-search">
              <span>No Search Result, no movie found with that criteria.</span>
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
        {(params.query === undefined || params.query.length === 0) &&
        movies?.length !== 0 ? (
          <div className="home-ribbon-3">
            <ul className="list-latest">
              <li className="special-last">LATEST MOVIES</li>
            </ul>
            <div className="image-ribbon-3-wrapper">
              {latestMovies?.map((latestMovie: any) => (
                <div
                  className="movie-item-latest"
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
                  <span className="movie-title">{latestMovie.title}</span>
                  <div className="genres-holder-span">
                    {latestMovie.genres.map((genre: any) => (
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
                    {latestMovie.ratingImdb !== 0
                      ? "Imdb: " + latestMovie.ratingImdb
                      : null}
                  </span>
                </div>
              ))}
            </div>
          </div>
        ) : null}
        <Footer />
      </div>
    </>
  );
}
