import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './CloseButton.css';

function Option5() {
	const [users, setUsers] = useState([]);
	const [userX, setUserX] = useState('');
	const [userY, setUserY] = useState('');
	const [results, setResults] = useState([]);
	const [visible, setVisible] = useState(false);

	useEffect(() => {
		const fetchUsers = async () => {
			try {
				const res = await axios.get('http://localhost:3001/api/users');
				setUsers(res.data);
			} catch (error) {
				console.error(error);
			}
		};

		fetchUsers();
	}, []);

	const getUsersFavoritedByBoth = async () => {
		try {
			const res = await axios.get(
				`http://localhost:3001/api/favorites/favoritedByXAndY?userX=${userX}&userY=${userY}`
			);
			setResults(res.data);
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
			<h3>5.List users favorited by both User X and User Y</h3>
			<label htmlFor="userX">Select User X:</label>
			<select
				id="userX"
				value={userX}
				onChange={(e) => setUserX(e.target.value)}>
				<option value="">--Select User X--</option>
				{users.map((user, index) => (
					<option key={index} value={user.username}>
						{user.username}
					</option>
				))}
			</select>

			<label htmlFor="userY">Select User Y:</label>
			<select
				id="userY"
				value={userY}
				onChange={(e) => setUserY(e.target.value)}>
				<option value="">--Select User Y--</option>
				{users.map((user, index) => (
					<option key={index} value={user.username}>
						{user.username}
					</option>
				))}
			</select>

			<button onClick={getUsersFavoritedByBoth}>
				List Users Favorited by Both User X and User Y
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
							{results.map((result, index) => (
								<tr key={index}>
									<td>{result.seller}</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
			)}
		</div>
	);
}

export default Option5;
