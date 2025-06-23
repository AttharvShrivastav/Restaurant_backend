const express = require('express');
const router = express.Router();
const db = require('../db');

// POST /api/orders
router.post('/', async (req, res) => {
  const { table_number, items, total } = req.body;

  console.log(req.body)

  if (!table_number || !items || !total) {
    return res.status(400).json({ error: 'Missing order data' });
  }

  try {
    // Insert into orders table
    const [orderResult] = await db.query(
      `INSERT INTO orders 
        (customer_id, table_id, restaurant_id, total_amount, discount, tax, final_amount, order_status, payment_status, special_instructions) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        null,                    // customer_id
        table_number,            // table_id
        1,                       // restaurant_id (hardcoded for now)
        total,                   // total_amount
        0.00,                    // discount
        0.00,                    // tax
        total,                   // final_amount
        'pending',              // order_status
        'pending',              // payment_status
        ''                      // special_instructions
      ]
    );

    const orderId = orderResult.insertId;

    // Insert into order_items table
    for (const [itemId, quantity] of Object.entries(items)) {
      const [menuResult] = await db.query(
        'SELECT price FROM menu_items WHERE id = ?',
        [itemId]
      );
      const price = menuResult[0]?.price || 0;
      const total_price = price * quantity;

      await db.query(
        `INSERT INTO order_items 
         (order_id, menu_item_id, quantity, price, total_price, special_request) 
         VALUES (?, ?, ?, ?, ?, ?)`,
        [orderId, itemId, quantity, price, total_price, '']
      );
    }

    res.json({ success: true, order_id: orderId });
  } catch (error) {
    console.error('Order placement error:', error);
    res.status(500).json({ error: 'Failed to place order' });
  }
});

module.exports = router;

// GET /api/orders — fetch active orders
router.get('/', async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT o.id, o.table_id, o.total_amount AS total, GROUP_CONCAT(CONCAT(m.name, ':', oi.quantity)) AS items
      FROM orders o
      JOIN order_items oi ON o.id = oi.order_id
      JOIN menu_items m ON m.id = oi.menu_item_id
      WHERE o.order_status = 'pending'
      GROUP BY o.id
    `);

    const formatted = rows.map(row => ({
      id: row.id,
      table_id: row.table_id,
      total: row.total,
      items: row.items.split(',').map(entry => {
        const [name, qty] = entry.split(':');
        return { name, qty };
      })
    }));

    res.json(formatted);
  } catch (err) {
    console.error('Failed to fetch orders:', err);
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
});

// PATCH /api/orders/:id — mark an order as completed
router.patch('/:id', async (req, res) => {
  const { status } = req.body;
  try {
    await db.query('UPDATE orders SET order_status = ? WHERE id = ?', [status || 'completed', req.params.id]);
    res.json({ success: true });
  } catch (err) {
    console.error('Failed to update order status:', err);
    res.status(500).json({ error: 'Failed to update order status' });
  }
});
