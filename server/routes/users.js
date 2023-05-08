const express = require('express');
const router = express.Router();
const db = require('../config/db');



// Fetch all users
router.get('/', async (req, res) => {
  const sql = 'SELECT username FROM users';

  try {
    const [result] = await db.query(sql);
    return res.json(result);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: err });
  }
});



//Phase 3 number 2
router.get('/sameDayItems', async (req, res) => {
	console.log('Inside /api/users/sameDayItems route');

	  const categ1 = req.query.category1 || '';
		const categ2 = req.query.category2 || '';

	//add % needed for sql to work properly
	const category1 = '%' + categ1 + '%';
	const category2 = '%' + categ2 + '%';

	const sql = `select distinct a.owner_username 
            from items a, items b
            where a.category like ?
            and b.category like ?
            AND cast(a.post_date as date) = cast(b.post_date as date)
            and a.owner_username = b.owner_username
            and a.id != b.id
            `;

	const params = [category1, category2];

	try {
		const [result] = await db.query(sql, params);
		console.log('#2 Result', result);
		return res.json(result);
	} catch (err) {
		console.error(err);
		return res.status(500).json({ error: err });
	}
} );

// Phase 3 number 4
router.get('/mostItemsPosted', async (req, res) => {
  const sql = `select owner_username as vendors
          from (
            select owner_username, count(*) as count
              from loginsystem.items
              group by owner_username
            ) as topVendors
          where topVendors.count = (
            select max(count)
              from (
                select owner_username, count(*) as count
                from loginsystem.items
                group by owner_username
              ) as itemsCount
          )`;

  try {
    const [result] = await db.query(sql);
    console.log('#4 Result', result); // Log the result
    return res.json(result);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: err });
  }
} );

// Phase 3 number 6
router.get('/neverPostedExcellent', async (req, res) => {
  // Users that have never posted any excellent items
  const sql = `Select distinct owner_username
          from loginsystem.items 
          where items.owner_username not in
              (
              select items.owner_username
                  from
                      (select item_id, Count(*) as reviewCount
                      from reviews
                      where rating = 'excellent'
                      group by item_id
                      having reviewCount > 2) as excellentItems
              join items
              on excellentItems.item_id = items.id
              )`;

  try {
    const [result] = await db.query(sql);
    console.log('#6 Result', result); // Log the result
    return res.json(result);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: err });
  }
} );

//phase 3 number 7
router.get('/neverPostedPoorReview', async (req, res) => {
	//Users that have never posted a poor review
	const sql = `Select distinct username
				 from loginsystem.reviews
				 where reviews.username not in
					 (SELECT reviews.username 
					 FROM loginsystem.reviews
					 where reviews.rating = 'poor')`;
	try {
		const [result] = await db.query(sql);
		console.log('#7 Result', result); // Log the result
		return res.json(result);
	} catch (err) {
		console.error(err);
		return res.status(500).json({ error: err });
	}
} );


//phase 3 number 8
router.get('/phase_3_number_8', async (req, res) => {
	//Users that have only posted poor reviews
	const sql = `Select distinct username
				 FROM 
					 (SELECT distinct username
					 FROM loginsystem.reviews
					 where reviews.rating = 'poor'
					 ) as poorReviews
				 where poorReviews.username not in 
					 (SELECT distinct username
					 FROM loginsystem.reviews
					 where reviews.rating != 'poor')`;
	try {
		const [result] = await db.query(sql);
		console.log('#8 Result', result); // Log the result
		return res.json(result);
	} catch (err) {
		console.error(err);
		return res.status(500).json({ error: err });
	}
});


//phase 3 number 9
router.get('/phase_3_number_9', async (req, res) => {
	//Users that have never recieved poor reviews for items they have posted
	const sql = `select distinct owner_username
				 from loginsystem.items
				 where items.owner_username not in
					 (Select distinct owner_username as poorUsers
						 from loginsystem.items JOIN(
						 select distinct item_id as id
						 from loginsystem.reviews
						 where rating = 'poor') as poorReviewItems
						 on items.id = poorReviewItems.id)`;
		try {
			const [result] = await db.query(sql);
			console.log('#9 Result', result); // Log the result
			return res.json(result);
		} catch (err) {
			console.error(err);
			return res.status(500).json({ error: err });
		}
});


//phase 3 number 10
router.get('/phase_3_number_10', async (req, res) => {
	//Users that gave eachother excellent reviews for every single item they posted
	const sql = `Select distinct reviewer1, vendor1
	from (
		Select *
		from (SELECT r.rating as rating1, r.username as reviewer1, i.owner_username as vendor1
		FROM reviews as r
		left JOIN items as i
			on r.item_id = i.id
			where r.username != i.owner_username
		) as t1, 
		(SELECT r.rating as rating2, r.username as reviewer2, i.owner_username as vendor2
		FROM reviews as r
		JOIN items as i
		where r.item_id = i.id
		) as t2
		where t1.reviewer1 = t2.vendor2
		and t1.vendor1 = t2.reviewer2
		)as reviews1
	where reviews1.rating1 = 'excellent'
	and reviews1.rating2 = 'excellent'
	
	
	and (reviewer1, vendor1, reviewer2, vendor2) 
	not in (
		Select reviews1.reviewer1, reviews1.vendor1, reviews1.reviewer2, reviews1.vendor2
			from (
				Select *
				from (SELECT r.rating as rating1, r.username as reviewer1, i.owner_username as vendor1
					FROM reviews as r
					left JOIN items as i
					on r.item_id = i.id
					where r.username != i.owner_username
					and r.rating != 'excellent'
				)as t1, (SELECT r.rating as rating2, r.username as reviewer2, i.owner_username as vendor2
				FROM reviews as r
				JOIN items as i
				where r.item_id = i.id) as t2
			where t1.reviewer1 = t2.vendor2
			and t1.vendor1 = t2.reviewer2
			)as reviews1
	)
	and (reviewer2, vendor2, reviewer1, vendor1) 
	not in (
		Select reviews1.reviewer1, reviews1.vendor1, reviews1.reviewer2, reviews1.vendor2
			from (
				Select *
				from (SELECT r.rating as rating1, r.username as reviewer1, i.owner_username as vendor1
					FROM reviews as r
					left JOIN items as i
					on r.item_id = i.id
					where r.username != i.owner_username
					and r.rating != 'excellent'
				)as t1, (SELECT r.rating as rating2, r.username as reviewer2, i.owner_username as vendor2
				FROM reviews as r
				JOIN items as i
				where r.item_id = i.id) as t2
			where t1.reviewer1 = t2.vendor2
			and t1.vendor1 = t2.reviewer2
			)as reviews1
	)`;
	try {
		const [result] = await db.query(sql);
		console.log('#10 Result', result); // Log the result
		return res.json(result);
	} catch (err) {
		console.error(err);
		return res.status(500).json({ error: err });
	}
});





module.exports = router;
