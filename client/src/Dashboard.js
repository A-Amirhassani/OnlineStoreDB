import axios from 'axios';
import React, { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import Logout from './Logout';

function Dashboard() {
	const navigate = useNavigate();
	const navigateRef = useRef( navigate );
	const [items, setItems] = useState([]);

	useEffect(() => {
		const isLoggedIn = localStorage.getItem('isLoggedIn');
		if (!isLoggedIn) {
			navigateRef.current('/login');
		} else if (isLoggedIn && window.location.pathname === '/login') {
			navigateRef.current('/dashboard');
		}

		const handleBackButton = (event) => {
			event.preventDefault();
			window.history.forward();
		};

		window.addEventListener('popstate', handleBackButton);

		axios
			.get('http://localhost:3001/api/items')
			.then((res) => {
				console.log( res.data );
				setItems(res.data);
			})
			.catch((error) => {
				console.log('Error');
			});

		return () => {
			window.removeEventListener('popstate', handleBackButton);
		};
	}, []);

	const handleAddItem = () => {
		navigate('/add-item');
	};

	return (
		<div>
			<h2>Welcome, {localStorage.getItem('username')}!</h2>
			<button onClick={handleAddItem}>Add Item</button>
			<Logout />
			<div>
				{items.map((item, index) => (
					<div key={index}>
						<h3>{item.title}</h3>
						<p>{item.description}</p>
						
					</div>
				))}
			</div>
		</div>
	);
}

export default Dashboard;
