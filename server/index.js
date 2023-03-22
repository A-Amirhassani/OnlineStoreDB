const express = require("express");
const app = express();
const mysql = require( "mysql2" );
const cors = require('cors');

app.use(express.json());
app.listen(3001, () => {
   console.log("running server");
} );
const db = mysql.createConnection({
   user: "root",
   host: "localhost",
   password: "root",
   database: "loginsystem",
} );

app.post( '/register', ( req, res ) =>
{
   const username = req.body.username;
   const password = req.body.password;
   db.execute(
     "INSERT INTO users (username, password) VALUES (?,?)",
     [username, password],
     (err, result)=> {
     console.log(err);
     }
   );
} );
app.use(
 cors({
 origin: ["http://localhost:3000"],
 methods: ["GET", "POST"],
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
