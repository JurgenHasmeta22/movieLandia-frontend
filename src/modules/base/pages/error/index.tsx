import Footer from "../../../../main/components/footer";
import Header from "../../../../main/components/header";
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
