import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import type ISerie from "~/types/ISerie";
import serieService from "~/services/api/serieService";
import {
    Box,
    Button,
    CircularProgress,
    List,
    ListItem,
    Stack,
    Typography,
    useTheme,
} from "@mui/material";
import { tokens } from "~/utils/theme";
import SEOHelmet from "~/components/seoHelmet/SEOHelmet";
import ReviewsIcon from "@mui/icons-material/Reviews";
import { motion } from "framer-motion";
import ISeriesResponse from "~/types/ISeriesResponse";
import { useResizeWindow } from "~/hooks/useResizeWindow";
import { toast } from "react-toastify";
import { useStore } from "~/store/store";
import CardItem from "~/components/cardItem/CardItem";

export default function Serie() {
    const [serie, setSerie] = useState<ISerie | null>(null);
    const [series, setSeries] = useState<ISerie[]>([]);
    const params = useParams();
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const isPageShrunk = useResizeWindow();
    const { user, setUser } = useStore();
    const navigate = useNavigate();

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

    async function bookmarkSerie() {
        if (!user || !serie) return;

        try {
            const response = await serieService.addToFavorites(serie.id, user.id);

            if (response && !response.error) {
                setUser(response);
                toast.success("Serie bookmarked successfully!");
                navigate("/profile?tab=favSeries");
                window.scrollTo(0, 0);
            } else {
                toast.error("Serie not bookmarked successfully!");
            }
        } catch (error) {
            console.error("An error occurred while adding the serie to favorites:", error);
            toast.error("An error occurred while adding the serie to favorites.");
        }
    }

    useEffect(() => {
        getSerie();
    }, [params.title]);

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
                animate={{ opacity: 1 }}
                transition={{ duration: 0.35, ease: "easeInOut" }}
            >
                <Box
                    sx={{
                        display: "flex",
                        flexDirection: "column",
                        rowGap: 4,
                        paddingTop: 4,
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
                        <Box>
                            <iframe
                                style={{
                                    width: `${isPageShrunk ? "250px" : "750px"}`,
                                    height: `${isPageShrunk ? "300px" : "450px"}`,
                                    border: "none",
                                    outline: "none",
                                }}
                                src={serie.trailerSrc}
                                title={serie.title}
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                            ></iframe>
                        </Box>
                        <Box
                            sx={{
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "center",
                                justifyContent: "center",
                                rowGap: 2,
                                columnGap: 4,
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
                                    <Typography component={"span"}>
                                        Year: {serie.releaseYear}
                                    </Typography>
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
                                    <Typography component={"span"}>
                                        {serie.ratingImdb === 0 ? "N/A" : serie.ratingImdb}
                                    </Typography>
                                </ListItem>
                            </List>
                            <Typography textAlign={"center"} color={"secondary"} width={"50%"}>
                                {serie.description}
                            </Typography>
                            {user?.userName && (
                                <Button
                                    onClick={() => {
                                        bookmarkSerie();
                                    }}
                                    color="secondary"
                                    variant="outlined"
                                >
                                    Add to favorites
                                </Button>
                            )}
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
                                <CardItem data={latestSerie} key={latestSerie.id} type={"serie"} />
                            ))}
                        </Stack>
                    </Box>
                </Box>
            </motion.div>
        </>
    );
}
