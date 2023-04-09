const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();

app.use(cors());
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
app.use(
	cors({
		origin: ['http://localhost:3000/'],
		methods: ['GET', 'POST'],
		credentials: true,
	})
);
app.post('/login', (req, res) => {
	const username = req.body.username;
	const password = req.body.password;

	db.execute(
		'SELECT * FROM users WHERE username = ? AND password = ?',
		[username, password],
		(err, result) => {
			if (err) {
				res.send({ err: err });
			}

			if (result.length > 0) {
				res.send(result);
			} else {
				res.send({ message: 'Wrong username/password combination!' });
			}
		}
	);
});
<<<<<<< Updated upstream
=======

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
	if (!req.session.user) {
		res.status(401).send('User not authenticated');
		return;
	}

	const username = req.session.user.username;
	console.log(`User ${username} is attempting to add an item`);
	const today = new Date().toISOString().slice(0, 10);

	db.execute(
		'SELECT COUNT(id) as itemCount FROM items WHERE username = ? and cast(items.post_date as date) = cast(current_date() as date)',
		[username],
		(err, result) => {
			if (err) {
				console.error(err);
				res.status(500).send('Internal Server Error');
				return;
			}
			console.log(result);

			// SELECT COUNT(id) as itemCount 
			// FROM loginsystem.items 
			// WHERE username = 'torricojaime1' 
			// and cast(items.post_date as date) = cast(current_date()  as date)


			 const count = result[0].itemCount;
				if (count >= 3) {
					res
						.status(429)
						.json({ message: 'You can only add up to 3 items per day.' });
					return;
				}

			if (result[0].itemCount >= 3) {
				res.status(400).send('You can only add 3 items per day');
				return;
			}

			const newItem = req.body;
			const title = newItem.title;
			const description = newItem.description || null;
			const category = newItem.category || null;
			const price = newItem.price || null;

			db.execute(
				'INSERT INTO items (username, title, description, category, price) VALUES (?, ?, ?, ?, ?)',
				[username, title, description, category, price],
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
						};
						res.status(201).json(savedItem);
					}
				}
			);
		}
	);
});


app.get('/api/items', (req, res) => {
	db.execute('SELECT * FROM loginsystem.items', (err, result) => {
		if (err) {
			console.error(err);
			return res.status(500).json({ error: err });
		}

		// console.log(result); // Comment out or remove this line

		for (var i = 0; i < result.length; i++) {
			tuple = JSON.stringify(result[i]);
			obj = JSON.parse(tuple);

			// Comment out or remove the following lines
			// console.log('Username: ' + obj.username);
			// console.log('Title: ' + obj.title);
			// console.log('Description: ' + obj.description);
			// console.log('Price: ' + obj.price);
			// console.log(' ');
		}

		return res.json(result);
	});
});



>>>>>>> Stashed changes
