import axios from 'axios';
import React, { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import './Dashboard.css';
import Logout from './Logout';
import ReviewForm from './ReviewForm';

function Dashboard() {
	const navigate = useNavigate();
	const navigateRef = useRef(navigate);
	const [items, setItems] = useState([]);
	const [searchTerm, setSearchTerm] = useState('');
	const [searched, setSearched] = useState(false);
	const [selectedItem, setSelectedItem] = useState(null);

	const handleSearchChange = (event) => {
		setSearchTerm(event.target.value);
	};

	const handleSearchSubmit = (event) => {
		event.preventDefault();
		filterItems(searchTerm);
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
				console.log(res.data);
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
	const handleItemSelected = (item) => {
		if (item.owner_username === localStorage.getItem('username')) {
			toast.error("You can't write a review for your own item.");
		} else {
			setSelectedItem(item);
		}
	};

	function DropdownContent({ show, item, onCancel }) {
		if (!show) {
			return null;
		}

		return (
			<div className="dropdown-content">
				<ReviewForm item={item} onCancel={onCancel} />
			</div>
		);
	}

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
								<th>Write Review</th>
							</tr>
						</thead>
						<tbody>
							{items.map((item, index) => (
								<tr key={index}>
									<td>{item.title}</td>
									<td>{item.description}</td>
									<td>{item.category}</td>
									<td>${item.price}</td>
									<td>
										<button
											onClick={(e) => {
												e.stopPropagation();
												handleItemSelected(item);
											}}>
											Write Review
										</button>
										<DropdownContent
											show={selectedItem === item}
											item={item}
											onCancel={() => setSelectedItem(null)}
										/>
									</td>
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
