const express = require('express');
const {
  addItemToCart,
  getMyCart,
  removeItemFromCart,
  removeWholeProduct,
  clearMyCart,
} = require('../controllers/cart.controller');

const { protect } = require('../middlewares/auth.middleware');

const router = express.Router();

router.get('/view', protect, getMyCart);
router.post('/add', protect, addItemToCart);
router.delete('/remove/:productId', protect, removeItemFromCart);
router.delete('/remove-all/:productId', protect, removeWholeProduct);
router.delete('/clear', protect, clearMyCart);
module.exports = router;