import Footer from "~/components/footer/index";
import Header from "~/components/header/index";
import "~/pages/error/style.css";

export default function Error404() {
  return (
    <>
      <Header />
      <div className="error-wrapper">
        <span>ERROR 404</span>
      </div>
      <Footer />
    </>
  );
}
