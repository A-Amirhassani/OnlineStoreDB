import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';

function Logout() {
	const navigate = useNavigate();

	const handleLogout = () => {
		localStorage.removeItem('isLoggedIn');
		navigate('/login');
	};

	return (
		<div>
			<h2>Logout Page</h2>
			<p>Welcome, {localStorage.getItem('username')}!</p>
			<Link to="/add-item">Add Item</Link>
			<button onClick={handleLogout}>Logout</button>
		</div>
	);
}

export default Logout;
