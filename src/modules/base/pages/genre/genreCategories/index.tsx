import { useEffect } from "react";
import { useNavigate } from "react-router";
import Card from "../../../../../main/components/card";
import Container from "../../../../../main/components/container";
import Footer from "../../../../../main/components/footer";
import Header from "../../../../../main/components/header";
import Heading from "../../../../../main/components/Heading";
import Label from "../../../../../main/components/label";
import moviesController from "../../../../../main/controllers/moviesController";
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
    const response: IGenre[] = await moviesController.getGenresWithNoPagination();
    setGenres(response);
  }

  if (!genres) {
    useEffect(() => {
      getGenres()
    }, []);
  }

  return (
    <Container classname="genre-categories-menus">
      <Header />
      <Heading>Choose your favorite genre</Heading>
      <Container classname="genre-categories-wrapper">
        {genres.map((genre: any) => (
          <Card
            classname="genre-category"
            key={genre.id}
            onClick={function () {
              navigate(`/genres/${genre.name}`);
              window.scrollTo(0, 0);
            }}
          >
            <Label>{genre.name}</Label>
          </Card>
        ))}
      </Container>
      <Footer />
    </Container>
  );
}
