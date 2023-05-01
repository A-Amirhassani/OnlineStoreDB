import React, { useState } from 'react';
import axios from 'axios';

function Option1() {
	const [results, setResults] = useState([]);
	const [visible, setVisible] = useState(false);

	const getMostExpensiveItems = async () => {
		try {
			const res = await axios.get(
				'http://localhost:3001/api/items/most-expensive'
			);
			setResults(res.data);
			setVisible(true);
		} catch (error) {
			console.error(error);
		}
	};

	const handleClose = () => {
		setVisible(false);
	};

	return (
		<div>
			<button onClick={getMostExpensiveItems}>
				1.Get Most Expensive Items in Each Category
			</button>
			{visible && (
				<div className="results-container">
					<button className="close-button" onClick={handleClose}>
						X
					</button>
					<table className="results-table">
						<thead>
							<tr>
								<th>Category</th>
								<th>Price</th>
							</tr>
						</thead>
						<tbody>
							{results.map((result, index) => (
								<tr key={index}>
									<td>{result.category}</td>
									<td>${result.price}</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
			)}
		</div>
	);
}

export default Option1;
