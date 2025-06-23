const express = require('express');
const cors = require('cors');
const app = express();
require('dotenv').config();

const menuRoutes = require('./routes/menu')
const orderRoutes = require('./routes/orders')
const categoryRoutes = require('./routes/categories')

app.use(cors())
app.use(express.json())

app.use('/api/menu', menuRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/category', categoryRoutes);

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});