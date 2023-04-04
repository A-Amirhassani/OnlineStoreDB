import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function AddItemForm() {
	const navigate = useNavigate();

	const [title, setTitle] = useState('');
	const [description, setDescription] = useState('');
	const [category, setCategory] = useState('');
	const [price, setPrice] = useState('');

	const handleSubmit = (event) => {
		event.preventDefault();
		// insert item into database here
		navigate('/');
	};

	return (
		<div>
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
						type="text"
						id="price"
						value={price}
						onChange={(event) => setPrice(event.target.value)}
					/>
				</div>
				<button type="submit">Submit</button>
			</form>
			
		</div>
	);
}

export default AddItemForm;
