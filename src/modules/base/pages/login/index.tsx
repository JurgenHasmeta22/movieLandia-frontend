import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Container from "../../../../main/components/container";
import Footer from "../../../../main/components/footer";
import Header from "../../../../main/components/header";
import Picture from "../../../../main/components/picture";
import authenticationController from "../../../../main/controllers/authenticationController";
import { useStore } from "../../../../main/store/zustand/store";
import IResponseLogin from "../../../../main/store/zustand/types/IResponseLogin";
import "./style.css";

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const {
    user,
    setUser
  } = useStore();

  async function onSubmit() {
    const response: IResponseLogin = await authenticationController.onLogin(email, password);
    localStorage.setItem("token", response.token);
    setUser(response.user);
  }

  if (user) {
    navigate("/movies");
  }
  
  return (
    <>
      <Header />
      <Container classname="login-page-wrapper">
        <Container classname="left-main-wrapper">
          <Picture
            classname="special-image-1"
            id="login-page-img"
            src="/assets/images/netflix.png"
            alt=""
          />
        </Container>
        <Container classname="right-main-wrapper">
          <form
            id="login-form"
            onSubmit={function (e) {
              e.preventDefault();
              onSubmit();
            }}
          >
            <h1>MovieLandia22</h1>
            <label htmlFor="">
              <input
                type="text"
                name="email"
                placeholder="Enter your email"
                required
                onChange={function (e) {
                  setEmail(e.target.value);
                }}
              />
            </label>
            <label htmlFor="">
              <input
                type="password"
                name="password"
                placeholder="Enter your password"
                required
                onChange={function (e) {
                  setPassword(e.target.value);
                }}
              />
            </label>
            <label htmlFor="">
              <button>Log In</button>
            </label>
            <label id="signup-link-wrapper" htmlFor="">
              Don't have an account?{" "}
              <Link id="link" to={"../register"}>
                Sign Up
              </Link>
            </label>
          </form>
        </Container>
      </Container>
      <Footer />
    </>
  );
}
