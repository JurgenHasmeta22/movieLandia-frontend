import Footer from "~/components/footer/index";
import Header from "~/components/header/index";
import "~/pages/error/style.css";

export default function Error404() {
  return (
    <>
      <Header />
      <div className="error-wrapper">
        <label>ERROR 404</label>
      </div>
      <Footer />
    </>
  );
}
