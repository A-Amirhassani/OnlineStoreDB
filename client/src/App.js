import React, { useState } from 'react';
import './App.css';
import Axios from 'axios';


function App() {
	// const [count, setCount] = useState(0);
	const [usernameReg, setUernameReg] = useState('');
	const [passwordReg, setPasswordReg] = useState('');

	const [username, setUername] = useState('');
	const [password, setPassword] = useState('');

	const [loginStatus, setLoginStatus] = useState('');

	const login = () => {
		Axios.post('http://localhost:3001/login', {
			username: username,
			password: password,
		}).then((response) => {
			if (!response.data.message) {
				setLoginStatus(response.data.message);
			} else {
				setLoginStatus(response.data[0].message);
			}
		});
	};

	const register = () => {
		Axios.post('http://localhost:3001/register', {
			username: usernameReg,
			password: passwordReg,
		}).then((response) => {
			console.log(response);
		});
	};

	return (
		<div className="App">
			<div className="registration">
				<h1>Registration</h1>
				<label>Username</label>
				<input type="text" />
				<br />
				<label>password</label>
				<input
					type="text"
					onChange={(e) => {
						setUernameReg(e.target.value);
					}}
				/>
				<br />
				
				<br />
				<button onClick={register}> Register</button>
			</div>
			<div className="login">
				<h1>Login</h1>
				<input
					type="text"
					placeholder="Username…"
					onChange={(e) => {
						setUername(e.target.value);
					}}
				/>{' '}
				<br />
				<input
					type="password"
					placeholder="Password…"
					onChange={(e) => {
						setPassword(e.target.value);
					}}
				/>
				<button onClick={login}>Login</button>
			</div>
			<h1> {loginStatus}</h1>
		</div>
	);
}

export default App;
