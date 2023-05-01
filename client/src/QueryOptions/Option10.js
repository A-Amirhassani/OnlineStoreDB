import React, { useState } from 'react';
import axios from 'axios';
import './CloseButton.css';

function Option10() {
	const [userPair, setUserPair] = useState([]);
	const [visible, setVisible] = useState(false);

	const getUserPairAlwaysExcellent = async () => {
		try {
			const res = await axios.get(
				'http://localhost:3001/api/users/phase_3_number_10'
			);
			setUserPair(res.data);
			setVisible(true);
		} catch (error) {
			console.error(error);
		}
	};

	const handleCloseResults = () => {
		setVisible(false);
	};

	return (
		<div>
			<h3>
				10. User pair (A, B) who always gave each other "excellent" reviews
			</h3>
			<button onClick={getUserPairAlwaysExcellent}>
				Get User Pair with Always Excellent Reviews
			</button>
			{visible && (
				<div>
					<button className="close-button" onClick={handleCloseResults}>
						
					</button>
					<table>
						<thead>
							<tr>
								<th>User A</th>
								<th>User B</th>
							</tr>
						</thead>
						<tbody>
							{userPair.map((pair, index) => (
								<tr key={index}>
									<td>{pair.reviewer1}</td>
									<td>{pair.vendor1}</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
			)}
		</div>
	);
}

export default Option10;
