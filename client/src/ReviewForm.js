import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

function ReviewForm({ item, onCancel, username }) {
	const [rating, setRating] = useState('excellent');
	const [description, setDescription] = useState('');

	const handleSubmit = async ( event ) =>
	{
		event.preventDefault();
		try
		{
			const response = await axios.post( 'http://localhost:3001/api/reviews', {
				rating,
				description,
				item_id: item.id,
				username: localStorage.getItem( 'username' ), // Add this line
			} );

			if ( response.data.success )
			{
				toast.success( 'Review submitted successfully' );
				onCancel();
			} else
			{
				toast.error( response.data.message );
			}
		} catch ( error )
		{
			console.error( error );
			toast.error( 'Error submitting review' );
		}
	}
       const isItemOwner = item.owner_username === username;

    if (isItemOwner) {
        return (
            <div>
                <p>You cannot write a review for your own item.</p>
                <button onClick={onCancel}>Close</button>
            </div>
        );
	};


	return (
		<div>
			<h3>Write a Review for {item.title}</h3>
			<form onSubmit={handleSubmit}>
				<label htmlFor="rating">Rating:</label>
				<select
					name="rating"
					value={rating}
					onChange={(event) => setRating(event.target.value)}>
					<option value="excellent">Excellent</option>
					<option value="good">Good</option>
					<option value="fair">Fair</option>
					<option value="poor">Poor</option>
				</select>
				<br />
				<label htmlFor="description">Description:</label>
				<textarea
					name="description"
					value={description}
					onChange={(event) => setDescription(event.target.value)}></textarea>
				<br />
				<button type="submit">Submit Review</button>
				<button type="button" onClick={onCancel}>
					Cancel
				</button>
			</form>
		</div>
	);
}

export default ReviewForm;
