import type ISerie from "~/types/ISerie";
import { Box, Container, Divider, Stack, Typography, useTheme } from "@mui/material";
import SEOHelmet from "~/components/seoHelmet/SEOHelmet";
import { getRandomElements } from "~/utils/utils";
import Carousel from "~/components/carousel/Carousel";
import CardItem from "~/components/cardItem/CardItem";
import { useQuery } from "@tanstack/react-query";
import SortSelect from "~/components/sortSelect/SortSelect";
import { useListPageData } from "~/hooks/useListPageData";
import PaginationControl from "~/components/paginationControl/PaginationControl";
import serieService from "~/services/api/serieService";
import LatestList from "~/components/latestList/LatestList";
import { tokens } from "~/utils/theme";
import Loading from "~/components/loading/Loading";

export default function Series() {
    const { searchParams, setSearchParams, handleChangeSorting, page } = useListPageData();
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const sortBy = searchParams.get("seriesSortBy");
    const ascOrDesc = searchParams.get("seriesAscOrDesc");

    const fetchSeries = async () => {
        const queryParams: Record<string, string | number> = { page };

        if (sortBy) {
            queryParams.sortBy = sortBy;
        }

        if (ascOrDesc) {
            queryParams.ascOrDesc = ascOrDesc;
        }

        const response = await serieService.getSeries(queryParams);
        return response;
    };

    const seriesQuery = useQuery({
        queryKey: ["series", sortBy, ascOrDesc, page],
        queryFn: () => fetchSeries(),
    });
    const series: ISerie[] = seriesQuery.data?.rows! ?? [];
    const seriesCount: number = seriesQuery.data?.count! ?? 0;
    const seriesCarouselImages = getRandomElements(series, 5);

    const latestSeriesQuery = useQuery({
        queryKey: ["latestSeries"],
        queryFn: () => serieService.getLatestSeries(),
    });
    const latestSeries: ISerie[] = latestSeriesQuery.data! ?? [];

    const pageCount = Math.ceil(seriesCount / 10);
    const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
        searchParams.set("page", String(value));
        setSearchParams(searchParams);
    };

    if (seriesQuery.isLoading) {
        return <Loading />;
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

    return (
        <>
            <SEOHelmet
                title="Watch the Latest Series | High-Quality and Always Updated"
                description="Discover and watch the latest and most amazing series in high quality. Our collection is always updated with the newest episodes and releases."
                name="MovieLand24"
                type="website"
                canonicalUrl="https://example.com/series"
            />
            <Container>
                <Box component={"section"} display={"flex"} flexDirection={"column"} rowGap={4} paddingTop={4}>
                    <Box mt={4} component={"section"}>
                        <Carousel data={seriesCarouselImages} type="series" />
                    </Box>
                    <Stack
                        display="flex"
                        flexDirection="row"
                        alignItems="center"
                        justifyContent={"space-between"}
                        component="section"
                        mt={4}
                    >
                        <Box ml={1}>
                            <Typography fontSize={28} variant="h2">
                                Series
                            </Typography>
                            <Divider sx={{ borderBottomWidth: 3, background: colors.primary[100], mt: 1 }} />
                        </Box>
                        <Box
                            sx={{
                                mr: 1,
                            }}
                        >
                            <SortSelect
                                sortBy={sortBy!}
                                ascOrDesc={ascOrDesc!}
                                onChange={(event) => handleChangeSorting("series", event)}
                                type="list"
                            />
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
                            {series.map((serie: ISerie) => (
                                <CardItem data={serie} type="serie" key={serie.id} />
                            ))}
                        </Stack>
                        <PaginationControl
                            currentPage={Number(page)!}
                            pageCount={pageCount}
                            onPageChange={handlePageChange}
                        />
                    </Box>
                    <Divider sx={{ borderBottomWidth: 3, background: colors.primary[100] }} />
                    <LatestList data={latestSeries} type="Series" />
                </Box>
            </Container>
        </>
    );
}
