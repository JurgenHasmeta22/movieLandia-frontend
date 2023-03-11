import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Footer from '~/components/footer/index';
import Header from '~/components/header/index';
import authenticationController from '~/services/authentication';
import { useStore } from '~/store/zustand/store';
import IResponseLogin from '~/interfaces/IResponseLogin';
import '~/pages/register/style.css';

export default function Register() {
	const [username, setUsername] = useState<string>('');
	const [email, setEmail] = useState<string>('');
	const [password, setPassword] = useState<string>('');
	const { user, setUser } = useStore();

	async function onSubmit() {
		const response: IResponseLogin = await authenticationController.onRegister(
			username,
			email,
			password
		);
		localStorage.setItem('token', response.token);
		setUser(response.user);
	}

	const navigate = useNavigate();
	if (user) {
		navigate('/movies');
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
							<Link id="link" to={'../login'}>
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
