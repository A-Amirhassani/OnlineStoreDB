import axios from 'axios';
import React, { useState } from 'react';
import './CloseButton.css';

function Option3() {
	const [results, setResults] = useState([]);
	const [showResults, setShowResults] = useState(false);
	const [vendorUsername, setVendorUsername] = useState('');

	const getItemsWithGoodExcellentReviews = async () => {
		try {
			const res = await axios.get(
				`http://localhost:3001/api/items/allGoodExcellentReviews?vendorUsername=${vendorUsername}`
			);
			setResults(res.data);
			setShowResults(true);
		} catch (error) {
			console.error(error);
		}
	};

	const handleCloseResults = () => {
		setShowResults(false);
	};

	const displayResults = () => {
		if (!showResults) {
			return null;
		}

		return results.map((result, index) => (
			<tr key={index}>
				<td>{result.itemID}</td>
				<td>{result.title}</td>
			</tr>
		));
	};

	return (
		<div>
			<h3>3. Items with only "Good" or "Excellent" reviews</h3>
			<label htmlFor="vendorUsername">Username:</label>
			<input
				type="text"
				id="vendorUsername"
				value={vendorUsername}
				onChange={(e) => setVendorUsername(e.target.value)}
			/>
			<button onClick={getItemsWithGoodExcellentReviews}>
				Get Items with Good or Excellent Reviews
			</button>
			{/* Display results here */}
			{showResults && (
				<div>
					<button className="close-button" onClick={handleCloseResults}>
						
					</button>
					<table className="results-table">
						<thead>
							<tr>
								<th>Item ID</th>
								<th>Title</th>
							</tr>
						</thead>
						<tbody>{displayResults()}</tbody>
					</table>
				</div>
			)}
		</div>
	);
}

export default Option3;
