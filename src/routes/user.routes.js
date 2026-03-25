const express = require('express');
const {
  register,
  login,
  getProfile,
  getUsers,
  getUser,
  updateUserById,
  deleteUserById,
  getCustomers,
} = require('../controllers/user.controller');
const {
  protect,
  isAdmin,
  isManager,
  isAdminOrManager,
} = require('../middlewares/auth.middleware');

const router = express.Router();

// Public routes
router.post('/register', register);
router.post('/login', login);

// Any logged in user
router.get('/profile', protect, getProfile);

// Manager only — before /:id
router.get('/customers', protect, isManager, getCustomers);

// Admin only
router.get('/', protect, isAdmin, getUsers);
router.delete('/:id', protect, isAdmin, deleteUserById);
router.put('/:id', protect, isAdmin, updateUserById);

// Admin or Manager
router.get('/:id', protect, isAdminOrManager, getUser);

module.exports = router;