import Container from "~/components/container/index";
import Footer from "~/components/footer/index";
import Header from "~/components/header/index";
import Label from "~/components/label/index";
import "~/pages/error/style.css";

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
