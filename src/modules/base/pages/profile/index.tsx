import ReactLoading from "react-loading";
import { useNavigate, useParams } from "react-router-dom";
import Footer from "../../../../main/components/footer";
import Header from "../../../../main/components/header";
import Label from "../../../../main/components/label";
import { useStore } from "../../../../main/store/zustand/store";
import "./style.css";

export default function Profile() {
  const navigate = useNavigate();
  const { user } = useStore();
  const params = useParams();

  if (!user) {
    return (
      <div className="loading-wrapper">
        <ReactLoading
          type={"spin"}
          color={"#000"}
          height={200}
          width={100}
          className="loading"
        />
      </div>
    );
  }

  return (
    <main>
      <Header />
      <section className="container-profile-menus">
        <div className="container-profile-nav">
          <div className="profile-info">
            <img src="/assets/avatars/blankavatar.jpg" />
            <Label classname="userName-span">{user.userName}</Label>
          </div>
        </div>
        <div className="container-tabs">
          <ul className="list-tabs">
            <li
              className={params.tab === "favoriteMovies" ? "clicked" : "videos-tab"}
              onClick={() => {
                navigate("/profile/favoriteMovies");
              }}
            >
              Favorite Movies
            </li>
            <li
              className={params.tab === "aboutUs" ? "clicked" : "about-tab"}
              onClick={() => {
                navigate("/profile/aboutUs");
              }}
            >
              About Channel
            </li>
          </ul>
          {params.tab === "favoriteMovies" ? (
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
                      <Label>Movie title: {movie.title}</Label>
                      <Label>Release year: {movie.releaseYear}</Label>
                    </li>
                  ))}
                </ul>
              </div>
            </>
          ) : params.tab === "aboutUs" ? (
            <div className="container-about">
              <Label>This is my account</Label>
            </div>
          ) : null}
        </div>
      </section>
      <Footer />
    </main>
  );
}
