const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const bcrypt = require('bcrypt');
const reviewsRoute = require('./routes/reviews');

const app = express();
const session = require('express-session');

const itemsRouter = require('./routes/items');
const usersRoutes = require('./routes/users');
const favoritesRouter = require('./routes/favorites');

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
app.use('/api/items', itemsRouter);
app.use('/api/reviews', reviewsRoute);
app.use('/api/users', usersRoutes);
app.use('/api/favorites', favoritesRouter);

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

const insertItemCategories = async (req, res, db) => {
	const { item_id, categories } = req.body;

	if (!Array.isArray(categories) || !item_id) {
		res.status(400).send('Invalid request data');
		return;
	}

	try {
		for (const category of categories) {
			await db
				.promise()
				.execute(
					'INSERT INTO item_categories (category, item_id) VALUES (?, ?)',
					[category, item_id]
				);
		}
		res.status(201).send('Categories added successfully');
	} catch (err) {
		console.error(err);
		res.status(500).send('Error inserting categories');
	}
};

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
						console.log('User object stored in session:', req.session.user); // Add this line
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
	console.log('Session:', req.session);
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
	console.log('Received request to /api/items');

	if (!req.session.user) {
		console.log('User not authenticated');
		res.status(401).send('User not authenticated');
		return;
	}

	const username = req.session.user.username;
	console.log(`User ${username} is attempting to add an item`);
	console.log(`User ${username} is attempting to add an item`);
	const today = new Date().toISOString().slice(0, 10);

	db.execute(
		'SELECT COUNT(id) as itemCount FROM items WHERE owner_username = ? and cast(items.post_date as date) = cast(current_date() as date)',
		[username],
		(err, result) => {
			if (err) {
				console.error(err);
				res.status(500).send('Internal Server Error');
				return;
			}
			console.log(result);

			const count = result[0].itemCount;
			console.log(`Item count for ${username} today: ${count}`);
			if (count >= 3) {
				res
					.status(429)
					.json({ message: 'You can only add up to 3 items per day.' });
				return;
			}

			const newItem = req.body;
			const title = newItem.title;
			const description = newItem.description || null;
			const category = newItem.category || null;
			const price = newItem.price || null;

			console.log('Inserting:', {
				owner_username: username,
				title,
				description,
				category,
				price,
			});
			// Update this line

			db.execute(
				'INSERT INTO items (owner_username, title, description, category, price) VALUES (?, ?, ?, ?, ?)',
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
	const sql = `SELECT items.id, items.owner_username, items.title, items.description, items.price, 
       GROUP_CONCAT(item_categories.category) as categories
       FROM loginsystem.items 
       LEFT JOIN loginsystem.item_categories ON items.id = item_categories.item_id
       GROUP BY items.id`;

	db.query(sql, (err, result) => {
		if (err) {
			console.error(err);
			return res.status(500).json({ error: err });
		}
		// console.log('Items:', result); // Log the result
		return res.json(result);
	});
});

app.post('/api/item-categories', (req, res) =>
	insertItemCategories(req, res, db)
);
// const insertItemCategories = async (req, res, db) => {
// 	const { item_id, categories } = req.body;

// 	if (!Array.isArray(categories) || !item_id) {
// 		res.status(400).send('Invalid request data');
// 		return;
// 	}

// 	try {
// 		for (const category of categories) {
// 			await db
// 				.promise()
// 				.execute(
// 					'INSERT INTO item_categories (category, item_id) VALUES (?, ?)',
// 					[category, item_id]
// 				);
// 		}
// 		res.status(201).send('Categories added successfully');
// 	} catch (err) {
// 		console.error(err);
// 		res.status(500).send('Error inserting categories');
// 	}
// };
