import ReactLoading from "react-loading";
import { Outlet, useNavigate, useParams } from "react-router-dom";
import Footer from "~/components/footer";
import Header from "~/components/header";
import { useStore } from "~/store/zustand/store";
import "~/pages/profile/style.css";

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
            <span className="userName-span">{user.userName}</span>
          </div>
        </div>
        <div className="container-tabs">
          <ul className="list-tabs">
            <li
              className={
                params.tab === "favoriteMovies" ? "clicked" : "videos-tab"
              }
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
          <Outlet />
        </div>
      </section>
      <Footer />
    </main>
  );
}
