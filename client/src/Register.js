import Axios from 'axios';
import React, { useState } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function Register() {
	const [usernameReg, setUernameReg] = useState('');
	const [passwordReg, setPasswordReg] = useState('');
  const [ registerStatus, setRegisterStatus ] = useState( '' );
  
  const [firstNameReg, setFirstNameReg] = useState('');
	const [lastNameReg, setLastNameReg] = useState('');
	const [emailReg, setEmailReg] = useState('');

	const register = () => {
		Axios.post('http://localhost:3001/register', {
			username: usernameReg,
			password: passwordReg,

			firstName: firstNameReg,
			lastName: lastNameReg,
			email: emailReg,
		})
			.then((response) => {
				console.log('register response:', response);
				console.log('register data:', response.data);
				setRegisterStatus(response.data);
				toast.success('Registered successfully!');
			})
			.catch((error) => {
				console.log('register error:', error);
				setRegisterStatus('Error registering user.');
			});
	};

	return (
		<div className="registration">
			<h1>Registration</h1>
			<label>Username</label>
			<input
				type="text"
				name="username"
				onChange={(e) => {
					setUernameReg(e.target.value);
				}}
			/>
			<br />
			<label>password</label>
			<input
				type="text"
				onChange={(e) => {
					setPasswordReg(e.target.value);
				}}
			/>
			<br />
			<label>First Name</label>
			<input
				type="text"
				onChange={(e) => {
					setFirstNameReg(e.target.value);
				}}
			/>
			<br />
			<label>Last Name</label>
			<input
				type="text"
				onChange={(e) => {
					setLastNameReg(e.target.value);
				}}
			/>
			<br />
			<label>Email</label>
			<input
				type="text"
				onChange={(e) => {
					setEmailReg(e.target.value);
				}}
			/>
			<br />
			<button onClick={register}> Register</button>
			<h1>{registerStatus}</h1>
		</div>
	);
}

export default Register;
