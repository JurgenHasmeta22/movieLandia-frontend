import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Footer from "~/components/footer/index";
import Header from "~/components/header/index";
import moviesController from "~/services/movies";
import { useStore } from "~/store/zustand/store";
import IGenre from "~/interfaces/IGenre";
import "./style.css";

export default function Genres() {
  const { genres, setGenres } = useStore();
  const navigate = useNavigate();

  async function getGenres(): Promise<void> {
    const response: IGenre[] =
      await moviesController.getGenresWithNoPagination();
    setGenres(response);
  }

  if (!genres) {
    useEffect(() => {
      getGenres();
    }, []);
  }

  return (
    <div className="genre-categories-menus">
      <Header />
      <h2>Choose your favorite genre</h2>
      <div className="genre-categories-wrapper">
        {genres.map((genre: any) => (
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
        {/* <Outlet /> Doesnt work becase this is used only when its in this page not other component etc */}
      </div>
      <Footer />
    </div>
  );
}
