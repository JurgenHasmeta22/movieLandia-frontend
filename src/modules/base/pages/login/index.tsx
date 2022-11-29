import { useEffect, useReducer, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Container from "../../../../main/components/container";
import Footer from "../../../../main/components/footer";
import Header from "../../../../main/components/header";
import Picture from "../../../../main/components/picture";
import authenticationController from "../../../../main/controllers/authenticationController";
import { useStore } from "../../../../main/store/zustand/store";
// import ILogin from "../../../../main/store/zustand/types/ILogin";
import IResponseLogin from "../../../../main/store/zustand/types/IResponseLogin";
import "./style.css";

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
  const navigate = useNavigate();
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  // const emailRef = useRef<HTMLInputElement>(null);
  // const passwordRef = useRef<HTMLInputElement>(null);
  // const count = useRef(0);

  // const [login, dispatch] = useReducer(reducer, initialState);

  // const [login, setLogin] = useState<ILogin>({
  //   email: "",
  //   password: ""
  // })

  const {
    user,
    setUser
  } = useStore();

  async function onSubmit() {
    const response: IResponseLogin = await authenticationController.onLogin(email, password);
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
            <label>
              <button>Log In</button>
            </label>
            <label id="signup-link-wrapper" htmlFor="">
              Don't have an account?
              <Link id="link" to={"/register"}>
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
