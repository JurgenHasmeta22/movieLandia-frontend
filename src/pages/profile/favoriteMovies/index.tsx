import { useNavigate } from "react-router-dom";
import { useStore } from "~/store/zustand/store";

export default function FavoriteMoviesTab() {
  const navigate = useNavigate();
  const { user } = useStore();

  return (
    <>
      <h3 className="special-video-you">Bookmarked movies</h3>
      <div className="container-videos">
        <ul className="favorite-movies">
          {user?.favMovies!.map((movie: any) => (
            <li
              className="movie-fav"
              key={movie.id}
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
              <img src={movie.photoSrc} />
              <label>Movie title: {movie.title}</label>
              <label>Release year: {movie.releaseYear}</label>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}
