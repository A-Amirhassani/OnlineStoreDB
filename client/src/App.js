import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import React, { useState } from 'react';
import Login from './Login';
import Register from './Register';
import AddItemForm from './AddItemForm';
import Dashboard from './Dashboard';
import QueryResults from './QueryResults';

function App() {
	const [isAuthenticated, setIsAuthenticated] = useState(
		localStorage.getItem('isLoggedIn') === 'true'
	);

	return (
		<BrowserRouter>
			<Routes>
				<Route path="/" element={<Navigate to="/login" />} />
				<Route
					path="/login"
					element={<Login setIsAuthenticated={setIsAuthenticated} />}
				/>
				<Route path="/register" element={<Register />} />
				{isAuthenticated ? (
					<Route path="/dashboard" element={<Dashboard />} />
				) : null}

				<Route path="/add-item" element={<AddItemForm />} />
				<Route path="/query-results" element={QueryResults} />

				<Route path="*" element={<Navigate to="/login" />} />
			</Routes>
		</BrowserRouter>
	);
}

export default App;
