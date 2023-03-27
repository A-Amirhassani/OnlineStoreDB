import Axios from 'axios';
import bcrypt from 'bcryptjs'; //for hasing passwords
import React, { useEffect, useState } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function Register() {
	const [usernameReg, setUernameReg] = useState('');
	const [passwordReg, setPasswordReg] = useState('');
	const [confirmPassword, setConfirmPassword] = useState('');
	const [registerStatus, setRegisterStatus] = useState('');
	const [firstNameReg, setFirstNameReg] = useState('');
	const [lastNameReg, setLastNameReg] = useState('');
	const [emailReg, setEmailReg] = useState('');
	const [showPasswordError, setShowPasswordError] = useState(false);
	const [ passwordMatch, setPasswordMatch ] = useState( false );
	const [emailError, setEmailError] = useState('');

	const [passwordError, setPasswordError] = useState('');

	const checkPasswordStrength = () => {
		const passwordRegex =
			/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*])(?=.{8,})/;
		if (!passwordRegex.test(passwordReg)) {
			setPasswordError(
				'Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character'
			);
			return false;
		} else {
			setPasswordError('');
			return true;
		}
	};
	

	  const validateEmail = (email) => {
			const re = /\S+@\S+\.\S+/;
			return re.test(email);
		};

	useEffect(() => {
		setPasswordMatch(passwordReg === confirmPassword);

		if (
			passwordReg !== confirmPassword &&
			passwordReg !== '' &&
			confirmPassword !== ''
		) {
			setShowPasswordError(true);
		} else {
			setShowPasswordError(false);
		}
	}, [passwordReg, confirmPassword]);

	const register = () => {
		if (
			!usernameReg ||
			!passwordReg ||
			!confirmPassword ||
			!firstNameReg ||
			!lastNameReg ||
			!emailReg
		) {
			setRegisterStatus('Please fill out all fields.');
			return;
		}
		if (!passwordMatch) {
			setRegisterStatus('Password and confirm password do not match.');
			return;
		}
		if (!checkPasswordStrength()) {
			return;
		}
		if (!validateEmail(emailReg)) {
			setEmailError('Please enter a valid email address.');
			return;
		} else {
			setEmailError('');
		}

		// Generate a salt
		const salt = bcrypt.genSaltSync(10);
		// Hash the password using the generated salt
		const hashedPassword = bcrypt.hashSync(passwordReg, salt);
		setRegisterStatus('');

		Axios.post('http://localhost:3001/register', {
			username: usernameReg,
			password: hashedPassword,
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
		<>
			<ToastContainer />
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
					type="password"
					onChange={(e) => {
						setPasswordReg(e.target.value);
					}}
				/>
				{passwordError && <div className="error">{passwordError}</div>}
				<br />
				<label>confirm password</label>
				<input
					type="password"
					name="confirmPassword"
					onChange={(e) => {
						setConfirmPassword(e.target.value);
					}}
				/>
				{showPasswordError && (
					<p className="error">Password and confirm password do not match.</p>
				)}

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
						if (!validateEmail(e.target.value)) {
							setEmailError('Please enter a valid email address.');
						} else {
							setEmailError('');
						}
					}}
				/>
				<br />
				<button
					onClick={register}
					disabled={
						!passwordMatch ||
						!usernameReg ||
						!passwordReg ||
						!confirmPassword ||
						!firstNameReg ||
						!lastNameReg ||
						!emailReg
					}>
					Register
				</button>

				<h1>{registerStatus}</h1>
				<p>Already have an account?</p>
				<a href="/login">Login</a>
			</div>
		</>
	);
}

export default Register;
