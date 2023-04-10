const express = require('express');
const router = express.Router();
const db = require('../config/db'); // Update this with the path to your database configuration

// Create a review
router.post('/', async (req, res) => {
	const { item_id, rating, description, username } = req.body;

	// Check if the user is the owner of the item
	const itemOwnerQuery = `
        SELECT owner_username FROM items
        WHERE id = ?
    `;

	const [[itemOwnerResult]] = await db.query(itemOwnerQuery, [item_id]);

	if (itemOwnerResult.owner_username === username) {
		return res.status(400).send('You cannot write a review for your own item.');
	}

	// Check if the user has already submitted 3 reviews in a day
	const reviewCountQuery = `
    SELECT COUNT(*) as review_count
    FROM reviews
    WHERE username = ? AND DATE(review_date) = CURDATE()
  `;

	const [[reviewCountResult]] = await db.query(reviewCountQuery, [username]);

	if (reviewCountResult.review_count >= 3) {
		return res.status(400).send('You have already submitted 3 reviews today.');
	}

	// Insert the new review into the database
	const insertReviewQuery = `
    INSERT INTO reviews (item_id, rating, description, review_date, username)
    VALUES (?, ?, ?, NOW(), ?)
  `;

	try {
		const [insertResult] = await db.query(insertReviewQuery, [
			item_id,
			rating,
			description,
			username,
		]);
		res.status(201).send('Review submitted successfully.');
	} catch (error) {
		console.error('Error inserting review:', error);
		res.status(500).send('Error submitting review.');
	}
});

// Fetch reviews by item_id
router.get('/:item_id', async (req, res) => {
	const { item_id } = req.params;

	const getReviewsQuery = `
    SELECT * FROM reviews
    WHERE item_id = ?
    ORDER BY review_date DESC
  `;

	try {
		const [reviews] = await db.query(getReviewsQuery, [item_id]);
		res.status(200).json(reviews);
	} catch (error) {
		console.error('Error fetching reviews:', error);
		res.status(500).send('Error fetching reviews.');
	}
});

module.exports = router;
