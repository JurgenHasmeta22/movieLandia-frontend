import { Outlet, useNavigate, useParams } from "react-router-dom";
import { useStore } from "~/store/zustand/store";
import "~/pages/profile/style.css";

export default function Profile() {
    const navigate = useNavigate();
    const params = useParams();

    const { user } = useStore();

    if (!user) {
        return <div className="loading-wrapper">...</div>;
    }

    return (
        <main>
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
                    <Outlet />
                </div>
            </section>
        </main>
    );
}
