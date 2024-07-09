import type IGenre from "~/types/IGenre";
import { Box, Container, Typography } from "@mui/material";
import genreService from "~/services/api/genreService";
import GenreItem from "~/components/genreItem/GenreItem";
import { useQuery } from "@tanstack/react-query";
import Loading from "~/components/loading/Loading";

export default function Genres() {
    const genresQuery = useQuery({
        queryKey: ["genres"],
        queryFn: () => genreService.getGenres({}),
    });

    const genres: IGenre[] = genresQuery.data?.rows! ?? [];

    if (genresQuery.isLoading) {
        return <Loading />;
    }

    if (genresQuery.isError) {
        return (
            <Box
                sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    height: "200vh",
                }}
            >
                <Typography variant="h1">An Error occurred the server is down!</Typography>
            </Box>
        );
    }

    return (
        <Container>
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
        </Container>
    );
}
