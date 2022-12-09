import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Button from "~/main/components/button/index";
import Container from "~/main/components/container/index";
import Footer from "~/main/components/footer/index";
import Header from "~/main/components/header/index";
import Input from "~/main/components/input/index"
import Picture from "~/main/components/picture/index";
import authenticationController from "~/main/controllers/authenticationController";
import { useStore } from "~/main/store/zustand/store";
import IResponseLogin from "~/main/interfaces/IResponseLogin";
import "~/modules/base/pages/register/style.css";

export default function Register() {
  const [username, setUsername] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const { user, setUser } = useStore();
  
  async function onSubmit() {
    const response: IResponseLogin = await authenticationController.onRegister(username, email, password);
    localStorage.setItem("token", response.token);
    setUser(response.user);
  }

  const navigate = useNavigate();
  if (user) {
    navigate("/movies");
  }

  return (
    <>
      <Header />
      <Container classname="signup-page-wrapper">
        <Container classname="left-main-wrapper">
          <Picture
            classname="special-image-2"
            id="signup-page-img"
            src="/assets/images/netflix.png"
            alt=""
          />
        </Container>
        <Container classname="right-main-wrapper">
          <form
            id="signup-form"
            onSubmit={function (e) {
              e.preventDefault();
              onSubmit();
            }}
          >
            <h1>MovieLandia24</h1>
            <label id="username" htmlFor="">
              <Input 
                type="text"
                placeholder="Enter your username"
                required={true}
                onChange={function (e: any) {
                  setUsername(e.target.value);
                }}
              />
            </label>
            <label>
              <Input 
                type="text"
                id="email"
                placeholder="Enter your email"
                onChange={function (e) {
                  setEmail(e.target.value);
                }}
              />
            </label>
            <label>
              <Input 
                type="password"
                id="password"
                placeholder="Enter your password"
                required
                onChange={function (e) {
                  setPassword(e.target.value);
                }}
              />
            </label>
            <label>
              <Button>Sign Up</Button>
            </label>
            <label id="login-link-wrapper" htmlFor="">
              You have an account?
              <Link id="link" to={"../login"}>
                Log In
              </Link>
            </label>
          </form>
        </Container>
      </Container>
      <Footer />
    </>
  );
}
