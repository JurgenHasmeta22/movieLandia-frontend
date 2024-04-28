import "./style.css";

const api = {
    url: import.meta.env.VITE_API_URL,
};

export default function homeCarousel() {
    const images = [
        { source: `${api.url}/images/rsz_fistful_of_vengeance.png` },
        { source: `${api.url}/images/rsz_texas.png` },
        { source: `${api.url}/images/rsz_movieposter_en.png` },
        { source: `${api.url}/images/rsz_wyihsxwyqn8ejsdut2p1p0o97n0.png` },
        { source: `${api.url}/images/rsz_elevjj3yg279mmpwuygyrhbjbbq.png` },
    ];

    return <div className="home-ribbon-1">{/* <Carousel views={images} /> */}</div>;
}
