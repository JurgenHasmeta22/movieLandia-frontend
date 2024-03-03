import { useEffect, useState } from 'react';
import ReactLoading from 'react-loading';
import ReactPaginate from 'react-paginate';
import { useNavigate } from 'react-router';
import { useSearchParams } from 'react-router-dom';
import Footer from '~/components/footer/index';
import Header from '~/components/header/index';
import moviesController from '~/services/movies';
import IMovie from '~/interfaces/IMovie';
import IMoviesCount from '~/interfaces/IMoviesCount';
import IMoviesSearchResponse from '~/interfaces/IMovieSearchResponse';
import IMoviesResponse from '~/interfaces/IMoviesResponse';
import HomeCarousel from '~/pages/home/homeCarousel/index';
import '~/pages/home/style.css';
import MovieItem from '~/components/MovieItem';

export default function Home() {
    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();
    const [moviesCount, setMoviesCount] = useState<IMoviesCount | null>(null);
    const [moviesCountSearch, setMoviesCountSearch] = useState<number | null>(null);
    const [pageNumber, setPageNumber] = useState<number>(0);
    const [itemsPerPage, setItemsPerPage] = useState<number>(20);
    const [sortBy, setSortBy] = useState<string>('');
    const [movies, setMovies] = useState<IMovie[]>([]);
    const [latestMovies, setLatestMovies] = useState<IMovie[]>([]);
    const [searchTerm, setSearchTerm] = useState<string>('');

    let pageCount;

    if (searchParams.get('search')) {
        pageCount = Math.ceil(moviesCountSearch! / itemsPerPage);
    } else {
        pageCount = Math.ceil(moviesCount?.count! / itemsPerPage);
    }

    function handleChangingPageNumber(selected: any) {
        setPageNumber(selected);
    }

    const changePage = ({ selected }: any) => {
        if (!searchParams.get('sort') && !searchParams.get('search')) {
            handleChangingPageNumber(selected);
            searchParams.set('page', selected + 1);
            setSearchParams(searchParams);
        } else if (searchParams.get('sort') && !searchParams.get('search')) {
            handleChangingPageNumber(selected);
            searchParams.set('sortBy', sortBy);
            searchParams.set('page', selected + 1);
            setSearchParams(searchParams);
        } else {
            handleChangingPageNumber(selected);
            searchParams.set('page', selected + 1);
            setSearchParams(searchParams);
        }
    };

    function conditionalRenderingMovieCount(): JSX.Element | undefined {
        if (searchParams.get('search')) {
            return <span className='movie-count-span'>Total movies: {moviesCountSearch}</span>;
        } else {
            return <span className='movie-count-span'>Total movies: {moviesCount?.count}</span>;
        }
    }

    function conditionalRenderingCarousel(): JSX.Element | undefined {
        if (!searchParams.get('search')) {
            return <HomeCarousel />;
        }
    }

    function conditionalRenderingSorting(): JSX.Element | undefined {
        if (!searchParams.get('search')) {
            return (
                <>
                    <h3>Sort By: </h3>
                    <ul className='list-sort'>
                        <span
                            onClick={() => {
                                setSearchParams({ sortBy: 'views' });
                            }}
                        >
                            Most viewed (Desc)
                        </span>
                        <span
                            onClick={() => {
                                setSearchParams({ sortBy: 'imdbRating' });
                            }}
                        >
                            Imdb rating (Desc)
                        </span>
                        <span
                            onClick={() => {
                                setSearchParams({ sortBy: 'title' });
                            }}
                        >
                            Title (Desc)
                        </span>
                    </ul>
                </>
            );
        }
    }

    function conditionalRenderingMovies(): JSX.Element | undefined {
        if (movies.length !== 0) {
            return (
                <div className='image-ribbon-2-wrapper'>
                    {movies.map((movie: any) => (
                        <MovieItem movie={movie} type='homeMovie' key={movie.id} />
                    ))}
                </div>
            );
        } else {
            return (
                <div className='no-search'>
                    <span>No Search Result, no movie found with that criteria.</span>
                </div>
            );
        }
    }

    function conditionalRenderingLatestMovies(): JSX.Element | undefined {
        if (!searchParams.get('search')) {
            return (
                <div className='home-ribbon-3'>
                    <ul className='list-latest'>
                        <li className='special-last'>LATEST MOVIES</li>
                    </ul>
                    <div className='image-ribbon-3-wrapper'>
                        {latestMovies?.map((latestMovie: any) => (
                            <MovieItem type='homeLatest' movie={latestMovie} key={latestMovie} />
                        ))}
                    </div>
                </div>
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
        if (
            !searchParams.get('page') &&
            !searchParams.get('search') &&
            !searchParams.get('sortBy')
        ) {
            const movies: IMovie[] = await moviesController.getMoviesDefault();
            setMovies(movies);
        } else if (
            searchParams.get('page') &&
            !searchParams.get('search') &&
            !searchParams.get('sortBy')
        ) {
            const movies: IMovie[] = await moviesController.getMoviesPagination(
                searchParams.get('page'),
            );
            setMovies(movies);
        } else if (
            !searchParams.get('page') &&
            searchParams.get('search') &&
            !searchParams.get('sortBy')
        ) {
            const responseSearch: IMoviesSearchResponse =
                await moviesController.getMoviesSearchNoPagination(searchParams.get('search'));
            setMovies(responseSearch.movies);
            setMoviesCountSearch(responseSearch.count);
        } else if (
            searchParams.get('page') &&
            searchParams.get('search') &&
            !searchParams.get('sortBy')
        ) {
            const responseSearch: IMoviesSearchResponse =
                await moviesController.getMoviesSearchWithPagination(
                    searchParams.get('search'),
                    searchParams.get('page'),
                );
            setMovies(responseSearch.movies);
            setMoviesCountSearch(responseSearch.count);
        } else if (
            !searchParams.get('page') &&
            !searchParams.get('search') &&
            searchParams.get('sortBy')
        ) {
            const responseMovies: IMoviesResponse =
                await moviesController.getMoviesSortingNoPagination(searchParams.get('sortBy'));
            setMovies(responseMovies.rows);
        } else if (
            searchParams.get('page') &&
            !searchParams.get('search') &&
            searchParams.get('sortBy')
        ) {
            const responseMovies: IMoviesResponse =
                await moviesController.getMoviesSortingWithPagination(
                    searchParams.get('sortBy'),
                    searchParams.get('page'),
                );
            setMovies(responseMovies.rows);
        }
    }

    if (!searchParams.get('page') && !searchParams.get('search') && !searchParams.get('sortBy')) {
        useEffect(() => {
            getMovies();
        }, [searchParams.get('page')]);
    } else if (
        searchParams.get('page') &&
        !searchParams.get('search') &&
        !searchParams.get('sortBy')
    ) {
        useEffect(() => {
            getMovies();
        }, [searchParams.get('page')]);
    } else if (
        !searchParams.get('page') &&
        searchParams.get('search') &&
        !searchParams.get('sortBy')
    ) {
        useEffect(() => {
            getMovies();
        }, [searchParams.get('search')]);
    } else if (
        searchParams.get('page') &&
        searchParams.get('search') &&
        !searchParams.get('sortBy')
    ) {
        useEffect(() => {
            getMovies();
        }, [searchParams.get('page')]);
    } else if (
        !searchParams.get('page') &&
        !searchParams.get('search') &&
        searchParams.get('sortBy')
    ) {
        useEffect(() => {
            getMovies();
        }, [searchParams.get('sortBy')]);
    } else if (
        searchParams.get('page') &&
        !searchParams.get('search') &&
        searchParams.get('sortBy')
    ) {
        useEffect(() => {
            getMovies();
        }, [searchParams.get('page')]);
    }

    useEffect(() => {
        getMoviesCount(), getLatestMovies();
    }, []);

    useEffect(() => {
        if (searchTerm && searchTerm.length > 0) {
            searchParams.set('search', searchTerm);
            setSearchParams(searchParams);
        } else if (searchTerm.length === 0) {
            searchParams.delete('search');
            if (searchParams.get('page')) searchParams.delete('page');
            if (searchParams.get('sortBy')) searchParams.delete('sortBy');
            setSearchParams(searchParams);
        }
    }, [searchTerm]);

    if (!movies) {
        return (
            <div className='loading-wrapper'>
                <ReactLoading
                    type={'spin'}
                    color={'#000'}
                    height={200}
                    width={100}
                    className='loading'
                />
            </div>
        );
    }

    return (
        <div className='home-wrapper-menus'>
            <Header />
            {conditionalRenderingCarousel()}
            <div className='home-ribbon-2'>
                {conditionalRenderingMovieCount()}
                {conditionalRenderingSorting()}
                {conditionalRenderingMovies()}
                <ReactPaginate
                    previousLabel={'< Previous'}
                    nextLabel={'Next >'}
                    pageCount={pageCount}
                    onPageChange={changePage}
                    containerClassName={'paginationBttns'}
                    previousLinkClassName={'previousBttn'}
                    nextLinkClassName={'nextBttn'}
                    disabledClassName={'paginationDisabled'}
                    activeClassName={'paginationActive'}
                />
            </div>
            {conditionalRenderingLatestMovies()}
            <Footer />
        </div>
    );
}
