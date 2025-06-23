const express = require('express');
const router = express.Router();
const db = require('../db');

router.get('/', async (req, res) => {
  try{

    const [rows] = await  db.query('SELECT * FROM menu_items');
    res.json(rows);
  }
  catch (err) {
    console.error('Error loading meny:', err);
    res.status(500).json({ error: 'Failed to menu items' });
  }
});

module.exports = router;


