import React from 'react';
import { useNavigate } from 'react-router-dom';
import Axios from 'axios';

function Logout() {
	const navigate = useNavigate();

	const handleLogout = () => {
		Axios.post('http://localhost:3001/logout', {
			username: localStorage.getItem('username'),
		})
			.then(() => {
				localStorage.removeItem('isLoggedIn');
				localStorage.removeItem('username');
				navigate('/login');
			})
			.catch((error) => {
				console.error(error.message);
			});
	};

	return <button onClick={handleLogout}>Logout</button>;
}

export default Logout;
