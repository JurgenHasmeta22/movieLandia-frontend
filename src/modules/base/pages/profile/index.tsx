import ReactLoading from "react-loading";
import { Outlet, useNavigate, useParams } from "react-router-dom";
import Container from "~/main/components/container";
import Footer from "~/main/components/footer";
import Header from "~/main/components/header";
import Label from "~/main/components/label";
import List from "~/main/components/list";
import ListItem from "~/main/components/list/listItem";
import Picture from "~/main/components/picture";
import { useStore } from "~/main/store/zustand/store";
import "~/modules/base/pages/profile/style.css";

export default function Profile() {
  const navigate = useNavigate();
  const { user } = useStore();
  const params = useParams();

  // function conditionalRenderingTabs(): JSX.Element | undefined {
  //   if (params.tab === "favoriteMovies") {
  //     return (
  //       <>
  //         <h3 className="special-video-you">Bookmarked movies</h3>
  //         <Container classname="container-videos">
  //           <List classname="favorite-movies">
  //             {user?.favMovies!.map((movie: any) => (
  //               <ListItem
  //                 classname="movie-fav"
  //                 // key={movie.id}
  //                 myKey={movie.id}
  //                 onClick={function () {
  //                   navigate(
  //                     `/movies/${movie.title
  //                       .split("")
  //                       .map((char: any) => (char === " " ? "-" : char))
  //                       .join("")}`
  //                   );
  //                   window.scroll(0, 0);
  //                 }}
  //               >
  //                 <Picture src={movie.photoSrc} />
  //                 <Label>Movie title: {movie.title}</Label>
  //                 <Label>Release year: {movie.releaseYear}</Label>
  //               </ListItem>
  //             ))}
  //           </List>
  //         </Container>
  //       </>
  //     );
  //   } else if (params.tab === "aboutUs") {
  //     return (
  //       <Container classname="container-about">
  //         <Label>This is my account</Label>
  //       </Container>
  //     )
  //   }
  // }

  if (!user) {
    return (
      <Container classname="loading-wrapper">
        <ReactLoading
          type={"spin"}
          color={"#000"}
          height={200}
          width={100}
          className="loading"
        />
      </Container>
    );
  }

  return (
    <main>
      <Header />
      <section className="container-profile-menus">
        <Container classname="container-profile-nav">
          <Container classname="profile-info">
            <Picture src="/assets/avatars/blankavatar.jpg" />
            <Label classname="userName-span">{user.userName}</Label>
          </Container>
        </Container>
        <Container classname="container-tabs">
          <List classname="list-tabs">
            <ListItem
              classname={params.tab === "favoriteMovies" ? "clicked" : "videos-tab"}
              onClick={() => {
                navigate("/profile/favoriteMovies");
              }}
            >
              Favorite Movies
            </ListItem>
            <ListItem
              classname={params.tab === "aboutUs" ? "clicked" : "about-tab"}
              onClick={() => {
                navigate("/profile/aboutUs");
              }}
            >
              About Channel
            </ListItem>
          </List>
          {/* {conditionalRenderingTabs()} */}
          <Outlet />
        </Container>
      </section>
      <Footer />
    </main>
  );
}
