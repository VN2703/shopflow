const express= require('express');
const {adminDashboard, managerDashboard, customerDashboard}=require ('../controllers/dashboard.controller');
const {protect,isAdmin, isManager,}=require('../middlewares/auth.middleware')

const router = express.Router();
//admin dashboard -admin only
router.get('/admin', protect ,isAdmin, adminDashboard)
router.get('/manager', protect, isManager, managerDashboard)
router.get('/customer', protect, customerDashboard )
module.exports = router;