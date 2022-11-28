import { Link, useNavigate } from "react-router-dom";
import Footer from "../../../../main/components/footer";
import Header from "../../../../main/components/header";
import { useStore } from "../../../../main/store/zustand/store";
import "./style.css";

export default function Login() {
  const {
    user,
    handleEmailChangeLogin,
    handlePasswordChangeLogin,
    handleFormSubmitLogin,
  } = useStore();
  const navigate = useNavigate();

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
              handleFormSubmitLogin(e);
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
                  handleEmailChangeLogin(e);
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
                  handlePasswordChangeLogin(e);
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
