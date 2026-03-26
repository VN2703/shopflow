const User = require('../models/user.model');
const Product = require('../models/product.model');
const Order = require('../models/order.model');
const Cart = require('../models/cart.model');

//Admin Dashboard
const getAdminDashboard = async()=>{
    // Users stats
    const totalUsers = await User.countDocuments();
    const totalManagers = await User.countDocuments({role:'manager'});
    const totalCustomers = await User.countDocuments({role:'customer'});

    // Product stats
    const totalProducts = await Product.countDocuments();
    const activeProducts = await Product.countDocuments({isActive: true});

    // Orders stats
    const totalOrders = await Order.countDocuments();
    const pendingOrders = await Order.countDocuments({status :'pending'});
    const confirmedOrders = await Order.countDocuments({status:'confirmed'});
    const shippedOrders = await Order.countDocuments({status:'shipped'});
    const deliveredOrders = await Order.countDocuments({status:'delivered'});
    const cancelledOrders = await Order.countDocuments({status:'cancelled'});

    //Total Revenue from paid orders
   const revenueData = await Order.aggregate([
    {$match :{paymentStatus: 'paid'}},
    {$group: {_id:null, totalRevenue: {$sum: '$totalPrice'}}},
   ]);
   const totalRevenue = revenueData[0]?.totalRevenue || 0;

   //Recent 5 Users
   const recentUsers = await User.find()
    .sort({ createdAt: -1 })
    .limit(5)
    .select('name email role createdAt');

  // Recent 5 orders
   const recentOrders = await Order.find()
     .sort({createdAt:-1})
     .limit(5)
     .populate('user', 'name email')

 // Low stock products (stock less than 10)

    const lowStockProducts =await Product.find({stock: {$lt:10}}).select('name stock price category');



      return {
    users: {
      total: totalUsers,
      managers: totalManagers,
      customers: totalCustomers,
    },
    products: {
      total: totalProducts,
      active: activeProducts,
      lowStock: lowStockProducts,
    },
    orders: {
      total: totalOrders,
      pending: pendingOrders,
      confirmed: confirmedOrders,
      shipped: shippedOrders,
      delivered: deliveredOrders,
      cancelled: cancelledOrders,
    },
    revenue: {
      total: totalRevenue,
    },
    recentUsers,
    recentOrders,
  };


};

//Manager dashboard
const getManagerDashboard = async()=>{
    //products
    const totalProducts = await Product.countDocuments();
    const activeProducts = await Product.countDocuments({isActive:true});

    //orders
    const totalOrders = await Order.countDocuments();
    const pendingOrders = await Order.countDocuments({status:'pending'});
    const confirmedOrders =await Order.countDocuments({status:'confirmed'});
    const shippedOrders = await Order.countDocuments({status:'shipped'});
    const deliveredOrders = await Order.countDocuments({status:'delivered'});

    //Total customer
    const totalCustomers = await User.countDocuments({role:'customer'});

    //Recent 5 orders
    const recentOrders = await Order.find()
       .sort({cretatedAt: -1})
       .limit(5)
       .populate('user','name email');

     //Low stock products
     const lowStockProducts =await Product.find({stock: {$lt: 10}})  
         .select('name stock price category');
    
      return{

        products:{
            total: totalProducts,
            active: activeProducts,
            lowStock: lowStockProducts,
        },
        orders:{
            total: totalOrders,
            pending: pendingOrders,
            confirmed: confirmedOrders,
            shipped: shippedOrders,
            delivered: deliveredOrders,
        },

        customers:{
            total: totalCustomers,
        },

        recentOrders,
      }   


}

const getCustomerDashboard = async(userId)=>{

    const totalOrders =await Order.countDocuments({user:userId});
    const pendingOrders = await Order.countDocuments({ user:userId, status:'pending'});
    const confirmedOrders =await Order.countDocuments({ user:userId, status:'confirmed'});
    const shippedOrders = await Order.countDocuments({user:userId, status:'shipped'});
    const deliveredOrders = await Order.countDocuments({ user:userId, status:'delivered'});
    const cancelledOrders = await Order.countDocuments({user:userId, status:'cancelled'});

    // Total amount spent
    const spentData = await Order.aggregate([
        {$match: {user: userId}},
        {$group: {_id:null, totalSpent: {$sum: '$totalPrice'}}},
    ]);
    const totalSpent = spentData[0]?.totalSpent || 0;


    //Recent 5 orders
    const recentOrders = await Order.find({user:userId})
     .sort({createdAt: -1})
     .limit(5)
     .populate('items.product', 'name price')

     //My cart
     const cart = await Cart.findOne({user:userId})
     .populate('items.product', 'name price')
     
   return {
    orders: {
      total: totalOrders,
      pending: pendingOrders,
      confirmed: confirmedOrders,
      shipped: shippedOrders,
      delivered: deliveredOrders,
      cancelled: cancelledOrders,
    },
    totalSpent,
    recentOrders,
    cart: cart || { items: [], totalPrice: 0 },
  };
};

module.exports = {getAdminDashboard, getManagerDashboard, getCustomerDashboard};

