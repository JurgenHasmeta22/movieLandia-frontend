import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import type ISerie from "~/interfaces/ISerie";
import movieService from "~/services/movieService";
import type ISeriesResponse from "~/interfaces/ISeriesResponse";
import MovieItem from "~/components/movieItem/MovieItem";
import { Box, Typography } from "@mui/material";

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
        <Box>
            <Box>
                <Typography>Total series: {seriesCount}</Typography>
                <Box>
                    {series.map((serie: any) => (
                        <MovieItem movie={serie} type="serie" key={serie.id} />
                    ))}
                </Box>
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
            </Box>
        </Box>
    );
}
