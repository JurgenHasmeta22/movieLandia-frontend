import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import type ISerie from "~/types/ISerie";
import serieService from "~/services/api/serieService";
import { Box, CircularProgress, List, ListItem, Stack, Typography, useTheme } from "@mui/material";
import { tokens } from "~/utils/theme";
import SEOHelmet from "~/components/seoHelmet/SEOHelmet";
import ReviewsIcon from "@mui/icons-material/Reviews";
import { motion } from "framer-motion";
import ISeriesResponse from "~/types/ISeriesResponse";
import SerieItemLatest from "./serieItemLatest/SerieItemLatest";

export default function Serie() {
    const [serie, setSerie] = useState<ISerie | null>(null);
    const [series, setSeries] = useState<ISerie[]>([]);
    const params = useParams();
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);

    async function getSeries(): Promise<void> {
        const response: ISeriesResponse = await serieService.getSeries({});

        if (response) {
            setSeries(response.rows);
        }
    }

    async function getSerie(): Promise<void> {
        const response: ISerie = await serieService.getSerieByTitle(params?.title!, {});

        if (response) {
            setSerie(response);
        }
    }

    useEffect(() => {
        getSerie();
    }, [serie]);

    useEffect(() => {
        getSeries();
    }, []);

    if (!serie) {
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
                title={`Watch ${serie?.title} on SerieLand24`}
                description={`${serie?.title}`}
                name="SerieLand24"
                type="article"
                canonicalUrl={`https://example.com/series/${serie?.title}`}
            />
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 10 }}
                transition={{ duration: 2 }}
            >
                <Box
                    sx={{
                        display: "flex",
                        flexDirection: "column",
                        rowGap: 4,
                        // backgroundColor: `${colors.blueAccent[700]}`,
                    }}
                    component={"main"}
                >
                    <Box
                        sx={{
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            rowGap: 2,
                        }}
                        component={"section"}
                    >
                        <Typography
                            mt={4}
                            mb={2}
                            fontSize={18}
                            color={"secondary"}
                            textAlign={"center"}
                            component={"h1"}
                        >
                            {serie.title}
                        </Typography>
                        {/* <Box>
                            <iframe
                                style={{
                                    width: `${isPageShrunk ? "250px" : "750px"}`,
                                    height: `${isPageShrunk ? "300px" : "450px"}`,
                                    border: "none",
                                    outline: "none",
                                }}
                                src={serie.}
                                title={serie.title}
                                allowFullScreen
                            ></iframe>
                        </Box> */}
                        <Box
                            sx={{
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "center",
                                justifyContent: "center",
                                rowGap: 2,
                                columnGap: 4
                            }}
                        >
                            <List
                                sx={{
                                    display: "flex",
                                    flexDirection: "row",
                                    paddingLeft: 2,
                                }}
                            >
                                <ListItem
                                    sx={{
                                        color: colors.greenAccent[500],
                                    }}
                                >
                                    <Typography component={"span"}>Year: {serie.releaseYear}</Typography>
                                </ListItem>
                                <ListItem
                                    sx={{
                                        color: colors.greenAccent[500],
                                        display: "flex",
                                        flexDirection: "row",
                                        columnGap: 1,
                                    }}
                                >
                                    <ReviewsIcon />
                                    <Typography component={"span"}>Imdb Rating:</Typography>
                                    <Typography component={"span"}>{serie.ratingImdb === 0 ? "N/A" : serie.ratingImdb}</Typography>
                                </ListItem>
                            </List>
                            {/* <Typography textAlign={"center"} color={"secondary"} width={"50%"}>
                                {serie.description}
                            </Typography> */}
                        </Box>
                    </Box>
                    <Box
                        sx={{
                            display: "flex",
                            flexDirection: "column",
                            rowGap: 2,
                            marginBottom: 2,
                            marginTop: 2,
                        }}
                        component={"section"}
                    >
                        <Typography fontSize={22} color={"secondary"} textAlign={"center"}>
                            Latest Series
                        </Typography>
                        <Stack
                            direction="row"
                            flexWrap="wrap"
                            columnGap={3}
                            rowGap={3}
                            justifyContent="center"
                            alignContent="center"
                            mt={1}
                            mb={4}
                        >
                            {series.slice(5, 10).map((latestSerie: any) => (
                                <SerieItemLatest latestSerie={latestSerie} key={latestSerie.id} />
                            ))}
                        </Stack>
                    </Box>
                </Box>
            </motion.div>
        </>
    );
}
