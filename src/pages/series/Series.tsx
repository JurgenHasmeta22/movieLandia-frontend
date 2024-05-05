import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import type ISerie from "~/interfaces/ISerie";
import movieService from "~/services/movieService";
import "../genre/style.css";
import "../home/style.css";
import type ISeriesResponse from "~/interfaces/ISeriesResponse";
import MovieItem from "~/components/movieItem/MovieItem";

export default function Series() {
    const [pageNumber, setPageNumber] = useState<number>(0);
    const [itemsPerPage, setItemsPerPage] = useState<number>(20);
    const [series, setSeries] = useState<ISerie[]>([]);
    const [seriesCount, setSeriesCount] = useState<number>(0);
    const [sortBy, setSortBy] = useState<string>("");

    const [searchParams, setSearchParams] = useSearchParams();

    const pageCount = Math.ceil(seriesCount / itemsPerPage);

    function handleChangingPageNumber(selected: any) {
        setPageNumber(selected);
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
        const seriesCount: any = await movieService.getSerieCount();
        setSeriesCount(seriesCount.count);
    }

    async function getSeries(): Promise<void> {
        if (searchParams.get("page")) {
            const responseSeries: ISeriesResponse =
                await movieService.getSerieEpisodesWithPagination(searchParams.get("page"));
            setSeries(responseSeries.rows);
        } else {
            const responseSeries: ISeriesResponse =
                await movieService.getSerieEpisodesNoPagination();
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
        <div className="genre-wrapper-menus">
            <div className="genre-ribbon-1">
                <span className="movie-count-span">Total series: {seriesCount}</span>
                <div className="image-ribbon-1-genre-wrapper">
                    {series.map((serie: any) => (
                        <MovieItem movie={serie} type="serie" key={serie.id} />
                    ))}
                </div>
                {/* <ReactPaginate
                    previousLabel={"< Previous"}
                    nextLabel={"Next >"}
                    pageCount={pageCount}
                    onPageChange={changePage}
                    containerClassName="paginationBttns"
                    previousLinkClassName="previousBttn"
                    nextLinkClassName="nextBttn"
                    disabledClassName="paginationDisabled"
                    activeClassName="paginationActive"
                /> */}
            </div>
        </div>
    );
}
