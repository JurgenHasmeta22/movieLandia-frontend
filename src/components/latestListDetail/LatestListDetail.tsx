import { Box, Divider, Stack, Typography, useMediaQuery } from "@mui/material";
import CardItem from "../cardItem/CardItem";
import Slider from "react-slick";

interface ILatestList {
    data: any;
    type: string;
}

export function LatestListDetail({ data, type }: ILatestList) {
    const isMobile = useMediaQuery("(max-width:600px)");
    const isTablet = useMediaQuery("(max-width:960px)");

    const settings = {
        dots: false,
        infinite: true,
        speed: 500,
        slidesToScroll: 1,
        slidesToShow: isMobile ? 2 : isTablet ? 3 : 5,
        autoplay: true,
        autoplaySpeed: 2000,
    };

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
                {/* <Slider {...settings}> */}
                    {data.slice(0, 5).map((item: any, index: number) => (
                        <CardItem data={item} key={index} type={type} />
                    ))}
                {/* </Slider> */}
            </Stack>
        </Box>
    );
}

export default LatestListDetail;
