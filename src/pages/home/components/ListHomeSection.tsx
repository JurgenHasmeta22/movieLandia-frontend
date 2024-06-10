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
            className="relative"
        >
            <section className="flex flex-col space-y-3">
                <div className="flex flex-row justify-between items-center mx-1">
                    <h2 className="font-bold text-2xl">
                        {type === "genre"
                            ? "Trending Genres"
                            : type === "movie"
                              ? "Trending Movies"
                              : type === "serie"
                                ? "Trending Series"
                                : ""}
                    </h2>
                    <Link
                        to={link}
                        className="text-sm font-black text-blue-500 no-underline"
                        onClick={() => {
                            window.scrollTo(0, 0);
                        }}
                    >
                        {linkText}
                    </Link>
                </div>
                <div className="flex flex-row flex-wrap justify-center items-center space-y-4 space-x-4">
                    {data.map((item) =>
                        type === "genre" ? (
                            <GenreItem key={item.id} genre={item as IGenre} />
                        ) : (
                            <CardItem data={item} key={item.id} type={type} />
                        ),
                    )}
                </div>
            </section>
        </motion.div>
    );
};

export default ListHomeSection;
