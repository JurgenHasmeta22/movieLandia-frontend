import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Footer } from "~/components/footer/Footer";
import { Header } from "~/components/header/Header";
import movieService from "~/services/movieService";
import type IGenre from "~/interfaces/IGenre";
import "./style.css";

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
        <div className="genre-categories-menus">
            <Header />
            <h2>Choose your favorite genre</h2>
            <div className="genre-categories-wrapper">
                {genres?.map((genre: any) => (
                    <div
                        className="genre-category"
                        key={genre.id}
                        onClick={function () {
                            navigate(`/genres/${genre.name}`);
                            window.scrollTo(0, 0);
                        }}
                    >
                        <span>{genre.name}</span>
                    </div>
                ))}
            </div>
            <Footer />
        </div>
    );
}
