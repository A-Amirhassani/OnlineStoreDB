import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Logout from './Logout';

function Dashboard() {
	const navigate = useNavigate();

useEffect(() => {
	const isLoggedIn = localStorage.getItem('isLoggedIn');
	if (!isLoggedIn) {
		navigate('/login');
	} else if (isLoggedIn && window.location.pathname === '/login') {
		navigate('/dashboard');
	}

	const handleBackButton = (event) => {
		event.preventDefault();
		window.history.forward();
	};

	window.addEventListener('popstate', handleBackButton);

	return () => {
		window.removeEventListener('popstate', handleBackButton);
	};
}, [navigate]);


	const handleAddItem = () => {
		navigate('/add-item');
	};

	return (
		<div>
			<h2>Welcome, {localStorage.getItem('username')}!</h2>
			<button onClick={handleAddItem}>Add Item</button>
			<Logout />
		</div>
	);
}

export default Dashboard;
