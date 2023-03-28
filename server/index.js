const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const bcrypt = require('bcrypt');

const app = express();

// app.use(cors());
app.use(
	cors({
		origin: ['http://localhost:3000'],
		methods: ['GET', 'POST'],
		credentials: true,
	})
);
app.use(express.json());

const db = mysql.createConnection({
	user: 'root',
	host: 'localhost',
	password: 'Comp{440}2023',
	database: 'loginsystem',
});
db.connect((err) => {
	if (err) throw err;
	console.log('Connected!');
});

app.listen(3001, () => {
	console.log('running server');
});

app.post('/register', (req, res) => {
	const username = req.body.username;
	const password = req.body.password;
	const firstName = req.body.firstName;
	const lastName = req.body.lastName;
	const email = req.body.email;
	db.execute(
		'INSERT INTO users (username, password, firstName, lastName, email) VALUES (?,?,?,?,?)',
		[username, password, firstName, lastName, email],
		(err, result) => {
			console.log(err);
		}
	);
});

app.post('/login', (req, res) => {
	const username = req.body.username;
	const password = req.body.password;

	db.execute(
		'SELECT * FROM users WHERE username = ?',
		[username],
		(err, results) => {
			if (err) {
				res.status(500).send({ message: 'Server error' });
			} else if (results.length === 0) {
				res
					.status(401)
					.send({ message: 'Wrong username/password combination!' });
			} else {
				const user = results[0];
				bcrypt.compare(password, user.password, (err, result) => {
					if (err) {
						res.status(500).send({ message: 'Server error' });
					} else if (result) {
						res.send(user);
					} else {
						res
							.status(401)
							.send({ message: 'Wrong username/password combination!' });
					}
				});
			}
		}
	);
});
app.post('/initializeDB', (req, res) => {
	db.execute('DROP TABLE IF EXISTS `classroom`')
	db.execute(
		'CREATE TABLE IF NOT EXISTS loginsystem.classroom (' +
			'building VARCHAR(15),' +
			'room_number VARCHAR(7),' +
			'capacity NUMERIC(4,0)' +
			')',
		(err, result) => {
			if (err) {
				console.error(err);
				res.status(500).send('Error initializing table');
			} else {
				// res.send('Table initialized successfully');
				db.execute(
					'INSERT INTO classroom (building, room_number, capacity) VALUES (?, ?, ?), (?, ?, ?), (?, ?, ?), (?, ?, ?), (?, ?, ?)',
					[
						'Biology',
						'101',
						50,
						'Chemistry',
						'201',
						40,
						'Physics',
						'301',
						30,
						'Math',
						'401',
						20,
						'History',
						'501',
						10,
					],
					(err, result) => {
						if (err) {
							console.error(err);
							res.status(500).send('Error initializing table');
						} else {
							res.send('Table initialized successfully');
						}
					}
				);
			}
		}
	);
});
