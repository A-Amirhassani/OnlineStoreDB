import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './CloseButton.css';

function Option6() {
	const [users, setUsers] = useState([]);
	const [visible, setVisible] = useState(false);

	const getUsersWhoNeverPostedExcellent = async () => {
		try {
			const res = await axios.get(
				'http://localhost:3001/api/users/neverPostedExcellent'
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
			<h3>6. Users who never posted any "excellent" items</h3>
			<button onClick={getUsersWhoNeverPostedExcellent}>
				Get Users who never posted any "excellent" items
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

export default Option6;
