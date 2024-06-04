import AccessTimeIcon from "@mui/icons-material/AccessTime";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import MovieIcon from "@mui/icons-material/Movie";
import BookmarkRemoveIcon from "@mui/icons-material/BookmarkRemove";
import YouTubeIcon from "@mui/icons-material/YouTube";
import BookmarkAddIcon from "@mui/icons-material/BookmarkAdd";
import StarRateIcon from "@mui/icons-material/StarRate";
import { Box, Button, Divider, List, ListItem, Typography, colors, useTheme } from "@mui/material";
import { Link } from "react-router-dom";
import { tokens } from "~/utils/theme";
import IMovie from "~/types/IMovie";
import ISerie from "~/types/ISerie";
import { useStore } from "~/store/store";

interface IDetailsPageCardProps {
    data: IMovie | ISerie;
    type: string;
    isMovieBookmarked?: boolean;
    isSerieBookmarked?: boolean;
    onBookmarkMovie?(): Promise<void>;
    onRemoveBookmarkMovie?(): Promise<void>;
    onBookmarkSerie?(): Promise<void>;
    onRemoveBookmarkSerie?(): Promise<void>;
}

export function DetailsPageCard({
    data,
    type,
    onBookmarkMovie,
    onBookmarkSerie,
    onRemoveBookmarkMovie,
    onRemoveBookmarkSerie,
    isMovieBookmarked,
    isSerieBookmarked,
}: IDetailsPageCardProps) {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const { user } = useStore();

    return (
        <>
            <Box
                sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
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
                    <img
                        src={data.photoSrc}
                        alt={data.title}
                        style={{ width: 220, height: "auto" }}
                    />
                    <Box
                        sx={{
                            display: "flex",
                            flexDirection: "column",
                        }}
                    >
                        <Typography
                            fontSize={24}
                            color={"secondary"}
                            textAlign={"center"}
                            component={"h1"}
                        >
                            {data.title}
                        </Typography>
                        <List
                            sx={{
                                display: "flex",
                                flexDirection: "row",
                                placeSelf: "center",
                                placeItems: "center",
                            }}
                        >
                            <MovieIcon fontSize="large" color="secondary" />
                            {data.genres?.map((genre: any, index: number) => (
                                <>
                                    <ListItem
                                        sx={{
                                            color: colors.greenAccent[500],
                                        }}
                                        key={index}
                                    >
                                        <Link
                                            to={`/genres/${genre.genre.name}`}
                                            style={{
                                                textDecoration: "none",
                                                color: colors.primary[200],
                                                fontSize: 15,
                                            }}
                                        >
                                            <Typography component={"span"}>
                                                {genre.genre.name}
                                            </Typography>
                                        </Link>
                                    </ListItem>
                                    {index < data.genres!.length - 1 && (
                                        <Divider orientation="vertical" flexItem color="error" />
                                    )}
                                </>
                            ))}
                        </List>
                        <List
                            sx={{
                                display: "flex",
                                flexDirection: "row",
                                placeSelf: "center",
                            }}
                        >
                            {type === "movie" && (
                                <ListItem
                                    sx={{
                                        color: colors.greenAccent[500],
                                    }}
                                >
                                    <AccessTimeIcon fontSize="large" />
                                    <Typography component={"span"} width={"8ch"} paddingLeft={1}>
                                        {/* @ts-ignore */}
                                        {data.duration}
                                    </Typography>
                                </ListItem>
                            )}
                            <ListItem
                                sx={{
                                    color: colors.greenAccent[500],
                                }}
                            >
                                <CalendarMonthIcon fontSize="large" />
                                <Typography component={"span"} paddingLeft={1}>
                                    {data.releaseYear}
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
                                    <Typography color={"secondary"} fontSize={12} component="span">
                                        {data.ratingImdb !== 0 ? `${data.ratingImdb}` : "N/A"}
                                    </Typography>
                                </Box>
                            </ListItem>
                            <ListItem
                                sx={{
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
                                    <StarRateIcon
                                        sx={{
                                            color: "primary",
                                        }}
                                    />
                                    <Typography
                                        color={"secondary"}
                                        fontSize={16}
                                        component="span"
                                        sx={{
                                            color: "primary",
                                        }}
                                    >
                                        {data.averageRating === 0 ? "N/A" : data.averageRating}
                                    </Typography>
                                    <Typography
                                        color={"secondary"}
                                        fontSize={16}
                                        component="span"
                                        sx={{
                                            color: "primary",
                                        }}
                                    >
                                        ({data.totalReviews})
                                    </Typography>
                                </Box>
                            </ListItem>
                        </List>
                        <Typography
                            textAlign={"center"}
                            color={"secondary"}
                            width={["40ch", "60ch", "70ch", "80ch"]}
                        >
                            {data.description}
                        </Typography>
                        <Button
                            href={data.trailerSrc}
                            target="_blank"
                            rel="noopener noreferrer"
                            color="secondary"
                            variant="contained"
                            sx={{
                                display: "flex",
                                flexDirection: "row",
                                placeSelf: "center",
                                width: "30%",
                                columnGap: 1,
                                marginTop: 3,
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
                                onClick={async () => {
                                    if (type === "movie") {
                                        if (!isMovieBookmarked) {
                                            onBookmarkMovie ? await onBookmarkMovie() : {};
                                        } else {
                                            onRemoveBookmarkMovie
                                                ? await onRemoveBookmarkMovie()
                                                : {};
                                        }
                                    } else {
                                        if (!isSerieBookmarked) {
                                            onBookmarkSerie ? await onBookmarkSerie() : {};
                                        } else {
                                            onRemoveBookmarkSerie
                                                ? await onRemoveBookmarkSerie()
                                                : {};
                                        }
                                    }
                                }}
                                color="secondary"
                                variant="contained"
                                sx={{
                                    display: "flex",
                                    placeSelf: "center",
                                    width: "30%",
                                    columnGap: 1,
                                    marginTop: 1,
                                }}
                            >
                                {(type === "movie" && !isMovieBookmarked) ||
                                (type === "serie" && !isSerieBookmarked) ? (
                                    <BookmarkAddIcon color="success" />
                                ) : (
                                    <BookmarkRemoveIcon color="error" />
                                )}
                                <Typography
                                    component="span"
                                    sx={{
                                        textTransform: "capitalize",
                                    }}
                                    color="primary"
                                    fontWeight={700}
                                >
                                    {isMovieBookmarked || isSerieBookmarked
                                        ? "Bookmarked"
                                        : "Bookmark"}
                                </Typography>
                            </Button>
                        )}
                    </Box>
                </Box>
            </Box>
        </>
    );
}

export default DetailsPageCard;
