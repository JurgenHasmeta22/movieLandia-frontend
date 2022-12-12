import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import ReactPaginate from "react-paginate";
import Footer from "~/main/components/footer";
import Header from "~/main/components/header";
import ISerie from "~/main/interfaces/ISerie";
import moviesController from "~/main/controllers/moviesController";
import '../genre/style.css';
import '../home/style.css'
import ISeriesResponse from "~/main/interfaces/ISeriesResponse";

export default function Series() {

    const [pageNumber, setPageNumber] = useState<number>(0)
    const [itemsPerPage, setItemsPerPage] = useState<number>(20)
    const [series, setSeries] = useState<ISerie[]>([]);
    const [seriesCount, setSeriesCount] = useState<number>(0);
    const [sortBy, setSortBy] = useState<string>("");
    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();
    let pagesVisited = pageNumber * itemsPerPage
    const pageCount = Math.ceil(seriesCount / itemsPerPage)

    function handleChangingPageNumber(selected: any) {
        setPageNumber(selected)
    }

    const changePage = ({ selected }: any) => {
        handleChangingPageNumber(selected);
        if (searchParams.get("sort")) {
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

    async function getSeriesCount(): Promise<void> {
        const seriesCount: any = await moviesController.getSerieCount();
        setSeriesCount(seriesCount.count);
    }

    async function getSeries(): Promise<void> {
        if (searchParams.get("page")) {
            const responseSeries: ISeriesResponse = await moviesController.getSerieEpisodesWithPagination(searchParams.get("page"));
            setSeries(responseSeries.rows);
        } else {
            const responseSeries: ISeriesResponse = await moviesController.getSerieEpisodesNoPagination();
            setSeries(responseSeries.rows);
        }
    }

    useEffect(() => {
        getSeries();
    }, [searchParams.get("page")]);

    useEffect(() => {
        getSeriesCount();
    }, []);

    return (
        <div className='genre-wrapper-menus'>
            <Header />
            <div className='genre-ribbon-1'>
                <span className="movie-count-span">
                    Total series: {seriesCount}
                </span>
                <div className='image-ribbon-1-genre-wrapper'>
                    {series.map((serie: ISerie) => (
                    <div
                        className='movie-item-genre'
                        key={serie.id}
                        onClick={function (e) {
                            e.stopPropagation();
                            navigate(
                                `/series/${serie.title
                                .split("")
                                .map((char: any) => (char === " " ? "-" : char))
                                .join("")}`
                            );
                        }}
                    >
                        <img src={serie.photoSrc} alt="" />
                        <span className='movie-title'>{serie.title}</span>
                        <span className='imdb-span'>
                            {serie.ratingImdb ? 'Imdb: ' + serie.ratingImdb : 'Imdb: ' + 'N/A'}
                        </span>
                    </div>
                    ))}
                </div>
                <ReactPaginate
                    previousLabel={'< Previous'}
                    nextLabel={'Next >'}
                    pageCount={pageCount}
                    onPageChange={changePage}
                    containerClassName='paginationBttns'
                    previousLinkClassName='previousBttn'
                    nextLinkClassName='nextBttn'
                    disabledClassName='paginationDisabled'
                    activeClassName='paginationActive'
                />
            </div>
            <Footer />
        </div>
    )
}