const express = require('express');
// This is still required
const router = express.Router({ mergeParams: true });
const db = require('../db');

router.get('/', async (req, res) => {
  try {
    const { restaurantId } = req.params;

    const [rows] = await db.query(
      `SELECT DISTINCT mc.id, mc.name
       FROM menu_categories mc
       JOIN menu_items mi ON mc.id = mi.category_id
       WHERE mi.restaurant_id = ?`,
      [restaurantId]
    );

    res.json(rows);
  } catch (err) {
    console.error('Error loading categories:', err);
    res.status(500).json({ error: 'Failed to load categories' });
  }
});

module.exports = router;