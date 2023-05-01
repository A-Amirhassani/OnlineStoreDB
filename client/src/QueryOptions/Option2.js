import React, { useState } from 'react';
import axios from 'axios';

function Option2() {
	const [results, setResults] = useState([]);
	const [showResults, setShowResults] = useState(false);
	const [category1, setCategory1] = useState('');
	const [category2, setCategory2] = useState('');

	const getUsersWithSameDayItems = async () => {
		try {
			const res = await axios.get(
				`http://localhost:3001/api/users/sameDayItems?category1=${category1}&category2=${category2}`
			);
			setResults(res.data);
			setShowResults(true);
		} catch (error) {
			console.error(error);
		}
	};

	const displayResults = () => {
		if (!showResults) {
			return null;
		}

		return results.map((result, index) => (
			<tr key={index}>
				<td>{result.owner_username}</td>
			</tr>
		));
	};

	return (
		<div>
			<h3>2. Users who posted items in two categories on the same day</h3>
			<label htmlFor="category1">Category 1:</label>
			<input
				type="text"
				id="category1"
				value={category1}
				onChange={(e) => setCategory1(e.target.value)}
			/>
			<label htmlFor="category2">Category 2:</label>
			<input
				type="text"
				id="category2"
				value={category2}
				onChange={(e) => setCategory2(e.target.value)}
			/>
			<button onClick={getUsersWithSameDayItems}>
				Get Users with Same Day Items
			</button>
			{/* Display results here */}
			{displayResults()}
		</div>
	);
}

export default Option2;
