import Footer from "../../../../main/components/footer";
import Header from "../../../../main/components/header";
import Label from "../../../../main/components/label";
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
