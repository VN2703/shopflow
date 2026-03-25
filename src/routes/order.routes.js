const express = require('express');
const {
  createOrder,
  getMyOrderList,
  getAllOrdersList,
  getOrder,
  updateStatus,
} = require('../controllers/order.controller');
const {
  protect,
  isAdmin,
  isAdminOrManager,
} = require('../middlewares/auth.middleware');

const router = express.Router();

// Place order - customer only
router.post('/place', protect, createOrder);
router.get('/my-orders',protect, getMyOrderList);
//admin
router.get('/all', protect, isAdmin, getAllOrdersList);
//admin or manager
router.put('/update/:id', protect, isAdminOrManager, updateStatus);
router.get('/:id', protect, isAdminOrManager, getOrder);

module.exports=router;



