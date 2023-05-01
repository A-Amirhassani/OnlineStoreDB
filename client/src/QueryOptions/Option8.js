import React, { useState } from 'react';
import axios from 'axios';
import './CloseButton.css';

function Option8() {
	const [users, setUsers] = useState([]);
	const [visible, setVisible] = useState(false);

	const getUsersWithOnlyPoorReviews = async () => {
		try {
			const res = await axios.get(
				'http://localhost:3001/api/users/phase_3_number_8'
			);
			setUsers(res.data);
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
			<h3>8. Users who posted some reviews, but each of them is "poor"</h3>
			<button onClick={getUsersWithOnlyPoorReviews}>
				Get Users with only "poor" reviews
			</button>
			{visible && (
				<div>
					<button className="close-button" onClick={handleCloseResults}>
						
					</button>
					<table>
						<thead>
							<tr>
								<th>Username</th>
							</tr>
						</thead>
						<tbody>
							{users.map((user, index) => (
								<tr key={index}>
									<td>{user.username}</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
			)}
		</div>
	);
}

export default Option8;
