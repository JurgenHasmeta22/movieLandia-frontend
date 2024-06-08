import { Box, Divider, Stack, Typography, useMediaQuery, useTheme } from "@mui/material";
import CardItem from "../cardItem/CardItem";
import Slider from "react-slick";
import { tokens } from "~/utils/theme";

interface IListDetail {
    data: any;
    type: string;
    role: string;
}

export function ListDetail({ data, type, role }: IListDetail) {
    const isMobile = useMediaQuery("(max-width:600px)");
    const isTablet = useMediaQuery("(max-width:960px)");
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    
    // const settings = {
    //     dots: false,
    //     infinite: true,
    //     speed: 500,
    //     slidesToScroll: 1,
    //     slidesToShow: isMobile ? 2 : isTablet ? 3 : 5,
    //     autoplay: true,
    //     autoplaySpeed: 2000,
    // };

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
            {data && data.length > 0 && (
                <>
                    <Divider sx={{ borderBottomWidth: 3, background: colors.greenAccent[500] }} />
                    <Typography fontSize={28} color={"secondary"}>
                        {role === "latest" ? "Latest" : "Related"} {type === "movie" ? "Movies" : "Series"}
                    </Typography>
                    <Stack
                        direction="row"
                        flexWrap="wrap"
                        columnGap={3}
                        rowGap={3}
                        justifyContent="flex-start"
                        alignContent="center"
                        mt={1}
                        mb={4}
                    >
                        {/* <Slider {...settings}> */}
                        {data &&
                            data.length > 0 &&
                            !data.error &&
                            data
                                .slice(0, 5)
                                .map((item: any, index: number) => <CardItem data={item} key={index} type={type} />)}
                        {/* </Slider> */}
                    </Stack>
                </>
            )}
        </Box>
    );
}

export default ListDetail;
