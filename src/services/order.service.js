const Order=require('../models/order.model');
const Cart = require('../models/cart.model');


//place order from cart
const placeOrder = async (userId, shippingAddress)=>{
   const cart = await Cart.findOne({user:userId});
   if(!cart || cart.items.length === 0){
    throw new Error('Cart is empty');
   }

   const order=await Order.create({
      user:userId,
      items:cart.items,
      totalPrice: cart.totalPrice,
      shippingAddress,
      status:'pending',
      paymentStatus:'pending',
   });

// clear cart after order placed
   cart.items=[];
   cart.totalPrice=0;
   await cart.save();
   return order;

};

// Get my orders - customer
  const getMyOrders=async(userId)=>{
    const orders= await Order.find({user:userId}).populate('items.product','name price').sort({createdAt: -1});
    return orders;
  };

 // Get all orders - admin 
 const getAllOrders = async()=>{
    const orders=await Order.find()
    .populate('user', 'name email')
    .populate('items.product', 'name price')
    .sort({createdAt: -1});
    return orders;
 };

 //Get single order

 const getOrderById=async(id)=>{
    const order=await Order.findById(id)
    .populate('user','name email')
    .populate('items.product','name price');

    if(!order){
        throw new Error('Order not found');
    }
    return order;
 };

 //update order status - admin or manager
 const updateOrderStatus = async(id, status)=>{
    const order =await Order.findByIdAndUpdate(
        id,
        {status},
        {new:true, runValidators:true}
    );
    if(!order){
        throw new Error('Order not found');

    }
    return order;
 }

 module.exports ={
    placeOrder,
    getMyOrders,
    getAllOrders,
    getOrderById,
    updateOrderStatus,
 }