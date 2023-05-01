import axios from 'axios';
import React, { useState } from 'react';
import './CloseButton.css';

function Option9() {
	const [users, setUsers] = useState([]);
	const [visible, setVisible] = useState(false);

	const getUsersWithNoPoorReviews = async () => {
		try {
			const res = await axios.get(
				'http://localhost:3001/api/users/phase_3_number_9'
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
			<h3>9. Users whose items never received any "poor" reviews</h3>
			<button onClick={getUsersWithNoPoorReviews}>
				Get Users with no "poor" reviews
			</button>
			{visible && (
				<div>
					<button className="close-button" onClick={handleCloseResults}>
						X
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
									<td>{user.owner_username}</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
			)}
		</div>
	);
}

export default Option9;
