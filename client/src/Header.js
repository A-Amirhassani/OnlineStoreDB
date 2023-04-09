import React from 'react';
import { Link } from 'react-router-dom';
import Logout from './Logout';
import './Header.css';

function Header() {
	return (
		<header>
			<nav>
				<ul>
					<li>
						<Link to="/dashboard">Dashboard</Link>
					</li>
					<li>
						<Link to="/add-item">Add Item</Link>
					</li>
					<li>
						<Logout />
					</li>
				</ul>
			</nav>
		</header>
	);
}

export default Header;
