import Footer from "../../components/footer";
import Header from "../../components/header";
import "./style.css";

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
