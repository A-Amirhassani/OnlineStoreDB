import axios from 'axios';
import React, { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import Logout from './Logout';
import './Dashboard.css';

function Dashboard() {
	const navigate = useNavigate();
	const navigateRef = useRef( navigate );
	const [ items, setItems ] = useState( [] );
	const [ searchTerm, setSearchTerm ] = useState( '' );
	const [searched, setSearched] = useState(false);
	
	const handleSearchChange = (event) => {
		setSearchTerm(event.target.value);
	};

	const handleSearchSubmit = (event) => {
		event.preventDefault();
		filterItems( searchTerm );
		setSearched(true);
	};

	const filterItems = (searchTerm) => {
		axios
			.get('http://localhost:3001/api/items')
			.then((res) => {
				const filteredItems = res.data.filter((item) =>
					item.category.toLowerCase().includes(searchTerm.toLowerCase())
				);
				setItems(filteredItems);
			})
			.catch((error) => {
				console.log('Error');
			});
	};


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
			<form onSubmit={handleSearchSubmit}>
				<input
					type="text"
					placeholder="Search by category"
					value={searchTerm}
					onChange={handleSearchChange}
				/>
				<button type="submit">Search</button>
			</form>
			{searched ? (
				items.length > 0 ? (
					<table>
						<thead>
							<tr>
								<th>Title</th>
								<th>Description</th>
								<th>Category</th>
								<th>Price</th>
							</tr>
						</thead>
						<tbody>
							{items.map((item, index) => (
								<tr key={index}>
									<td>{item.title}</td>
									<td>{item.description}</td>
									<td>{item.category}</td>
									<td>${item.price}</td>
								</tr>
							))}
						</tbody>
					</table>
				) : (
					<p>No items found</p>
				)
			) : null}
		</div>
	);

}

export default Dashboard;
