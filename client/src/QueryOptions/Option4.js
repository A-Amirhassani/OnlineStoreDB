import React, { useState } from 'react';
import axios from 'axios';
import './CloseButton.css';

function Option4() {
	const [results, setResults] = useState([]);
	const [visible, setVisible] = useState(false);

	const getTopUsersSinceDate = async () => {
		try {
			const res = await axios.get(
				'http://localhost:3001/api/users/mostItemsPosted'
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
			<h3>
				4.Users with most posts since 5/1/2020 (inclusive) with tie-break.
			</h3>
			<button onClick={getTopUsersSinceDate}>
				List Users with Most Items Posted Since 5/1/2020
			</button>
			{visible && (
				<div>
					<button className="close-button" onClick={handleClose}>
						X
					</button>
					<table>
						<thead>
							<tr>
								<th>Username</th>
							</tr>
						</thead>
						<tbody>
							{results.map((result, index) => (
								<tr key={index}>
									<td>{result.vendors}</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
			)}
		</div>
	);
}

export default Option4;
