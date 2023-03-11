import { useNavigate } from 'react-router-dom';
import IMovie from '~/interfaces/IMovie';
import './style.css';

interface IMovieItemProps {
	movie: IMovie;
	type: string;
}

const MovieItem = ({ movie, type }: IMovieItemProps) => {
	const navigate = useNavigate();

	return (
		<div
			className="movie-item"
			key={movie.id}
			onClick={function (e) {
				e.stopPropagation();
				navigate(
					`/movies/${movie.title
						.split('')
						.map((char: any) => (char === ' ' ? '-' : char))
						.join('')}`
				);
				window.scrollTo(0, 0);
			}}
		>
			<img src={movie.photoSrc} />
			<span className="movie-title">{movie.title}</span>
			{type !== 'serie' && (
				<div className="genres-holder-span">
					{movie.genres &&
						movie.genres.map((genre: any) => (
							<span
								key={genre.genre.name}
								onClick={function (e) {
									e.stopPropagation();
									navigate(`/genres/${genre.genre.name}`);
									window.scrollTo(0, 0);
								}}
							>
								{genre.genre.name}
							</span>
						))}
				</div>
			)}
			<span className="imdb-span">
				{movie.ratingImdb !== 0 ? `Imdb: ${movie.ratingImdb}` : 'Imdb: N/A'}
			</span>
		</div>
	);
};

export default MovieItem;
