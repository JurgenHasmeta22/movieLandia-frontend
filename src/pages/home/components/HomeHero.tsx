import React, { useContext } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { MdLocalMovies, MdMovie } from "react-icons/md";
import { ThemeContext } from "~/services/providers/ThemeContext";

const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            delay: 0.2,
            duration: 0.8,
            type: "spring",
        },
    },
};

const itemVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: (custom: number) => ({
        opacity: 1,
        y: 0,
        transition: { delay: custom * 0.2 },
    }),
};

const HomeHeroSection = () => {
    const navigate = useNavigate();
    const { theme } = useContext(ThemeContext);

    return (
        <section className="flex flex-col items-center justify-center h-screen relative overflow-hidden text-center">
            <div
                className="absolute top-0 left-0 w-full h-full bg-cover bg-center"
                style={{
                    backgroundImage: "url('/assets/images/netflix.png')",
                    filter: "blur(2px) opacity(0.5)",
                    zIndex: -1,
                }}
            ></div>
            <motion.div variants={containerVariants} initial="hidden" animate="visible">
                <motion.div variants={itemVariants} custom={0}>
                    <h1
                        className={`font-black text-[3.75rem] leading-tight ${
                            theme === "dark" ? "text-primary-100" : "text-blueAccent-900"
                        }`}
                    >
                        Dive into MovieLandia24
                    </h1>
                </motion.div>
                <motion.div variants={itemVariants} custom={1}>
                    <h2
                        className={`font-black text-[2.5rem] leading-tight ${
                            theme === "dark" ? "text-primary-100" : "text-blueAccent-900"
                        }`}
                    >
                        Your Gateway to the World of Cinema and Series!
                    </h2>
                </motion.div>
                <motion.div variants={itemVariants} custom={2}>
                    <p
                        className={`mt-4 font-bold leading-tight ${
                            theme === "dark" ? "text-primary-100" : "text-primary-400"
                        }`}
                    >
                        Explore the latest blockbusters and timeless classics.
                    </p>
                </motion.div>
                <motion.div variants={itemVariants} custom={3}>
                    <div className="flex justify-center mt-8 space-x-3">
                        <Link to="/movies">
                            <button
                                className={`flex items-center px-4 py-2 font-semibold text-white bg-primary-900 rounded-md hover:bg-greenAccent-800`}
                            >
                                <MdMovie className={`text-primary-100 text-lg`} />
                                <span className="ml-2">Start Watching Movies</span>
                            </button>
                        </Link>
                        <Link to="/series">
                            <button
                                className={`flex items-center px-4 py-2 font-semibold text-white bg-primary-900 rounded-md hover:bg-greenAccent-800`}
                                onClick={() => {
                                    navigate("/series");
                                }}
                            >
                                <MdLocalMovies className={`text-primary-100 text-lg`} />
                                <span className="ml-2">Start Watching Series</span>
                            </button>
                        </Link>
                    </div>
                </motion.div>
            </motion.div>
        </section>
    );
};

export default HomeHeroSection;
