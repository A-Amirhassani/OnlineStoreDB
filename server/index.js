const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const bcrypt = require('bcrypt');

const app = express();
const session = require('express-session');

// app.use(cors());
app.use(
	cors({
		origin: ['http://localhost:3000'],
		methods: ['GET', 'POST'],
		credentials: true,
	})
);
app.use(express.json());

app.use(
	session({
		secret: 'your-secret-key',
		resave: false,
		saveUninitialized: false,
		cookie: {
			httpOnly: true,
			maxAge: 1000 * 60 * 60 * 24, // 1 day
		},
	})
);

const db = mysql.createConnection({
	user: 'root',
	host: 'localhost',
	password: 'root',
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
						// Store user object in session
						req.session.user = user;
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

app.get('/me', (req, res) => {
	if (req.session.user) {
		res.send(req.session.user);
	} else {
		res.status(401).send({ message: 'Not authenticated' });
	}
});

app.post('/initializeDB', (req, res) => {
	db.execute('DROP TABLE IF EXISTS `classroom`');
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

app.post('/logout', (req, res) => {
	try {
		res.clearCookie('sessionId');
		// additional session data clearing code here if needed
		req.session.destroy(); // destroy the session
		res.sendStatus(200);
	} catch (error) {
		console.error('Error clearing session data:', error);
		res.sendStatus(500);
	}
});

app.get('/', (req, res) => {
	res.send('Server is running');
});

app.get('/api/items/nextId', (req, res) => {
	const sql =
		'SELECT AUTO_INCREMENT AS nextId FROM information_schema.TABLES WHERE TABLE_SCHEMA = ? AND TABLE_NAME = ?';

	const params = ['loginsystem', 'items'];
	db.query(sql, params, (err, result) => {
		if (err) {
			console.log(err);
			res.status(500).send('Error fetching next ID');
			return;
		}

		// Convert the result to an array
		const nextId = Array.from(result, (row) => row.nextId);

		res.send(nextId);
	});
});

app.post('/api/items', (req, res) => {
	const newItem = req.body;
	const title = newItem.title;
	const description = newItem.description || null;
	const category = newItem.category || null;
	const price = newItem.price || null;
	const username = newItem.username || null;

	db.execute(
		'INSERT INTO items (title, description, category, price, username) VALUES (?, ?, ?, ?, ?)',
		[title, description, category, price, username],
		(err, result) => {
			if (err) {
				console.error(err);
				res.status(500).send('Internal Server Error');
			} else {
				console.log(result);
				const savedItem = {
					id: result.insertId,
					title,
					description,
					category,
					price,
					post_date: new Date().toISOString(),
					username,
				};
				res.status(201).json(savedItem);
			}
		}
	);
});

app.get('/api/items', (req, res) => {
	const postDate = req.query.post_date;

	const sql = 'SELECT * FROM items WHERE post_date = ?';
	const params = [postDate];

	db.query(sql, params, (err, result) => {
		if (err) {
			console.log(err);
			res.status(500).send('Error fetching items');
			return;
		}

		res.send(result);
	});
});

