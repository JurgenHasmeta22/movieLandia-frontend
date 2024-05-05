import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import authenticationService from "~/services/authenticationService";
import { useStore } from "~/store/zustand/store";
import type IResponseLogin from "~/interfaces/IResponseLogin";
import "~/pages/login/style.css";

export default function Login() {
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");

    const { user, setUser } = useStore();

    const navigate = useNavigate();

    async function onSubmit() {
        const response: IResponseLogin = await authenticationService.onLogin(email, password);
        localStorage.setItem("token", response.token);
        setUser(response.user);
    }

    if (user) {
        navigate("/movies");
    }

    return (
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
                                onChange={function (e) {
                                    setEmail(e.target.value);
                                }}
                            />
                        </label>
                        <label>
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
    );
}
