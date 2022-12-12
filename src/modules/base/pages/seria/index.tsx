import { useEffect, useState } from "react";
import { useParams } from "react-router";
import Footer from "~/main/components/footer";
import Header from "~/main/components/header";
import moviesController from "~/main/controllers/moviesController";
import ISerie from "~/main/interfaces/ISerie";

export default function Seria() {
    const [serie, setSerie] = useState<ISerie | null>(null);
    const params = useParams();

    async function getSerie() {
        const serie: ISerie = await moviesController.getSerieMovie(params.title);
        setSerie(serie);
    }

    useEffect(() => {
        getSerie();
    }, []);

    return (
        <>
          <Header />
          {/* <section className="movie-item-wrapper">
            <div className="left-section">
              <div className="video-and-servers">
                <div className="servers">
                  <ul className="server-list">
                    <li>Movie Server</li>
                  </ul>
                </div>
                <div className="video-square">
                  <iframe
                    src={movie?.videoSrc}
                    name="movieFrame"
                    height="550px"
                    width="850px"
                    allowFullScreen
                  ></iframe>
                </div>
              </div>
              <div className="movie-fabula">
                <p id="fabula">{movie?.description}</p>
              </div>
            </div>
          </section> */}
          <Footer />
        </>
    );
}