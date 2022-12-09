import Container from "~/main/components/container/index";
import Footer from "~/main/components/footer/index";
import Header from "~/main/components/header/index";
import Label from "~/main/components/label/index";
import "~/modules/base/pages/error/style.css";

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
