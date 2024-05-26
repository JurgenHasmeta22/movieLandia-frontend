import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import type ISerie from "~/types/ISerie";
import type ISeriesResponse from "~/types/ISeriesResponse";
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
import { getRandomElements, toFirstWordUpperCase } from "~/utils/utils";
import { motion } from "framer-motion";
import Carousel from "~/components/carousel/Carousel";
import CardItem from "~/components/cardItem/CardItem";

export default function Series() {
    const [series, setSeries] = useState<ISerie[] | undefined>(undefined);
    const [seriesCount, setSeriesCount] = useState<number>(0);
    const [seriesCountSearch, setSeriesCountSearch] = useState<number>(0);
    const [seriesCarouselImages, setSeriesCarouselImages] = useState<any[]>([]);

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

        const randomSeries = getRandomElements(seriesResponse, 5);
        setSeries(seriesResponse);
        setSeriesCarouselImages(randomSeries);
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

    return (
        <>
            <SEOHelmet
                title="Watch the Latest Series | High-Quality and Always Updated"
                description="Discover and watch the latest and most amazing series in high quality. Our collection is always updated with the newest episodes and releases."
                name="MovieLand24"
                type="website"
                canonicalUrl="https://example.com/series"
            />
            <main>
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <Box
                        component={"section"}
                        display={"flex"}
                        flexDirection={"column"}
                        rowGap={4}
                        paddingTop={4}
                    >
                        <Box mt={4} component={"section"}>
                            <Carousel data={seriesCarouselImages} type="series" />
                        </Box>
                        <Stack
                            display="flex"
                            flexDirection="row"
                            alignItems="center"
                            component="section"
                            mt={4}
                        >
                            <Box
                                display="flex"
                                justifyContent="center"
                                alignItems="center"
                                sx={{ flexGrow: 1 }}
                                pl={18}
                            >
                                <Typography fontSize={22} color={"secondary"} variant="h2">
                                    All Series
                                </Typography>
                            </Box>
                            <Box
                                sx={{
                                    display: "flex",
                                    flexDirection: "row",
                                    justifyContent: "flex-end",
                                    alignItems: "center",
                                    columnGap: 1,
                                    mr: 4,
                                }}
                            >
                                <Typography color={"secondary"} fontSize={16}>
                                    <Typography component={"span"}>Sort by:</Typography>
                                </Typography>
                                <Box sx={{ display: "flex", flexDirection: "row", columnGap: 2 }}>
                                    <Select
                                        defaultValue={"none"}
                                        value={
                                            searchParams.get("sortBy") &&
                                            searchParams.get("ascOrDesc")
                                                ? searchParams.get("sortBy")! +
                                                  toFirstWordUpperCase(
                                                      searchParams.get("ascOrDesc")!,
                                                  )
                                                : "none"
                                        }
                                        onChange={handleChangeSorting}
                                    >
                                        <MenuItem value={"none"}>None</MenuItem>
                                        <MenuItem value={"ratingImdbAsc"}>
                                            Imdb rating (Asc)
                                        </MenuItem>
                                        <MenuItem value={"ratingImdbDesc"}>
                                            Imdb rating (Desc)
                                        </MenuItem>
                                        <MenuItem value={"titleAsc"}>Title (Asc)</MenuItem>
                                        <MenuItem value={"titleDesc"}>Title (Desc)</MenuItem>
                                    </Select>
                                </Box>
                            </Box>
                        </Stack>
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
                                rowGap={8}
                                columnGap={4}
                            >
                                {series.map((serie: any) => (
                                    <CardItem data={serie} type="serie" key={serie.id} />
                                ))}
                            </Stack>
                            <Stack
                                spacing={2}
                                sx={{
                                    display: "flex",
                                    placeItems: "center",
                                    marginTop: 2,
                                    marginBottom: 4,
                                }}
                            >
                                <Pagination
                                    page={
                                        searchParams.get("page")
                                            ? Number(searchParams.get("page"))
                                            : 1
                                    }
                                    size="large"
                                    count={pageCount}
                                    showFirstButton
                                    showLastButton
                                    onChange={handlePageChange}
                                />
                            </Stack>
                        </Box>
                    </Box>
                </motion.div>
            </main>
        </>
    );
}
