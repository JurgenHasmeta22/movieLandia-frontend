import axios from "axios";
import { useEffect } from "react";
import { useNavigate } from "react-router";
import Footer from "../../../../../main/components/footer";
import Header from "../../../../../main/components/header";
import { useStore } from "../../../../../main/store/zustand/store";
import IGenre from "../../../../../main/store/zustand/types/IGenre";
import "./style.css";

export default function GenreCategories() {
  const { 
    genres, 
    setGenres 
  } = useStore();
  
  const navigate = useNavigate();

  async function getGenres(): Promise<void> {
    const response: IGenre[] = await axios.get("http://localhost:4000/genres").then(x => x.data);
    setGenres(response);
  }

  if (!genres) {
    useEffect(() => {
      getGenres()
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
      </div>
      <Footer />
    </div>
  );
}
