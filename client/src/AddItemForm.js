import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';


const API_URL = 'http://localhost:3001/api/items';

function AddItemForm() {
	const navigate = useNavigate();
	const [numItemsPostedToday, setNumItemsPostedToday] = useState(0);
	// const [ id, setId ] = useState( 0 );
	// const [lastPostedDate, setLastPostedDate] = useState(null);
	const [title, setTitle] = useState('');
	const [description, setDescription] = useState('');
	const [category, setCategory] = useState('');
	const [price, setPrice] = useState('');
	const username = localStorage.getItem('username');

	useEffect(() => {
		const today = new Date().toISOString().slice(0, 10);

		axios
			.get(API_URL, {
				params: {
					post_date: today,
				},
			})
			.then((response) => {
				setNumItemsPostedToday(response.data.length);
			})
			.catch((error) => {
				console.log(error);
			});
	}, []);

	const handleSubmit = (event) => {
		event.preventDefault();

		const now = new Date();
		const today = now.toISOString().substring(0, 10);

		axios.get(API_URL).then((response) => {
			const itemsPostedToday = response.data.filter(
				(item) => item.post_date === today
			);

			if (itemsPostedToday.length >= 3) {
				alert(
					'You have already posted 3 items today. Please try again tomorrow.'
				);
				return;
			}

			const newItem = {
				title,
				description,
				category,
				price,
				post_date: today,
				username,
			};

			axios
				.post('http://localhost:3001/api/items', newItem)
				.then((response) => {
					setNumItemsPostedToday(numItemsPostedToday + 1);
					console.log('numItemsPostedToday:', numItemsPostedToday);
					navigate('/dashboard');
				})
				.catch((error) => {
					console.log(error);
				});
		});
	};

	//  console.log('lastPostedDate:', lastPostedDate);
	console.log('numItemsPostedToday:', numItemsPostedToday);

	return (
		<div>
			<h2>Add Item Form</h2>
			{numItemsPostedToday >= 3 ? (
				<p>You have already posted 3 items today. Please try again tomorrow.</p>
			) : (
				<>
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
								type="text"
								id="price"
								value={price}
								onChange={(event) => setPrice(event.target.value)}
							/>
						</div>
						<button type="submit">Submit</button>
					</form>
				</>
			)}
		</div>
	);
}

export default AddItemForm;
