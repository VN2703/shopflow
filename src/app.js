const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const helmet = require('helmet');
require('express-async-errors');
const userRoutes = require('./routes/user.routes');
const productRoutes = require('./routes/product.routes'); 
const cartRoutes= require('./routes/cart.routes');
const orderRoutes=require('./routes/order.routes');


const app = express();

// Middlewares
app.use(helmet());
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/users',userRoutes);
app.use('/api/products', productRoutes); 
app.use('/api/cart',cartRoutes);
app.use('/api/order',orderRoutes);
// Health check route
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', message: 'Server is running' });
});

// Global error handler
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    success: false,
    message: err.message || 'Internal Server Error',
  });
});

module.exports = app;