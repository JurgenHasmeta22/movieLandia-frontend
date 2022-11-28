import { useEffect } from "react";
import { useNavigate } from "react-router";
import Footer from "../../../components/footer";
import Header from "../../../components/header";
import { useStore } from "../../../store/zustand/store";
import IGenre from "../../../store/zustand/types/IGenre";
import "./style.css";

export default function GenreCategories() {
  const { genres, setGenres } = useStore();
  const navigate = useNavigate();

  function getGenres(): void {
    fetch(`http://localhost:4000/genres`)
      .then((resp) => resp.json())
      .then((genres: IGenre[]) => setGenres(genres));
  }
  if (genres[0]?.name === undefined) {
    useEffect(getGenres, []);
  }

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
