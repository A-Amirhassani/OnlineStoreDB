import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import React, { useState } from 'react';
import Login from './Login';
import Register from './Register';
import Logout from './Logout';
import AddItemForm from './AddItemForm';

function App() {
	const [isAuthenticated, setIsAuthenticated] = useState(false);

	return (
		<BrowserRouter>
			<Routes>
				<Route path="/" element={<Navigate to="/login" />} />
				<Route
					path="/login"
					element={<Login setIsAuthenticated={setIsAuthenticated} />}
				/>
				<Route path="/register" element={<Register />} />
				<Route path="/logout" element={<Logout />} />
				<Route path="/add-item" element={<AddItemForm />} />
				
			</Routes>
		</BrowserRouter>
	);
}

export default App;
