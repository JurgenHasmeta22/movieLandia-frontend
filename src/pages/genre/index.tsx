import { useEffect, useState } from 'react';
import ReactLoading from 'react-loading';
import ReactPaginate from 'react-paginate';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import Header from '~/components/header/index';
import moviesController from '~/services/movies';
import IGenreResponse from '~/interfaces/IGenreResponse';
import './style.css';
import Footer from '~/components/footer';
import MovieItem from '~/components/MovieItem';
import IMovie from '~/interfaces/IMovie';

export default function Genre() {
    const params = useParams();
    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();
    const [pageNumber, setPageNumber] = useState<number>(0);
    const [itemsPerPage, setItemsPerPage] = useState<number>(20);
    const [moviesCountGenre, setMoviesCountGenres] = useState<number>(0);
    const [moviesOfGenre, setMoviesOfGenre] = useState<IMovie[]>([]);
    const pageCount: number = Math.ceil(moviesCountGenre / itemsPerPage);

    function handleChangingPageNumber(selected: any): void {
        setPageNumber(selected);
    }

    const changePage = ({ selected }: any): void => {
        handleChangingPageNumber(selected);
        searchParams.set('page', selected + 1);
        setSearchParams(searchParams);
    };

    async function getMoviesOnGenre(): Promise<void> {
        if (!searchParams.get('page') && params.name) {
            const response: IGenreResponse = await moviesController.getGenreMoviesNoPagination(
                params.name,
            );
            setMoviesOfGenre(response.movies);
            setMoviesCountGenres(response.count);
        } else {
            const response: IGenreResponse = await moviesController.getGenreMoviesWithPagination(
                params.name,
                searchParams.get('page'),
            );
            setMoviesOfGenre(response.movies);
            setMoviesCountGenres(response.count);
        }
    }

    useEffect(() => {
        getMoviesOnGenre();
    }, [params.name, searchParams.get('page')]);

    if (!moviesOfGenre) {
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
        <div className='genre-wrapper-menus'>
            <Header />
            <div className='genre-ribbon-1'>
                <span className='movie-count-span'>
                    Total movies in this genre: {moviesCountGenre}
                </span>
                <div className='image-ribbon-1-genre-wrapper'>
                    {moviesOfGenre.map((movie: any) => (
                        <MovieItem movie={movie} type='genreMovie' key={movie.id} />
                    ))}
                </div>
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
            <Footer />
        </div>
    );
}
