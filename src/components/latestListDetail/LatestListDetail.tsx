import { Box, Divider, Stack, Typography } from "@mui/material";
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
                justifyContent: "flex-start",
                rowGap: 2,
                marginBottom: 2,
                marginTop: 2,
            }}
            component={"section"}
        >
            <Typography
                fontSize={28}
                color={"secondary"}
                ml={4}
                // sx={{
                //     borderBottom: "2px solid #fff",
                //     width: "20%",
                // }}
            >
                Latest {type === "movie" ? "Movies" : "Series"}
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
                {data.slice(5, 10).map((item: any, index: number) => (
                    <CardItem data={item} key={index} type={type} />
                ))}
            </Stack>
        </Box>
    );
}

export default LatestListDetail;
