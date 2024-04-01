import { useEffect, useState } from "react";
import ReactPaginate from "react-paginate";
import { useSearchParams } from "react-router-dom";
import { Footer } from "~/components/footer/index";
import { Header } from "~/components/header/index";
import moviesController from "~/services/movies";
import IMovie from "~/interfaces/IMovie";
import MovieItem from "~/pages/home/movieItem";
import "~/pages/home/style.css";

export default function Home() {
    const [searchParams, setSearchParams] = useSearchParams();
    const [moviesCount, setMoviesCount] = useState<number>(0);
    const [pageNumber, setPageNumber] = useState<number>(0);
    const [itemsPerPage, setItemsPerPage] = useState<number>(20);
    const [sortBy, setSortBy] = useState<string>("views");
    const [movies, setMovies] = useState<IMovie[]>([]);
    const [latestMovies, setLatestMovies] = useState<IMovie[]>([]);
    const [searchTerm, setSearchTerm] = useState<string>("");

    useEffect(() => {
        async function fetchData() {
            const params = new URLSearchParams();

            if (searchTerm && searchTerm.length > 0) {
                params.set("search", searchTerm);
            }

            if (sortBy) {
                params.set("sortBy", sortBy);
            }

            if (searchParams.get("page")) {
                params.set("page", searchParams.get("page")!);
            }

            const response = await moviesController.getMovies();
            setMovies(response.movies);
            setMoviesCount(response.count);
            setLatestMovies(await moviesController.getLatestMovies());
        }
        fetchData();
    }, [searchParams, searchTerm, sortBy]);

    const handlePageChange = ({ selected }: any) => {
        const params = new URLSearchParams(searchParams.toString());
        params.set("page", (selected + 1).toString());
        setSearchParams(params);
    };

    const handleSortByChange = (sortBy: string) => {
        setSearchParams((prevParams) => {
            const params = new URLSearchParams(prevParams.toString());
            params.set("sortBy", sortBy);
            return params;
        });
    };

    if (!movies) {
        return <div className="loading-wrapper">...</div>;
    }

    return (
        <div className="home-wrapper-menus">
            <Header />
            <div className="home-ribbon-2">
                {!searchParams.get("search") && (
                    <>
                        <h3>Sort By: </h3>
                        <ul className="list-sort">
                            <li onClick={() => handleSortByChange("ratingImdb")}>
                                Imdb rating (Desc)
                            </li>
                            <li onClick={() => handleSortByChange("title")}>Title (Desc)</li>
                        </ul>
                    </>
                )}
                {movies.length !== 0 ? (
                    <div className="image-ribbon-2-wrapper">
                        {movies.map((movie: any) => (
                            <MovieItem movie={movie} type="homeMovie" key={movie.id} />
                        ))}
                    </div>
                ) : (
                    <div className="no-search">
                        <span>No Search Result.</span>
                    </div>
                )}
                <ReactPaginate
                    previousLabel={"< Previous"}
                    nextLabel={"Next >"}
                    pageCount={Math.ceil(moviesCount! / itemsPerPage)}
                    onPageChange={handlePageChange}
                    containerClassName={"paginationBttns"}
                    previousLinkClassName={"previousBttn"}
                    nextLinkClassName={"nextBttn"}
                    disabledClassName={"paginationDisabled"}
                    activeClassName={"paginationActive"}
                />
            </div>
            {!searchParams.get("search") && (
                <div className="home-ribbon-3">
                    <ul className="list-latest">
                        <li className="special-last">Latest Movies</li>
                    </ul>
                    <div className="image-ribbon-3-wrapper">
                        {latestMovies?.map((latestMovie: any) => (
                            <MovieItem type="homeLatest" movie={latestMovie} key={latestMovie} />
                        ))}
                    </div>
                </div>
            )}
            <Footer />
        </div>
    );
}
