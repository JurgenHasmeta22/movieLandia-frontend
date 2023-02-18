import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Card from "~/components/card/index";
import Container from "~/components/container/index";
import Footer from "~/components/footer/index";
import Header from "~/components/header/index";
import Label from "~/components/label/index";
import moviesController from "~/services/movies";
import { useStore } from "~/store/zustand/store";
import IGenre from "~/interfaces/IGenre";
import "./style.css";
import Heading from "~/components/heading/index";

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
        {/* <Outlet /> Doesnt work becase this is used only when its in this page not other component etc */}
      </Container>
      <Footer />
    </Container>
  );
}
