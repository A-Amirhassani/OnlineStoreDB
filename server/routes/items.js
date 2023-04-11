const express = require('express');
const router = express.Router();
const db = require('../config/db');

router.get('/search', async (req, res) => {
	try {
		const { category } = req.query;
		const searchString = '%' + category.toLowerCase() + '%';
		const [rows] = await db.query(
			`SELECT items.*
       FROM items
       JOIN item_categories ON items.id = item_categories.item_id
       WHERE LOWER(item_categories.category) LIKE ?`,
			[searchString]
		);
		res.json(rows);
	} catch (err) {
		console.error(err);
		res.status(500).send('Server error');
	}
});

module.exports = router;
