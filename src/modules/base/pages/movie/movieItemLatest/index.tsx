import { useNavigate } from "react-router";
import ListItem from "~/main/components/list/listItem";
import Picture from "~/main/components/picture";
import IMovie from "~/main/store/zustand/types/IMovie";

interface IMovieItemLatestProps {
  latestMovie: IMovie
}

export default function movieItemLatest(props: IMovieItemLatestProps) {
  const navigate = useNavigate();
  const { latestMovie } = props;
  
  return (
    <ListItem
      key={latestMovie.id}
      onClick={function () {
        navigate(
          `/movies/${latestMovie.title
            .split("")
            .map((char: any) => (char === " " ? "-" : char))
            .join("")}`
        );
        window.scrollTo(0, 0);
      }}
    >
      <Picture src={latestMovie.photoSrc} />
    </ListItem>
  )
}