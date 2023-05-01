import React, { useState } from 'react';
import axios from 'axios';
import './CloseButton.css';

function Option7() {
	const [users, setUsers] = useState([]);
	const [visible, setVisible] = useState(false);

	const getUsersWhoNeverPostedPoorReview = async () => {
		try {
			const res = await axios.get(
				'http://localhost:3001/api/users/neverPostedPoorReview'
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
			<h3>7. Users who never posted a "poor" review</h3>
			<button onClick={getUsersWhoNeverPostedPoorReview}>
				Get Users who never posted a "poor" review
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

export default Option7;
