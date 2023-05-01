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

router.get('/most-expensive', async (req, res) => {
	try {
		const sqlQuery = `
            SELECT ic.category, i.title, i.description, i.price
            FROM item_categories AS ic
            LEFT JOIN items AS i ON i.id = ic.item_id
            WHERE (ic.category, i.price) IN (
                SELECT ic2.category, MAX(i2.price)
                FROM items AS i2
                INNER JOIN item_categories AS ic2 ON i2.id = ic2.item_id
                GROUP BY ic2.category
            )
            ORDER BY ic.category;`;

		console.log('SQL Query:', sqlQuery); // Log the SQL query

		const [rows] = await db.query(sqlQuery);
		console.log('#1 Result', rows); // Log the result

		res.json(rows);
	} catch (err) {
		console.error(err);
		res.status(500).send('Server error');
	}
});

// Phase 3 number 3
router.get('/allGoodExcellentReviews', async (req, res) => {
	const vendorUsername = req.query.vendorUsername;

	const sql = `select distinct itemID, title
                from (
                    SELECT i.id as itemID, i.title, i.owner_username as vendor, r.username as buyer, r.rating
                    FROM items i JOIN reviews r
                    ON i.id = r.item_id
                    where i.owner_username = ?) as joinedReviews

                where joinedReviews.itemID NOT IN
                    (select i.id as itemID
                    from items i JOIN reviews r
                    on i.id = r.item_id
                    where r.rating in ('fair', 'poor'))`;
	const params = [vendorUsername];

	try {
		const [result] = await db.query(sql, params);
		console.log('#3 Result', result); // Log the result
		return res.json(result);
	} catch (err) {
		console.error(err);
		return res.status(500).json({ error: err });
	}
});

module.exports = router;
