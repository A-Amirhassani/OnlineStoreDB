import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';


const API_URL = '/api/items';

function AddItemForm() {
	const navigate = useNavigate();

  const [ numItemsPostedToday, setNumItemsPostedToday ] = useState( 0 );
  const [ id, setId ] = useState( 0 );
  
  const [lastPostedDate, setLastPostedDate] = useState(null);



	const [title, setTitle] = useState('');
	const [description, setDescription] = useState('');
	const [category, setCategory] = useState('');
  const [ price, setPrice ] = useState( '' );
  
  const fetchNextId = async () => {
		try {
			const response = await axios.get('/api/items/nextId');
			setId(response.data.nextId);
		} catch (error) {
			console.log(error);
		}
	};


	useEffect( () =>
  {
     fetchNextId();
 axios
		.get('API_URL')
		.then((response) => {
			const itemsPostedToday = response.data.filter(
				(item) => item.postedDate === new Date().toISOString().substring(0, 10)
			);
			setNumItemsPostedToday(itemsPostedToday.length);
		})
		.catch((error) => {
			console.log(error);
		});
}, [] );
		const handleSubmit = (event) => {
      event.preventDefault();
      
      const now = new Date();
			const today = now.toISOString().substring(0, 10);
			const lastPostedToday = lastPostedDate === today;

			if (lastPostedToday && numItemsPostedToday >= 3) {
				alert(
					'You have already posted 3 items today. Please try again tomorrow.'
				);
				return;
			}

			const newItem = {
				id,
				title,
				description,
				category,
				price,
				postedDate: today,
			};

			axios
				.post(API_URL, newItem)
				.then((response) => {
					setNumItemsPostedToday(numItemsPostedToday + 1);
					navigate('/');
				})
				.catch((error) => {
					console.log(error);
				});
		};

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
