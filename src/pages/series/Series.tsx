import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import type ISerie from "~/types/ISerie";
import {
    Box,
    CircularProgress,
    MenuItem,
    Pagination,
    Select,
    Stack,
    Typography,
} from "@mui/material";
import serieService from "~/services/api/serieService";
import SEOHelmet from "~/components/seoHelmet/SEOHelmet";
import { useSorting } from "~/hooks/useSorting";
import { getRandomElements, toFirstWordUpperCase } from "~/utils/utils";
import Carousel from "~/components/carousel/Carousel";
import CardItem from "~/components/cardItem/CardItem";
import { useInView } from "react-intersection-observer";
import { motion, useAnimation } from "framer-motion";
import { useQuery } from "@tanstack/react-query";

const sectionVariants = {
    hidden: { opacity: 0, y: 100 },
    visible: { opacity: 1, y: 0 },
};

export default function Series() {
    const [searchParams, setSearchParams] = useSearchParams();
    const handleChangeSorting = useSorting();

    // #region "Data fetching and handling data
    const page = searchParams.get("page") || 1;
    const search = searchParams.get("search");
    const sortBy = searchParams.get("sortBy");
    const ascOrDesc = searchParams.get("ascOrDesc");

    const fetchSeries = async () => {
        let response;
        const queryParams: Record<string, string | number> = { page };

        if (search) {
            response = await serieService.searchSeriesByTitle(search, String(page));
        } else {
            if (sortBy) queryParams.sortBy = sortBy;
            if (ascOrDesc) queryParams.ascOrDesc = ascOrDesc;
            response = await serieService.getSeries(queryParams);
        }

        return response;
    };

    const seriesQuery = useQuery({
        queryKey: ["series", search, sortBy, ascOrDesc, page],
        queryFn: () => fetchSeries(),
    });
    const series: ISerie[] = seriesQuery.data?.rows! ?? [];
    const seriesCount: number = seriesQuery.data?.count! ?? 0;
    const seriesCarouselImages = getRandomElements(series, 5);
    // #endregion

    // #region "Pagination logic"
    const pageCount = Math.ceil(seriesCount / 10);
    const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
        searchParams.set("page", String(value));
        setSearchParams(searchParams);
    };
    // #endregion

    // #region "Framer Motion animations for page"
    const [seriesRef, seriesInView] = useInView({ triggerOnce: false });
    const seriesControls = useAnimation();

    useEffect(() => {
        if (seriesInView) {
            seriesControls.start("visible");
        }
    }, [seriesInView, seriesControls]);
    // #endregion

    // #region "Data state spinners, errrors check"
    if (seriesQuery.isLoading) {
        return (
            <Box
                sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    height: "100vh",
                }}
            >
                <CircularProgress size={80} thickness={4} color="secondary" />
            </Box>
        );
    }

    if (seriesQuery.isError) {
        return (
            <Box
                sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    height: "100vh",
                }}
            >
                <Typography variant="h1">An Error occurred the server is down!</Typography>
            </Box>
        );
    }
    // #endregion

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
                        <motion.div
                            ref={seriesRef}
                            animate={seriesControls}
                            variants={sectionVariants}
                            transition={{ duration: 0.5 }}
                            initial="hidden"
                            style={{ position: "relative" }}
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
                        </motion.div>
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
                                    searchParams.get("page") ? Number(searchParams.get("page")) : 1
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
            </main>
        </>
    );
}
