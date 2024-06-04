import type ISerie from "~/types/ISerie";
import { Box, CircularProgress, Container, Pagination, Stack, Typography } from "@mui/material";
import SEOHelmet from "~/components/seoHelmet/SEOHelmet";
import { getRandomElements } from "~/utils/utils";
import Carousel from "~/components/carousel/Carousel";
import CardItem from "~/components/cardItem/CardItem";
import { useQuery } from "@tanstack/react-query";
import SortSelect from "~/components/sortSelect/SortSelect";
import { useListPageData } from "~/hooks/useListPageData";
import { useListPageFetching } from "~/hooks/useListPageFetching";

export default function Series() {
    const { searchParams, setSearchParams, handleChangeSorting, page, search, sortBy, ascOrDesc } =
        useListPageData();

    const { fetchListData } = useListPageFetching({
        search,
        type: "series",
        page,
        sortBy,
        ascOrDesc,
    });

    const seriesQuery = useQuery({
        queryKey: ["series", search, sortBy, ascOrDesc, page],
        queryFn: () => fetchListData(),
    });

    const series: ISerie[] = seriesQuery.data?.rows! ?? [];
    const seriesCount: number = seriesQuery.data?.count! ?? 0;
    const seriesCarouselImages = getRandomElements(series, 5);

    const pageCount = Math.ceil(seriesCount / 10);
    const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
        searchParams.set("page", String(value));
        setSearchParams(searchParams);
    };

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
                        justifyContent={"space-between"}
                        component="section"
                        mt={4}
                    >
                        <Box ml={1}>
                            <Typography fontSize={28} color={"secondary"} variant="h2">
                                Series
                            </Typography>
                        </Box>
                        <Box
                            sx={{
                                mr: 1,
                            }}
                        >
                            <SortSelect
                                sortBy={searchParams.get("sortBy")}
                                ascOrDesc={searchParams.get("ascOrDesc")}
                                onChange={handleChangeSorting}
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
            </Container>
        </>
    );
}
