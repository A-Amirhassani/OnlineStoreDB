import Axios from 'axios';
import React, { useState } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import bcrypt from 'bcryptjs' //for hasing passwords


function Login() {
	const [username, setUername] = useState('');
	const [password, setPassword] = useState('');
	const [loginStatus, setLoginStatus] = useState('');

	const login = () => {
		Axios.post('http://localhost:3001/login', {
			username: username,
			password: bcrypt.compare(password, '$2a$10$CwTycUXWue0Thq9StjUM0u'),
		}).then((response) => {
			if (!response.data.message) {
				setLoginStatus(response.data.message);
			} else {
				setLoginStatus(response.data[0].message);
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
			<button onClick={login}>Login</button>
			<h1> {loginStatus}</h1>
			<p>Don't have an account?</p>
			<a href="/register">Create an account</a>
		</div>
	);
}

export default Login;
