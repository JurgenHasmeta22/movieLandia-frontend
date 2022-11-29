import Container from "../../../../main/components/container";
import Footer from "../../../../main/components/footer";
import Header from "../../../../main/components/header";
import Label from "../../../../main/components/label";
import "./style.css";

export default function Error404() {
  return (
    <>
      <Header />
      <Container classname="error-wrapper">
        <Label>ERROR 404</Label>
      </Container>
      <Footer />
    </>
  );
}
