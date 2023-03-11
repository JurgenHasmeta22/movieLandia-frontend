import Carousel from '@palustris/react-images';
import './style.css';

// interface IHomeCarouselLatestProps {
//   images: any
// }

export default function homeCarousel() {
	const images = [
		{ source: 'http://localhost:4000/images/rsz_fistful_of_vengeance.png' },
		{ source: 'http://localhost:4000/images/rsz_texas.png' },
		{ source: 'http://localhost:4000/images/rsz_movieposter_en.png' },
		{
			source: 'http://localhost:4000/images/rsz_wyihsxwyqn8ejsdut2p1p0o97n0.png'
		},
		{
			source: 'http://localhost:4000/images/rsz_elevjj3yg279mmpwuygyrhbjbbq.png'
		}
	];

	// const {
	//   images
	// } = props;

	return (
		<div className="home-ribbon-1">
			<Carousel views={images} />
		</div>
	);
}
