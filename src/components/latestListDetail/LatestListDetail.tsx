import { Box, Stack, Typography } from "@mui/material";
import CardItem from "../cardItem/CardItem";

interface ILatestList {
    data: any;
    type: string;
}

export function LatestListDetail({ data, type }: ILatestList) {
    return (
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
            <Typography fontSize={28} color={"secondary"} textAlign={"center"}>
                Latest {type}
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
                {data.slice(5, 10).map((latestSerie: any, index: number) => (
                    <CardItem data={latestSerie} key={index} type={"serie"} />
                ))}
            </Stack>
        </Box>
    );
}

export default LatestListDetail;
