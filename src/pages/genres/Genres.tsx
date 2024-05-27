import type IGenre from "~/types/IGenre";
import { Box, CircularProgress, Typography } from "@mui/material";
import genreService from "~/services/api/genreService";
import GenreItem from "~/components/genreItem/GenreItem";
import { useQuery } from "@tanstack/react-query";

export default function Genres() {
    const genresQuery = useQuery({
        queryKey: ["genres"],
        queryFn: () => genreService.getGenres({}),
    });
    const genres: IGenre[] = genresQuery.data?.rows! ?? [];

    if (genresQuery.isLoading) {
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

    if (genresQuery.isError) {
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
        <main>
            <Box
                sx={{
                    display: "flex",
                    flexDirection: "column",
                    placeItems: "center",
                    paddingTop: 4,
                }}
                component={"section"}
            >
                <Typography mt={4} fontSize={"30px"}>
                    Choose your favorite genre
                </Typography>
                <Box
                    sx={{
                        display: "grid",
                        gridTemplateColumns: "1fr 1fr 1fr 1fr",
                        rowGap: 6,
                        columnGap: 4,
                    }}
                    mb={6}
                    mt={4}
                >
                    {genres?.map((genre: any) => <GenreItem genre={genre} />)}
                </Box>
            </Box>
        </main>
    );
}
