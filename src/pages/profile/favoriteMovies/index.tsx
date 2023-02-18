import { useNavigate } from "react-router-dom";
import { useStore } from "~/store/zustand/store";
import Container from "~/components/container";
import Label from "~/components/label";
import List from "~/components/list";
import ListItem from "~/components/list/listItem";
import Picture from "~/components/picture";

export default function FavoriteMoviesTab() {
  const navigate = useNavigate();
  const { user } = useStore();

  return (
    <>
      <h3 className="special-video-you">Bookmarked movies</h3>
      <Container classname="container-videos">
        <List classname="favorite-movies">
          {user?.favMovies!.map((movie: any) => (
            <ListItem
              classname="movie-fav"
              // key={movie.id}
              myKey={movie.id}
              onClick={function () {
                navigate(
                  `/movies/${movie.title
                    .split("")
                    .map((char: any) => (char === " " ? "-" : char))
                    .join("")}`
                );
                window.scroll(0, 0);
              }}
            >
              <Picture src={movie.photoSrc} />
              <Label>Movie title: {movie.title}</Label>
              <Label>Release year: {movie.releaseYear}</Label>
            </ListItem>
          ))}
        </List>
      </Container>
    </>
  );
}
