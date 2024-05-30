import React from "react";
import { useParams, useSearchParams } from "react-router-dom";
import type IMovie from "~/types/IMovie";
import {
    Box,
    CircularProgress,
    Container,
    MenuItem,
    Pagination,
    Select,
    Stack,
    SvgIcon,
    Typography,
} from "@mui/material";
import genreService from "~/services/api/genreService";
import SEOHelmet from "~/components/seoHelmet/SEOHelmet";
import { useSorting } from "~/hooks/useSorting";
import { getRandomElements, toFirstWordUpperCase } from "~/utils/utils";
import CardItem from "~/components/cardItem/CardItem";
import { useQuery } from "@tanstack/react-query";
import SwapVertIcon from "@mui/icons-material/SwapVert";
import Carousel from "~/components/carousel/Carousel";
import Error404 from "../error/Error";
import ISerie from "~/types/ISerie";

const valueToLabelMap: Record<any, string> = {
    none: "None",
    ratingImdbAsc: "Imdb rating (Asc)",
    ratingImdbDesc: "Imdb rating (Desc)",
    titleAsc: "Title (Asc)",
    titleDesc: "Title (Desc)",
};

export default function Genre(): React.JSX.Element {
    const [searchParams, setSearchParams] = useSearchParams();
    const handleChangeSorting = useSorting();
    const params = useParams();

    const page = searchParams.get("page") || 1;
    const sortBy = searchParams.get("sortBy");
    const ascOrDesc = searchParams.get("ascOrDesc");

    const fetchMoviesByGenre = async () => {
        const queryParams: any = { page };

        if (page) queryParams.page = page;
        if (sortBy) queryParams.sortBy = sortBy;
        if (ascOrDesc) queryParams.ascOrDesc = ascOrDesc;
        queryParams.type = "movie";

        return genreService.getGenreByName(params?.name!, queryParams);
    };

    const fetchSeriesByGenre = async () => {
        const queryParams: any = { page };

        if (page) queryParams.page = page;
        if (sortBy) queryParams.sortBy = sortBy;
        if (ascOrDesc) queryParams.ascOrDesc = ascOrDesc;
        queryParams.type = "serie";

        return genreService.getGenreByName(params?.name!, queryParams);
    };

    const moviesByGenreQuery = useQuery({
        queryKey: ["moviesByGenre", sortBy, ascOrDesc, page],
        queryFn: () => fetchMoviesByGenre(),
    });
    const moviesByGenre: IMovie[] = moviesByGenreQuery.data?.movies! ?? [];
    const moviesByGenreCount: number = moviesByGenreQuery.data?.count! ?? 0;

    const seriesByGenreQuery = useQuery({
        queryKey: ["seriesByGenre", sortBy, ascOrDesc, page],
        queryFn: () => fetchSeriesByGenre(),
    });
    const seriesByGenre: ISerie[] = seriesByGenreQuery.data?.series! ?? [];
    const seriesByGenreCount: number = seriesByGenreQuery.data?.count! ?? 0;

    const moviesCarouselImages = getRandomElements(
        moviesByGenre,
        moviesByGenre.length > 5 ? 5 : moviesByGenre.length,
    );

    const pageCount = Math.ceil(moviesByGenreCount / 10);
    const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
        searchParams.set("page", String(value));
        setSearchParams(searchParams);
    };

    if (moviesByGenreQuery.isLoading) {
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

    if (moviesByGenreQuery.isError || moviesByGenreQuery.data.error) {
        return <Error404 />;
    }

    if (moviesByGenre?.length === 0) {
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
                    There are no movies with this genre
                </Typography>
            </Box>
        );
    }

    return (
        <>
            <SEOHelmet
                title={`Watch movies of genre ${params?.name} on MovieLand24`}
                description={`Watch all movies related to this genres in high quality and including the latest movies and series to this genre  ${params?.name}`}
                name="MovieLand24"
                type="article"
                canonicalUrl={`https://example.com/genre/${params?.name}`}
            />
            <Container>
                <Box
                    sx={{
                        display: "flex",
                        flexDirection: "column",
                        rowGap: 4,
                        paddingTop: 4,
                    }}
                >
                    <Box mt={4} component={"section"}>
                        <Carousel
                            data={moviesCarouselImages}
                            type="movies"
                            visibleItems={moviesByGenre.length === 5 ? 3 : moviesByGenre.length}
                        />
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
                            <Typography
                                sx={{
                                    fontSize: [16, 18, 20, 24, 26],
                                }}
                                color={"secondary"}
                                variant="h2"
                                textAlign={"center"}
                            >
                                {`Movies of genre ${params.name}`}
                            </Typography>
                        </Box>
                        <Box
                            sx={{
                                display: "flex",
                                justifyContent: "flex-end",
                                alignItems: "center",
                            }}
                        >
                            <Select
                                defaultValue={"none"}
                                value={
                                    searchParams.get("sortBy") && searchParams.get("ascOrDesc")
                                        ? searchParams.get("sortBy")! +
                                          toFirstWordUpperCase(searchParams.get("ascOrDesc")!)
                                        : "none"
                                }
                                onChange={handleChangeSorting}
                                sx={{
                                    px: 2,
                                }}
                                renderValue={(value: string) => {
                                    return (
                                        <Box sx={{ display: "flex", gap: 0.5 }}>
                                            <SvgIcon color="secondary">
                                                <SwapVertIcon />
                                            </SvgIcon>
                                            {valueToLabelMap[value]}
                                        </Box>
                                    );
                                }}
                            >
                                <MenuItem value={"none"}>None</MenuItem>
                                <MenuItem value={"ratingImdbAsc"}>Imdb rating (Asc)</MenuItem>
                                <MenuItem value={"ratingImdbDesc"}>Imdb rating (Desc)</MenuItem>
                                <MenuItem value={"titleAsc"}>Title (Asc)</MenuItem>
                                <MenuItem value={"titleDesc"}>Title (Desc)</MenuItem>
                            </Select>
                        </Box>
                    </Stack>
                    <Stack
                        direction="row"
                        flexWrap="wrap"
                        justifyContent={"start"}
                        alignContent={"center"}
                        rowGap={8}
                        columnGap={4}
                    >
                        {moviesByGenre.map((movie: IMovie, index: number) => (
                            <CardItem data={movie} key={index} type="movie" />
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
                            <Typography
                                sx={{
                                    fontSize: [16, 18, 20, 24, 26],
                                }}
                                color={"secondary"}
                                variant="h2"
                                textAlign={"center"}
                            >
                                {`Series of genre ${params.name}`}
                            </Typography>
                        </Box>
                        <Box
                            sx={{
                                display: "flex",
                                justifyContent: "flex-end",
                                alignItems: "center",
                            }}
                        >
                            <Select
                                defaultValue={"none"}
                                value={
                                    searchParams.get("sortBy") && searchParams.get("ascOrDesc")
                                        ? searchParams.get("sortBy")! +
                                          toFirstWordUpperCase(searchParams.get("ascOrDesc")!)
                                        : "none"
                                }
                                onChange={handleChangeSorting}
                                sx={{
                                    px: 2,
                                }}
                                renderValue={(value: string) => {
                                    return (
                                        <Box sx={{ display: "flex", gap: 0.5 }}>
                                            <SvgIcon color="secondary">
                                                <SwapVertIcon />
                                            </SvgIcon>
                                            {valueToLabelMap[value]}
                                        </Box>
                                    );
                                }}
                            >
                                <MenuItem value={"none"}>None</MenuItem>
                                <MenuItem value={"ratingImdbAsc"}>Imdb rating (Asc)</MenuItem>
                                <MenuItem value={"ratingImdbDesc"}>Imdb rating (Desc)</MenuItem>
                                <MenuItem value={"titleAsc"}>Title (Asc)</MenuItem>
                                <MenuItem value={"titleDesc"}>Title (Desc)</MenuItem>
                            </Select>
                        </Box>
                    </Stack>
                    <Stack
                        direction="row"
                        flexWrap="wrap"
                        justifyContent={"start"}
                        alignContent={"center"}
                        rowGap={8}
                        columnGap={4}
                    >
                        {seriesByGenre.map((serie: ISerie, index: number) => (
                            <CardItem data={serie} key={index} type="serie" />
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
            </Container>
        </>
    );
}
