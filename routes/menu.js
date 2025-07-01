const express = require('express');
const router = express.Router({ mergeParams: true });
const db = require('../db');

router.get('/', async (req, res) => {
  try {
    const { restaurantId } = req.params;

    const [rows] = await db.query(
      'SELECT * FROM menu_items WHERE restaurant_id = ?',
      [restaurantId]
    );
    
    res.json(rows);
  } catch (err) {
    console.error('Error loading menu items:', err);
    res.status(500).json({ error: 'Failed to load menu items' });
  }
});

module.exports = router;