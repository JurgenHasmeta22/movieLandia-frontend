import { Box, Stack, Typography } from "@mui/material";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import GenreItem from "~/components/genreItem/GenreItem";
import CardItem from "~/components/cardItem/CardItem";
import IGenre from "~/types/IGenre";
import IMovie from "~/types/IMovie";
import ISerie from "~/types/ISerie";

interface ListHomeSectionProps {
    data: IGenre[] | IMovie[] | ISerie[];
    dataRef: any;
    dataControls: any;
    dataVariants: any;
    type: "genre" | "movie" | "serie";
    link: string;
    linkText: string;
}

const ListHomeSection: React.FC<ListHomeSectionProps> = ({
    data,
    dataRef,
    dataControls,
    dataVariants,
    type,
    link,
    linkText,
}) => {
    return (
        <motion.div
            ref={dataRef}
            animate={dataControls}
            variants={dataVariants}
            transition={{ duration: 0.5 }}
            initial="hidden"
            style={{ position: "relative" }}
        >
            <Box display={"flex"} flexDirection={"column"} rowGap={3} component={"section"}>
                <Stack flexDirection={"row"} justifyContent={"space-between"} alignItems={"center"} mr={1} ml={1}>
                    <Typography
                        sx={{
                            fontWeight: 700,
                            fontSize: 22,
                        }}
                    >
                        {type === "genre"
                            ? "Trending Genres"
                            : type === "movie"
                              ? "Trending Movies"
                              : type === "serie"
                                ? "Trending Series"
                                : ""}
                    </Typography>
                    <Link
                        to={link}
                        style={{
                            textDecoration: "none",
                            fontWeight: 700,
                            fontSize: 22,
                        }}
                        onClick={() => {
                            window.scrollTo(0, 0);
                        }}
                    >
                        {linkText}
                    </Link>
                </Stack>
                <Stack
                    direction="row"
                    flexWrap="wrap"
                    justifyContent={"center"}
                    alignContent={"center"}
                    rowGap={4}
                    columnGap={4}
                >
                    {data.map((item) =>
                        type === "genre" ? (
                            <GenreItem key={item.id} genre={item as IGenre} />
                        ) : (
                            <CardItem data={item} key={item.id} type={type} />
                        ),
                    )}
                </Stack>
            </Box>
        </motion.div>
    );
};

export default ListHomeSection;
