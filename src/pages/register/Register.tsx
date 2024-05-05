import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import authenticationService from "~/services/authenticationService";
import { useStore } from "~/store/zustand/store";
import type IResponseLogin from "~/interfaces/IResponseLogin";
import "~/pages/register/style.css";

export default function Register() {
    const [username, setUsername] = useState<string>("");
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");

    const { user, setUser } = useStore();

    const navigate = useNavigate();

    async function onSubmit() {
        const response: IResponseLogin = await authenticationService.onRegister(
            username,
            email,
            password,
        );

        localStorage.setItem("token", response.token);
        setUser(response.user);
    }
    
    if (user) {
        navigate("/movies");
    }

    return (
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
                            e.preventDefault();
                            onSubmit();
                        }}
                    >
                        <h1>MovieLandia24</h1>
                        <label id="username" htmlFor="">
                            <input
                                type="text"
                                placeholder="Enter your username"
                                required={true}
                                onChange={function (e: any) {
                                    setUsername(e.target.value);
                                }}
                            />
                        </label>
                        <label>
                            <input
                                type="text"
                                id="email"
                                placeholder="Enter your email"
                                onChange={function (e) {
                                    setEmail(e.target.value);
                                }}
                            />
                        </label>
                        <label>
                            <input
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
    );
}
