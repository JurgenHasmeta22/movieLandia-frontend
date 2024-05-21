import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import type IGenre from "~/types/IGenre";
import { Box, Card, Stack, Typography } from "@mui/material";
import genreService from "~/services/api/genreService";
import IGenreResponse from "~/types/IGenreResponse";

export default function Genres() {
    const [genres, setGenres] = useState<IGenre[]>([]);
    const navigate = useNavigate();

    async function getGenres(): Promise<void> {
        const response: any = await genreService.getGenres({});
        setGenres(response.rows);
    }

    useEffect(() => {
        getGenres();
    }, []);

    return (
        <Box sx={{ display: "flex", flexDirection: "column", placeItems: "center" }}>
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
                {genres?.map((genre: any) => (
                    <Card
                        key={genre.id}
                        onClick={function () {
                            navigate(`/genres/${genre.name}`);
                            window.scrollTo(0, 0);
                        }}
                        sx={{
                            display: "flex",
                            placeItems: "center",
                            placeContent: "center",
                            cursor: "pointer",
                            height: "200px",
                            width: "200px",
                            backgroundColor: `colors.secondary`
                        }}
                    >
                        <span>{genre.name}</span>
                    </Card>
                ))}
            </Box>
        </Box>
    );
}
