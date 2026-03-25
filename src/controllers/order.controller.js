const {
    placeOrder,
    getMyOrders,
    getAllOrders,
    getOrderById,
    updateOrderStatus,
    
} = require('../services/order.service');

//Place order-customer

const createOrder = async(req, res)=>{
    const{shippingAddress}=req.body;
    const order=await placeOrder(req.user._id, shippingAddress);
    res.status(201).json({
        success: true,
        message:'Order placed successfully',
        order,
    });
};

//Get my orders - customer
const getMyOrderList = async(req, res)=>{
  const orders = await getMyOrders(req.user._id);
  res.status(200).json({
    success:true,
    count:orders.length,
    orders,
  });
};

//get all orders list-admin only
const getAllOrdersList=async(req,res)=>{
const orders=await getAllOrders();
res.status(200).json({
    success:true,
    count:orders.length,
    orders,
})
};

// Get single order
const getOrder = async (req, res) => {
  const order = await getOrderById(req.params.id);
  res.status(200).json({
    success: true,
    order,
  });
};

// Update order status - admin or manager

const updateStatus =async(req, res)=>{
    const{status}=req.body;
    const order=await updateOrderStatus(req.params.id, status);
    res.status(200).json({
        success:true,
        message:'Order status updated',
        order,
    });
};

module.exports={
    createOrder,
    getMyOrderList,
    getAllOrdersList,
    getOrder,
    updateStatus,

};