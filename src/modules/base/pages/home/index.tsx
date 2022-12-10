import { useEffect, useState } from "react";
import ReactLoading from "react-loading";
import ReactPaginate from "react-paginate";
import { useNavigate } from "react-router";
import { useSearchParams } from "react-router-dom";
import Card from "~/main/components/card/index";
import Container from "~/main/components/container/index";
import Footer from "~/main/components/footer/index";
import Header from "~/main/components/header/index";
import Label from "~/main/components/label/index";
import List from "~/main/components/list/index";
import ListItem from "~/main/components/list/listItem/index";
import Picture from "~/main/components/picture/index";
import moviesController from "~/main/controllers/moviesController";
import { useStore } from "~/main/store/zustand/store";
import IMovie from "~/main/interfaces/IMovie";
import IMoviesCount from "~/main/interfaces/IMoviesCount";
import IMoviesSearchResponse from "~/main/interfaces/IMovieSearchResponse";
import IMoviesResponse from "~/main/interfaces/IMoviesResponse";
import HomeCarousel from "~/modules/base/pages/home/homeCarousel/index";
import "~/modules/base/pages/home/style.css";
// import useQuery from "~/main/hooks/useQueryParams";

export default function Home() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [moviesCount, setMoviesCount] = useState<IMoviesCount | null>(null);
  const [moviesCountSearch, setMoviesCountSearch] = useState<number | null>(null);
  const [pageNumber, setPageNumber] = useState<number>(0);
  const [itemsPerPage, setItemsPerPage] = useState<number>(20);
  const [sortBy, setSortBy] = useState<string>("");
  // const [sortByParam, setSortByParam] = useState<string | null>("");
  // const [searchParam, setSearchParam] = useState<string | null>("");
  // const [pageParam, setPageParam] = useState<string | null>("");
  // let query = useQuery();
  const { movies, setMovies, latestMovies, setLatestMovies, searchTerm } = useStore();
  let pageCount;
  
  if (searchParams.get("search")) {
    pageCount = Math.ceil(moviesCountSearch! / itemsPerPage);
  } else {
    pageCount = Math.ceil(moviesCount?.count! / itemsPerPage);
  }

  function handleChangingPageNumber(selected: any) {
    setPageNumber(selected);
  }

  const changePage = ({selected}: any) => {
    if (!searchParams.get("sort") && !searchParams.get("search")) {
      handleChangingPageNumber(selected);
      searchParams.set("page", selected + 1);
      setSearchParams(searchParams);
    } else if (searchParams.get("sort") && !searchParams.get("search")) {
      handleChangingPageNumber(selected);
      searchParams.set("sortBy", sortBy);
      searchParams.set("page", selected + 1);
      setSearchParams(searchParams);
    } else {
      handleChangingPageNumber(selected);
      searchParams.set("page", selected + 1);
      setSearchParams(searchParams);
    }
  };

  function conditionalRenderingMovieCount(): JSX.Element | undefined {
    if (searchParams.get("search")) {
      return (
        <Label classname="movie-count-span">
          Total movies: {moviesCountSearch}
        </Label>
      )
    } else {
      return (
        <Label classname="movie-count-span">
          Total movies: {moviesCount?.count}
        </Label>
      )
    }
  }

  function conditionalRenderingCarousel(): JSX.Element | undefined {
    if (!searchParams.get("search")) {
      return (
        <HomeCarousel />
      )
    }
  }

  function conditionalRenderingSorting(): JSX.Element | undefined {
    if (!searchParams.get("search")) {
      return (
        <>
          <h3>Sort By: </h3>
          <List classname="list-sort">
            <Label onClick={()=>{
              setSearchParams({sortBy: 'views'})
            }}>Most viewed (Desc)</Label>
            <Label onClick={()=>{
              setSearchParams({sortBy: 'imdbRating'})
            }}>Imdb rating (Desc)</Label>
            <Label onClick={()=>{
              setSearchParams({sortBy: 'title'})
            }}>Title (Desc)</Label>
          </List>
        </>
      )
    }
  }

  function conditionalRenderingMovies(): JSX.Element | undefined {
    if (movies.length !== 0) {
      return (
        <Container classname="image-ribbon-2-wrapper">
          {movies.map((movie: any) => (
            <Card
              classname="movie-item"
              key={movie.id}
              myKey={movie.id}
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
              <Picture src={movie.photoSrc} />
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
                {movie.ratingImdb !== 0 ? `Imdb: ${movie.ratingImdb}`: "Imdb: N/A"}
              </Label>
            </Card>
          ))}
        </Container>
      );
    } else {
      return (
        <Container classname="no-search">
          <Label>No Search Result, no movie found with that criteria.</Label>
        </Container>
      )
    }
  }

  function conditionalRenderingLatestMovies(): JSX.Element | undefined {
    if (!searchParams.get("search")) {
      return (
        <Container classname="home-ribbon-3">
          <List classname="list-latest">
            <ListItem classname="special-last">LATEST MOVIES</ListItem>
          </List>
          <Container classname="image-ribbon-3-wrapper">
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
                <Picture src={latestMovie.photoSrc} />
                <Label classname="movie-title">{latestMovie.title}</Label>
                <Container classname="genres-holder-span">
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
                </Container>
                <Label classname="imdb-span">
                  {latestMovie.ratingImdb !== 0 &&
                    `Imdb: ${latestMovie.ratingImdb}`}
                </Label>
              </Card>
            ))}
          </Container>
        </Container>
      );
    }
  }
  
  async function getMoviesCount(): Promise<void> {
    const moviesCount: IMoviesCount = await moviesController.getMovieCount();
    setMoviesCount(moviesCount);
  }

  async function getLatestMovies(): Promise<void> {
    const latestMovies: IMovie[] = await moviesController.getLatestMovies();
    setLatestMovies(latestMovies);
  }

  async function getMovies(): Promise<void> {
    if (!searchParams.get("page") && !searchParams.get("search") && !searchParams.get("sortBy")) {
      const movies: IMovie[] = await moviesController.getMoviesDefault();
      setMovies(movies);
    } else if (searchParams.get("page") && !searchParams.get("search") && !searchParams.get("sortBy")) {
        const movies: IMovie[] = await moviesController.getMoviesPagination(searchParams.get("page"));
        setMovies(movies);
    } else if (!searchParams.get("page") && searchParams.get("search") && !searchParams.get("sortBy")) {
        const responseSearch: IMoviesSearchResponse = await moviesController.getMoviesSearchNoPagination(searchParams.get("search"));
        setMovies(responseSearch.movies);
        setMoviesCountSearch(responseSearch.count);
    } else if (searchParams.get("page") && searchParams.get("search") && !searchParams.get("sortBy")) {
        const responseSearch: IMoviesSearchResponse = await moviesController.getMoviesSearchWithPagination(searchParams.get("search"), searchParams.get("page"));
        setMovies(responseSearch.movies);
        setMoviesCountSearch(responseSearch.count);
    } else if (!searchParams.get("page") && !searchParams.get("search") && searchParams.get("sortBy")) {
        const responseMovies: IMoviesResponse = await moviesController.getMoviesSortingNoPagination(searchParams.get("sortBy"));
        setMovies(responseMovies.rows);
    } else if (searchParams.get("page") && !searchParams.get("search") && searchParams.get("sortBy")) {
        const responseMovies: IMoviesResponse = await moviesController.getMoviesSortingWithPagination(searchParams.get("sortBy"), searchParams.get("page"));
        setMovies(responseMovies.rows);
    }
  }

  if (!searchParams.get("page") && !searchParams.get("search") && !searchParams.get("sortBy")) {
    useEffect(() => {
      getMovies()
    }, [searchParams.get("page")]);
  } else if (searchParams.get("page") && !searchParams.get("search") && !searchParams.get("sortBy")) {
    useEffect(() => {
      getMovies();
    }, [searchParams.get("page")]);
  } else if (!searchParams.get("page") && searchParams.get("search") && !searchParams.get("sortBy")) {
    useEffect(() => {
      getMovies();
    }, [searchParams.get("search")]);
  } else if (searchParams.get("page") && searchParams.get("search") && !searchParams.get("sortBy")) {
    useEffect(() => {
      getMovies();
    }, [searchParams.get("page")]);
  } else if (!searchParams.get("page") && !searchParams.get("search") && searchParams.get("sortBy")) {
    useEffect(() => {
      getMovies();
    }, [searchParams.get("sortBy")]);
  } else if (searchParams.get("page") && !searchParams.get("search") && searchParams.get("sortBy")) {
    useEffect(() => {
      getMovies();
    }, [searchParams.get("page")]);
  }

  useEffect(() => {
    getMoviesCount(),
    getLatestMovies()
  }, []);

  useEffect(() => {
    if (searchTerm && searchTerm.length > 0) {
      searchParams.set("search", searchTerm);
      setSearchParams(searchParams);
    } else if (searchTerm.length === 0) {
      searchParams.delete("search");
      if (searchParams.get("page")) searchParams.delete("page");
      if (searchParams.get("sortBy")) searchParams.delete("sortBy");
      setSearchParams(searchParams);
    } 
  }, [searchTerm]);

  // useEffect(() => {
  //   if (searchParams.get("page")) setPageParam(searchParams.get("page"))
  //   if (searchParams.get("search")) setSearchParam(searchParams.get("search"));
  //   if (searchParams.get("sortBy")) setSortByParam(searchParams.get("sortBy"));
  // }, [searchParams]);

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
    <>
      <Container classname="home-wrapper-menus">
        <Header />
        {conditionalRenderingCarousel()}
        <Container classname="home-ribbon-2">
          {conditionalRenderingMovieCount()}
          {conditionalRenderingSorting()}
          {conditionalRenderingMovies()}
          <ReactPaginate
            previousLabel={"< Previous"}
            nextLabel={"Next >"}
            pageCount={pageCount}
            onPageChange={changePage}
            // initialPage={2}
            // initialPage={searchParams.get("page") && Number(searchParams.get("page"))}
            containerClassName={"paginationBttns"}
            previousLinkClassName={"previousBttn"}
            nextLinkClassName={"nextBttn"}
            disabledClassName={"paginationDisabled"}
            activeClassName={"paginationActive"}
          />
        </Container>
        {conditionalRenderingLatestMovies()}
        <Footer />
      </Container>
    </>
  );
}
