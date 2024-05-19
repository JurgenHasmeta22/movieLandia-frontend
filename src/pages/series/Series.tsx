import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import type ISerie from "~/types/ISerie";
import type ISeriesResponse from "~/types/ISeriesResponse";
import MovieItem from "~/components/movieItem/MovieItem";
import {
    Box,
    CircularProgress,
    MenuItem,
    Pagination,
    Select,
    Stack,
    Typography,
    useTheme,
} from "@mui/material";
import { tokens } from "~/utils/theme";
import serieService from "~/services/api/serieService";
import SEOHelmet from "~/components/seoHelmet/SEOHelmet";
import { useSorting } from "~/hooks/useSorting";
import { toFirstWordUpperCase } from "~/utils/utils";
import IMoviesResponse from "~/types/IMoviesResponse";

export default function Series() {
    const [series, setSeries] = useState<ISerie[] | undefined>(undefined);
    const [seriesCount, setSeriesCount] = useState<number>(0);
    const [seriesCountSearch, setSeriesCountSearch] = useState<number>(0);
    const [searchParams, setSearchParams] = useSearchParams();

    const pageCount = Math.ceil(seriesCount / 20);
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const handleChangeSorting = useSorting();

    const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
        searchParams.set("page", String(value));
        setSearchParams(searchParams);
    };

    async function getSeries(): Promise<void> {
        let seriesResponse: ISerie[] = [];

        if (searchParams.get("search")) {
            if (searchParams.get("page")) {
                const response: ISeriesResponse = await serieService.searchSeriesByTitle(
                    searchParams.get("search")!,
                    searchParams.get("page")!,
                );

                seriesResponse = response.rows;
                setSeriesCountSearch(response.count);
            } else {
                const response: ISeriesResponse = await serieService.searchSeriesByTitle(
                    searchParams.get("search")!,
                );

                seriesResponse = response.rows;
                setSeriesCountSearch(response.count);
            }
        } else {
            if (searchParams.get("sortBy") && searchParams.get("ascOrDesc")) {
                if (searchParams.get("page")) {
                    const queryParams = {
                        sortBy: searchParams.get("sortBy")!,
                        page: searchParams.get("page")!,
                        ascOrDesc: searchParams.get("ascOrDesc")!,
                    };

                    const responseSeries: ISeriesResponse =
                        await serieService.getSeries(queryParams);
                    seriesResponse = responseSeries.rows;
                    setSeriesCount(responseSeries.count);
                } else {
                    const queryParams = {
                        sortBy: searchParams.get("sortBy")!,
                        ascOrDesc: searchParams.get("ascOrDesc")!,
                    };

                    const responseSeries: ISeriesResponse =
                        await serieService.getSeries(queryParams);
                    seriesResponse = responseSeries.rows;

                    setSeriesCount(responseSeries.count);
                }
            } else if (searchParams.get("page")) {
                const queryParams = {
                    page: searchParams.get("page")!,
                };

                const responseSeries: ISeriesResponse = await serieService.getSeries(queryParams);
                seriesResponse = responseSeries.rows;
                setSeriesCount(responseSeries.count);
            } else {
                const responseSeries: ISeriesResponse = await serieService.getSeries({});
                seriesResponse = responseSeries.rows;
                setSeriesCount(responseSeries.count);
            }
        }

        setSeries(seriesResponse);
    }

    useEffect(() => {
        getSeries();
    }, [searchParams]);

    if (!series) {
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

    if (series && series?.length === 0) {
        return (
            <Box
                sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    height: "100vh",
                }}
            >
                <Typography fontSize={40} color={"secondary"}>
                    There are no series
                </Typography>
            </Box>
        );
    }

    return (
        <>
            <SEOHelmet
                title="Watch the Latest Series | High-Quality and Always Updated"
                description="Discover and watch the latest and most amazing series in high quality. Our collection is always updated with the newest episodes and releases."
                name="MovieLand24"
                type="website"
                canonicalUrl="https://example.com/series"
            />
            <Box
                component={"main"}
                display={"flex"}
                flexDirection={"column"}
                rowGap={4}
                sx={{
                    backgroundColor: `${colors.blueAccent[700]}`,
                }}
            >
                <Box
                    sx={{
                        display: "flex",
                        flexDirection: "row",
                        justifyContent: "flex-end",
                        alignItems: "center",
                        columnGap: 2,
                        mr: 4,
                        mt: 4,
                    }}
                    component={"section"}
                >
                    <Typography color={"secondary"} fontSize={16}>
                        <span>Sort by:</span>
                    </Typography>
                    <Box sx={{ display: "flex", flexDirection: "row", columnGap: 2 }}>
                        <Select
                            defaultValue={"none"}
                            value={
                                searchParams.get("sortBy") && searchParams.get("ascOrDesc")
                                    ? searchParams.get("sortBy")! +
                                      toFirstWordUpperCase(searchParams.get("ascOrDesc")!)
                                    : "none"
                            }
                            onChange={handleChangeSorting}
                        >
                            <MenuItem value={"none"}>None</MenuItem>
                            <MenuItem value={"ratingImdbAsc"}>Imdb rating (Asc)</MenuItem>
                            <MenuItem value={"ratingImdbDesc"}>Imdb rating (Desc)</MenuItem>
                            <MenuItem value={"titleAsc"}>Title (Asc)</MenuItem>
                            <MenuItem value={"titleDesc"}>Title (Desc)</MenuItem>
                        </Select>
                    </Box>
                </Box>
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
                        sx={{
                            display: "flex",
                            placeItems: "center",
                            marginTop: 4,
                            marginBottom: 4,
                        }}
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
        </>
    );
}
