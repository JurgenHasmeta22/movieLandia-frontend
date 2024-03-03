import { useNavigate } from "react-router";
import type IMovie from "~/interfaces/IMovie";

interface IMovieItemLatestProps {
    latestMovie: IMovie;
}

export default function MovieItemLatest(props: IMovieItemLatestProps) {
    const navigate = useNavigate();
    const { latestMovie } = props;

    return (
        <li
            key={latestMovie.id}
            onClick={function () {
                navigate(
                    `/movies/${latestMovie.title
                        .split("")
                        .map((char: any) => (char === " " ? "-" : char))
                        .join("")}`,
                );
                window.scrollTo(0, 0);
            }}
        >
            <img src={latestMovie.photoSrc} />
        </li>
    );
}
