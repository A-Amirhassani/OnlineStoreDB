const express = require('express');
const router = express.Router();
const db = require('../config/db');


// Phase 3 number 5
router.get('/favoritedByXAndY', async (req, res) => {
  // Users returned are favorited by both userX and userY
  // userX should be the first user chosen by the user
  const userX = req.query.userX;
  // UserY should be the second user chosen by the user
  const userY = req.query.userY;

  const sql = `select buyer1Favs.seller
          from
            (select seller 
            from favorite_users
            where buyer = ?) as buyer1Favs
          join 
            (select seller 
            from favorite_users
            where buyer = ?) as buyer2Favs
          on buyer1Favs.seller = buyer2Favs.seller `;
  const params = [userX, userY];

  try {
    const [result] = await db.query(sql, params);
    console.log('#5 Result', result); // Log the result
    return res.json(result);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: err });
  }
});


module.exports = router;