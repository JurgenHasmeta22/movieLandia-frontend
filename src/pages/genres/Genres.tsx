import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import movieService from "~/services/api/movieService";
import type IGenre from "~/types/IGenre";
import { Box, Card, Stack, Typography } from "@mui/material";

export default function Genres() {
    const [genres, setGenres] = useState<IGenre[]>([]);
    const navigate = useNavigate();

    async function getGenres(): Promise<void> {
        const response: IGenre[] = await movieService.getGenresWithNoPagination();
        setGenres(response);
    }

    useEffect(() => {
        getGenres();
    }, []);

    return (
        <Box sx={{ display: "flex", flexDirection: "column", placeItems: "center" }}>
            <Typography mt={2} fontSize={"30px"}>
                Choose your favorite genre
            </Typography>
            <Stack
                direction={"row"}
                flexWrap={"wrap"}
                rowGap={8}
                columnGap={4}
                justifyContent={"center"}
                alignContent={"center"}
                mb={4}
                mt={2}
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
                        }}
                    >
                        <Typography>{genre.name}</Typography>
                    </Card>
                ))}
            </Stack>
        </Box>
    );
}
