const express = require('express');
const {
  addProduct,
  getProducts,
  getProduct,
  updateProductById,
  deleteProductById,
} = require('../controllers/product.controller');
const {
  protect,
  isAdmin,
  isAdminOrManager,
} = require('../middlewares/auth.middleware');

const router = express.Router();

// Public routes — anyone can view products
router.get('/view-all', getProducts)
router.get('/view/:id', getProduct);

// Admin or Manager — can add and update
router.post('/add', protect, isAdminOrManager, addProduct);
router.put('/update/:id', protect, isAdminOrManager, updateProductById);

// Admin only — can delete
router.delete('/delete/:id', protect, isAdmin, deleteProductById);

module.exports = router;