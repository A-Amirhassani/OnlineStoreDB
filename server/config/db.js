const mysql = require('mysql2/promise');

const db = mysql.createPool({
	user: 'root',
	host: 'localhost',
	password: 'root',
	database: 'loginsystem',
});

module.exports = db;
