// routes/category.js
const express = require('express');
const router = express.Router();
const db = require('../db');

router.get('/', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT id, name FROM menu_categories');
    res.json(rows);
  } catch (err) {
    console.error('Error loading categories:', err);
    res.status(500).json({ error: 'Failed to load categories' });
  }
});

module.exports = router;
