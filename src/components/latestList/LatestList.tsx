import { Box, Stack, Typography } from "@mui/material";
import IMovie from "~/types/IMovie";
import CardItem from "../cardItem/CardItem";

interface ILatestList {
    data: any;
    type: string;
}

export function LatestList({ data, type }: ILatestList) {
    return (
        <Box
            component={"section"}
            sx={{
                display: "flex",
                flexDirection: "column",
                rowGap: 2,
                marginBottom: 4,
            }}
        >
            <Box sx={{ display: "flex", placeContent: "flex-start" }}>
                <Typography fontSize={28} color={"secondary"} variant="h2">
                    Latest {type}
                </Typography>
            </Box>
            <Stack
                direction="row"
                flexWrap="wrap"
                rowGap={8}
                columnGap={4}
                justifyContent={"center"}
                alignContent={"center"}
                marginTop={3}
                mb={4}
            >
                {data
                    ?.slice(0, 5)
                    .map((item: any) => (
                        <CardItem data={item} key={item.id} type={`${type === "Movies" ? "movie" : "serie"}`} />
                    ))}
            </Stack>
        </Box>
    );
}

export default LatestList;
