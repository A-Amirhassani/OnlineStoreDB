import Axios from 'axios';
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function Login() {
	const [username, setUername] = useState('');
	const [password, setPassword] = useState('');
	const [loginStatus, setLoginStatus] = useState('');

	const isDisabled = !username || !password;

	const navigate = useNavigate();

	const initializeDB = () => {
		Axios.post('http://localhost:3001/initializeDB', null)
			.then((response) => {
				console.log(response.data);
			})
			.catch((error) => {
				console.error(error);
			});
	};

	const login = () => {
		//  console.log(
		// 		'Logging in with username:',
		// 		username,
		// 		'and password:',
		// 		password
		// 	);
		Axios.post('http://localhost:3001/login', {
			username: username,
			password: password,
		})
			.then((response) => {
				if (response.data.length === 0) {
					setLoginStatus('Username or password is incorrect');
				} else {
					setLoginStatus('Login successful!');
					navigate('/logout');
				}
			})
			.catch((error) => {
				console.error(error.message);
				if (error.response.status === 401) {
					setLoginStatus('Username or password is incorrect');
				} else {
					setLoginStatus('An error occurred while logging in.');
				}
			});
	};

	return (
		<div className="login">
			<h1>Login</h1>
			<input
				type="text"
				placeholder="Username…"
				onChange={(e) => {
					setUername(e.target.value);
				}}
			/>
			<br />
			<input
				type="password"
				placeholder="Password…"
				onChange={(e) => {
					setPassword(e.target.value);
				}}
			/>
			<br />
			<button disabled={isDisabled} onClick={login}>
				Login
			</button>
			<h1> {loginStatus}</h1>
			<p>Don't have an account?</p>
			<Link to="/register">Create an account</Link>
			<br />
			<button onClick={initializeDB}>Initialize Database</button>
		</div>
	);
}

export default Login;
