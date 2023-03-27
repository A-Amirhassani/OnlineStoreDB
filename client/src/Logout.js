import { useNavigate } from 'react-router-dom';

function Logout() {
	const navigate = useNavigate();

	const handleLogout = () => {
		localStorage.removeItem('isLoggedIn');
		navigate('/login');
	};

	return (
		<div>
			<h2>Logout Page</h2>
			<p>Welcome{localStorage.getItem('username')}!</p>
			<button onClick={handleLogout}>Logout</button>
		</div>
	);
}

export default Logout;
