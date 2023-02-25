import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Footer from "~/components/footer/index";
import Header from "~/components/header/index";
import authenticationController from "~/services/authentication";
import { useStore } from "~/store/zustand/store";
import IResponseLogin from "~/interfaces/IResponseLogin";
import "~/pages/login/style.css";

// const initialState = {
//   email: "",
//   password: ""
// }

// const reducer = (state: any, action: any) => {
//   switch (action.type) {
//     case "EMAIL":
//       return {
//         ...state,
//         email: action.value
//       }
//     case "PASSWORD":
//       return {
//         ...state,
//         password: action.value
//       }
//     default:
//       return state;
//   }
// };

export default function Login() {
  // const emailRef = useRef<HTMLInputElement>(null);
  // const passwordRef = useRef<HTMLInputElement>(null);
  // const count = useRef(0);
  // const [login, dispatch] = useReducer(reducer, initialState);
  // const [login, setLogin] = useState<ILogin>({
  //   email: "",
  //   password: ""
  // })

  const navigate = useNavigate();
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const { user, setUser } = useStore();

  async function onSubmit() {
    const response: IResponseLogin = await authenticationController.onLogin(
      email,
      password
    );
    // const response: IResponseLogin = await authenticationController.onLogin(login.email, login.password);
    localStorage.setItem("token", response.token);
    setUser(response.user);
  }

  // const focusEmail = () => {
  //   console.log(emailRef);
  //   emailRef.current!.focus();
  // };

  // const focusPassword = () => {
  //   passwordRef.current!.focus();
  // };

  // useEffect(() => {
  //   focusEmail();
  //   focusPassword();
  // }, []);

  // useEffect(() => {
  //   count.current = count.current + 1;
  // });

  if (user) {
    navigate("/movies");
  }

  return (
    <>
      <Header />
      {/* <h1>Render Count: {count.current}</h1> Count the renders */}
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
            <label>
              <input
                type="text"
                name="email"
                placeholder="Enter your email"
                required
                // ref={emailRef}
                onChange={function (e) {
                  setEmail(e.target.value);
                  // setLogin({...login, email: e.target.value})
                  // dispatch({type: "EMAIL", value: e.target.value});
                }}
              />
            </label>
            <label>
              <input
                type="password"
                name="password"
                placeholder="Enter your password"
                required
                // ref={passwordRef}
                onChange={function (e) {
                  setPassword(e.target.value);
                  // setLogin({...login, password: e.target.value})
                  // dispatch({type: "PASSWORD", value: e.target.value});
                }}
              />
            </label>
            <span>
              <button>Log In</button>
            </span>
            <label id="signup-link-wrapper" htmlFor="">
              Don't have an account?
              <Link id="link" to={"/register"}>
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
