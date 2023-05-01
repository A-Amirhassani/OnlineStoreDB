import React, { useState, useEffect } from 'react';
import axios from 'axios';

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

	return (
		<div>
			<h3>7. Users who never posted a "poor" review</h3>
			<button onClick={getUsersWhoNeverPostedPoorReview}>
				Get Users who never posted a "poor" review
			</button>
			{visible && (
				<div>
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
