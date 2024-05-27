import { useNavigate, useParams } from "react-router-dom";
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
import { toast } from "react-toastify";
import { useStore } from "~/store/store";
import CardItem from "~/components/cardItem/CardItem";
import YouTubeIcon from "@mui/icons-material/YouTube";
import BookmarkIcon from "@mui/icons-material/Bookmark";
import { useQuery } from "@tanstack/react-query";

export default function Serie() {
    const params = useParams();
    const theme = useTheme();
    const navigate = useNavigate();
    const colors = tokens(theme.palette.mode);
    const { user, setUser } = useStore();

    const serieQuery = useQuery({
        queryKey: ["serie", params.title],
        queryFn: () => serieService.getSerieByTitle(params?.title!, {}),
    });
    const seriesQuery = useQuery({
        queryKey: ["series"],
        queryFn: () => serieService.getSeries({}),
    });
    const serie: ISerie = serieQuery?.data! ?? null;
    const series: ISerie[] = seriesQuery?.data?.rows ?? [];

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

    if (serieQuery.isLoading || seriesQuery.isLoading) {
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

    if (serieQuery.isError === true || seriesQuery.isError === true) {
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
                title={`Watch ${serie?.title} on SerieLand24`}
                description={`${serie?.title}`}
                name="SerieLand24"
                type="article"
                canonicalUrl={`https://example.com/series/${serie?.title}`}
            />
            <Box
                sx={{
                    display: "flex",
                    flexDirection: "column",
                }}
                component={"main"}
            >
                <Box
                    sx={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                        height: "auto",
                        width: "100%",
                        pt: 8,
                        pb: 4,
                    }}
                    component={"section"}
                >
                    <Box
                        sx={{
                            display: "flex",
                            flexDirection: "row",
                            flexWrap: "wrap",
                            alignItems: "center",
                            justifyContent: "center",
                            height: "100%",
                            width: "90%",
                            columnGap: 6,
                            padding: 6,
                            backgroundColor: `${colors.primary[400]}`,
                        }}
                    >
                        <Box>
                            <img
                                src={serie.photoSrc}
                                alt={serie.title}
                                style={{ width: 220, height: "auto" }}
                            />
                        </Box>
                        <Box
                            sx={{
                                display: "flex",
                                flexDirection: "column",
                            }}
                        >
                            <Typography
                                fontSize={36}
                                color={"secondary"}
                                textAlign={"center"}
                                component={"h1"}
                            >
                                {serie.title}
                            </Typography>
                            <List
                                sx={{
                                    display: "flex",
                                    flexDirection: "row",
                                    placeSelf: "center",
                                }}
                            >
                                <ListItem
                                    sx={{
                                        color: colors.greenAccent[500],
                                    }}
                                >
                                    <Typography component={"span"} width={"20ch"}>
                                        Release Year: {serie.releaseYear}
                                    </Typography>
                                </ListItem>
                                <ListItem
                                    sx={{
                                        color: colors.greenAccent[500],
                                        display: "flex",
                                        flexDirection: "row",
                                        columnGap: 0.5,
                                    }}
                                >
                                    <Box
                                        display="flex"
                                        flexDirection="row"
                                        columnGap={0.5}
                                        alignItems={"center"}
                                        justifyContent={"start"}
                                    >
                                        <img
                                            src="/assets/icons/imdb.svg"
                                            alt="IMDb Icon"
                                            style={{ width: "35px", height: "35px" }}
                                        />
                                        <Typography
                                            color={"secondary"}
                                            fontSize={12}
                                            component="span"
                                        >
                                            {serie.ratingImdb !== 0 ? `${serie.ratingImdb}` : "N/A"}
                                        </Typography>
                                    </Box>
                                </ListItem>
                            </List>
                            <Typography
                                textAlign={"center"}
                                color={"secondary"}
                                width={["50ch", "60ch", "70ch", "80ch"]}
                            >
                                {serie.description}
                            </Typography>
                            <Button
                                href={serie.trailerSrc}
                                target="_blank"
                                rel="noopener noreferrer"
                                color="secondary"
                                variant="contained"
                                sx={{
                                    display: "flex",
                                    flexDirection: "row",
                                    columnGap: 1,
                                    width: "30%",
                                    placeSelf: "center",
                                    marginTop: 1,
                                }}
                            >
                                <YouTubeIcon color="error" />
                                <Typography
                                    component={"span"}
                                    color={colors.primary[600]}
                                    fontWeight={700}
                                    sx={{
                                        textTransform: "capitalize",
                                    }}
                                >
                                    Watch Trailer
                                </Typography>
                            </Button>
                            {user?.userName && (
                                <Button
                                    onClick={() => {
                                        bookmarkSerie();
                                    }}
                                    color="secondary"
                                    variant="contained"
                                    sx={{
                                        width: "30%",
                                        display: "flex",
                                        placeSelf: "center",
                                        marginTop: 1,
                                        columnGap: 1,
                                    }}
                                >
                                    <BookmarkIcon color={"error"}></BookmarkIcon>
                                    <Typography
                                        component={"span"}
                                        sx={{
                                            textTransform: "capitalize",
                                        }}
                                        color={"primary"}
                                        fontWeight={700}
                                    >
                                        Bookmark
                                    </Typography>
                                </Button>
                            )}
                        </Box>
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
        </>
    );
}
