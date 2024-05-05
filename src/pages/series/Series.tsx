import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import type ISerie from "~/interfaces/ISerie";
import movieService from "~/services/movieService";
import type ISeriesResponse from "~/interfaces/ISeriesResponse";
import MovieItem from "~/components/movieItem/MovieItem";
import { Box, Pagination, Stack, Typography } from "@mui/material";

export default function Series() {
    const [series, setSeries] = useState<ISerie[]>([]);
    const [seriesCount, setSeriesCount] = useState<number>(0);

    const [searchParams, setSearchParams] = useSearchParams();

    const pageCount = Math.ceil(seriesCount / 20);

    const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
        searchParams.set("page", String(value));
        setSearchParams(searchParams);
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
                <Stack
                    spacing={2}
                    sx={{ display: "flex", placeItems: "center", marginTop: 4, marginBottom: 4 }}
                >
                    <Pagination
                        page={searchParams.get("page") ? Number(searchParams.get("page")) : 1}
                        size="large"
                        count={pageCount}
                        showFirstButton
                        showLastButton
                        onChange={handlePageChange}
                    />
                </Stack>
            </Box>
        </Box>
    );
}
