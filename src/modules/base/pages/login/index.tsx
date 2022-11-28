import axios from "axios";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Footer from "../../../../main/components/footer";
import Header from "../../../../main/components/header";
import { useStore } from "../../../../main/store/zustand/store";
import ILogin from "../../../../main/store/zustand/types/ILogin";
import IResponseLogin from "../../../../main/store/zustand/types/IResponseLogin";
import "./style.css";

export default function Login() {
  const {
    user,
    setUser
  } = useStore();

  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const navigate = useNavigate();

  async function onSubmit() {
    const payload: ILogin = {
      email,
      password
    };

    const response: IResponseLogin = await axios.post("http://localhost:4000/login", payload).then(x => x.data);
    localStorage.setItem("token", response.token);
    setUser(response.user);
  }

  if (user) {
    navigate("/movies");
  }
  
  return (
    <>
      <Header />
      <div className="login-page-wrapper">
        <div className="left-main-wrapper">
          <img
            className="special-image-1"
            id="login-page-img"
            src="/assets/images/netflix.png"
            alt=""
          />
        </div>
        <div className="right-main-wrapper">
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
        </div>
      </div>
      <Footer />
    </>
  );
}
