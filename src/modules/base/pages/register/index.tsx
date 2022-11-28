import { Link, useNavigate } from "react-router-dom";
import Footer from "../../../../main/components/footer";
import Header from "../../../../main/components/header";
import { useStore } from "../../../../main/store/zustand/store";
import "./style.css";

export default function Register() {
  const {
    handleEmailRegister,
    handleFormSubmitRegister,
    handlePasswordChangeRegister,
    handleUserNameRegister,
    user,
  } = useStore();

  const navigate = useNavigate();

  if (user) {
    navigate("/movies");
  }

  return (
    <>
      <Header />
      <div className="signup-page-wrapper">
        <div className="left-main-wrapper">
          <img
            className="special-image-2"
            id="signup-page-img"
            src="/assets/images/netflix.png"
            alt=""
          />
        </div>
        <div className="right-main-wrapper">
          <form
            id="signup-form"
            onSubmit={function (e) {
              handleFormSubmitRegister(e);
            }}
          >
            <h1>MovieLandia24</h1>
            <label id="username" htmlFor="">
              <input
                type="text"
                placeholder="Enter your username"
                required
                onChange={function (e) {
                  handleUserNameRegister(e);
                }}
              />
            </label>
            <label htmlFor="">
              <input
                type="text"
                id="email"
                placeholder="Enter your email"
                onChange={function (e) {
                  handleEmailRegister(e);
                }}
              />
            </label>
            <label htmlFor="">
              <input
                type="password"
                name=""
                id="password"
                placeholder="Enter your password"
                required
                onChange={function (e) {
                  handlePasswordChangeRegister(e);
                }}
              />
            </label>
            <label htmlFor="">
              <button>Sign Up</button>
            </label>
            <label id="login-link-wrapper" htmlFor="">
              You have an account?
              <Link id="link" to={"../login"}>
                Log In
              </Link>
            </label>
          </form>
        </div>
      </div>
      <Footer />
    </>
  );
}
