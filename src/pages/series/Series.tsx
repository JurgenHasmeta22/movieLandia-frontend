import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import type ISerie from "~/types/ISerie";
import movieService from "~/services/movieService";
import type ISeriesResponse from "~/types/ISeriesResponse";
import MovieItem from "~/components/movieItem/MovieItem";
import { Box, CircularProgress, Pagination, Stack, Typography, useTheme } from "@mui/material";
import { tokens } from "~/utils/theme";

export default function Series() {
    const [series, setSeries] = useState<ISerie[]>([]);
    const [seriesCount, setSeriesCount] = useState<number>(0);
    const [searchParams, setSearchParams] = useSearchParams();

    const pageCount = Math.ceil(seriesCount / 20);
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);

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

    if (series?.length === 0) {
        return (
            <Box
                sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    height: "100vh",
                }}
            >
                <CircularProgress size={80} thickness={4} />
            </Box>
        );
    }

    return (
        <Box
            component={"main"}
            sx={{
                backgroundColor: `${colors.blueAccent[700]}`,
            }}
        >
            <Box
                component={"section"}
                sx={{
                    display: "flex",
                    flexDirection: "column",
                    placeItems: "center",
                    placeContent: "center",
                    rowGap: 4,
                }}
            >
                <Stack
                    direction="row"
                    flexWrap="wrap"
                    justifyContent={"center"}
                    alignContent={"center"}
                    rowGap={4}
                    columnGap={4}
                    marginTop={4}
                >
                    {series.map((serie: any) => (
                        <MovieItem movie={serie} type="serie" key={serie.id} />
                    ))}
                </Stack>
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
