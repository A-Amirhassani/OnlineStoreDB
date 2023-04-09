import axios from 'axios';
import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import Logout from './Logout';

function Dashboard() {
    const navigate = useNavigate();

useEffect(() => {
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    if (!isLoggedIn) {
        navigate('/login');
    } else if (isLoggedIn && window.location.pathname === '/login') {
        navigate('/dashboard');
    }

    const handleBackButton = (event) => {
        event.preventDefault();
        window.history.forward();
    };

    window.addEventListener( 'popstate', handleBackButton );

    axios
			.get('http://localhost:3001/api/items')
			.then((res) => {
				console.log(res.data);
			})
			.catch((error) => {
				console.log('Error');
			});
    
  

    return () => {
        window.removeEventListener('popstate', handleBackButton);
    };
}, [navigate]);




    const handleAddItem = () => {
        navigate('/add-item');
    };

    return (
        <div>
            <h2>Welcome, {localStorage.getItem('username')}!</h2>
            <button onClick={handleAddItem}>Add Item</button>
            <Logout />
        </div>
    );
}

export default Dashboard;