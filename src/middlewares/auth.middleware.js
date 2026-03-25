const jwt = require('jsonwebtoken');
const User = require('../models/user.model');

// Check if logged in
const protect = async (req, res, next) => {
  try {
    let token;
    if (req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized, no token',
      });
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id);
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Not authorized, token failed',
    });
  }
};

// Admin only
const isAdmin = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({
      success: false,
      message: 'Access denied - Admins only',
    });
  }
  next();
};

// Manager only
const isManager = (req, res, next) => {
  if (req.user.role !== 'manager') {
    return res.status(403).json({
      success: false,
      message: 'Access denied - Managers only',
    });
  }
  next();
};

// Admin or Manager
const isAdminOrManager = (req, res, next) => {
  if (!['admin', 'manager'].includes(req.user.role)) {
    return res.status(403).json({
      success: false,
      message: 'Access denied - Admins and Managers only',
    });
  }
  next();
};

module.exports = { protect, isAdmin, isManager, isAdminOrManager };