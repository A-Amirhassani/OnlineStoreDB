import Axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function Login(props) {
	const { setIsAuthenticated } = props;
	const [username, setUername] = useState('');
	const [password, setPassword] = useState('');
	const [loginStatus, setLoginStatus] = useState('');

	const isDisabled = !username || !password;

	const navigate = useNavigate();

	useEffect(() => {
		// Clear login status on component mount
		setLoginStatus('');
	}, []);

	useEffect(() => {
		const isLoggedIn = localStorage.getItem('isLoggedIn');
		if (isLoggedIn) {
			navigate('/dashboard');
		}
	}, [navigate]);

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
		Axios.post(
			'http://localhost:3001/login',
			{
				username: username,
				password: password,
			},
			{
				withCredentials: true,
			}
		)

			.then((response) => {
				console.log('Response:', response && response.data);

				if (response.data.length === 0) {
					setLoginStatus('Username or password is incorrect');
				} else {
					setLoginStatus('Login successful!');
					console.log(
						'Before setting username in local storage:',
						localStorage.getItem('username')
					);
					console.log('responseData:', response.data);
					console.log('responseData.username:', response.data.username);
					localStorage.setItem('isLoggedIn', true);
					localStorage.setItem('username', response.data.username);
					console.log(
						'After setting username in local storage:',
						localStorage.getItem('username'),
						setIsAuthenticated(true),
						navigate('/dashboard'),
						console.log(
							'After setting username in local storage:',
							localStorage.getItem('username')
						)
					);
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
				value={username}
				onChange={(e) => {
					setUername(e.target.value);
				}}
			/>
			<br />
			<input
				type="password"
				placeholder="Password…"
				value={password}
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
