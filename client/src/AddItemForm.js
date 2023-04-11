import axios from 'axios';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Logout from './Logout';
import './AddItemForm.css';

const API_URL = 'http://localhost:3001/api/items';

function AddItemForm() {
	const navigate = useNavigate();
	const [title, setTitle] = useState('');
	const [description, setDescription] = useState('');
	const [category, setCategory] = useState('');
	const [ price, setPrice ] = useState( '' );
	
	const allFieldsFilled = () => {
		return title && description && category && price;
	};


const handleSubmit = (event) => {
	event.preventDefault();

	const now = new Date();
	const today = now.toISOString().substring(0, 10);

	const newItem = {
		title,
		description,
		category,
		price,
		post_date: today,
	};

	axios
		.post(API_URL, newItem, { withCredentials: true })
		.then((response) => {
			const item_id = response.data.id;
			const categoriesArray = category.split(',').map((cat) => cat.trim());

			axios
				.post(
					'http://localhost:3001/api/item-categories',
					{ item_id, categories: categoriesArray },
					{ withCredentials: true }
				)
				.then(() => {
					navigate('/dashboard');
				})
				.catch((error) => {
					console.log(error);
					toast.error(
						'Sorry, an error occurred while trying to add categories for your item.'
					);
				});
		})
		.catch((error) => {
			console.log(error);
			console.log(error.response);
			if (error.response && error.response.status === 429) {
				toast.error(error.response.data.message);
			} else {
				toast.error('Sorry, an error occurred while trying to add your item.');
			}
		});
};

	const handleDashboard = () => {
		navigate('/Dashboard');
	};
	return (
		<div className="add-item-form">
			<ToastContainer />
			<button onClick={handleDashboard}>Dashboard</button>
			<Logout />
			<h2>Add Item Form</h2>
			<form onSubmit={handleSubmit}>
				<div>
					<label htmlFor="title">Title:</label>
					<input
						type="text"
						id="title"
						value={title}
						onChange={(event) => setTitle(event.target.value)}
					/>
				</div>
				<div>
					<label htmlFor="description">Description:</label>
					<textarea
						id="description"
						value={description}
						onChange={(event) => setDescription(event.target.value)}
					/>
				</div>
				<div>
					<label htmlFor="category">Category:</label>
					<input
						type="text"
						id="category"
						value={category}
						onChange={(event) => setCategory(event.target.value)}
					/>
				</div>
				<div>
					<label htmlFor="price">Price:</label>
					<input
						type="number"
						id="price"
						value={price}
						onChange={(event) => setPrice(event.target.value)}
						step="0.01"
					/>
				</div>
				<button type="submit" disabled={!allFieldsFilled()}>
					Submit
				</button>
			</form>
		</div>
	);
}

export default AddItemForm;
