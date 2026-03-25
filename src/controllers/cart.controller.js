const {
  addToCart,
  getCart,
  removeFromCart,
  removeProductFromCart,
  clearCart,
} = require('../services/cart.service');

//add cart
const addItemToCart = async (req, res) => {
    const {productId, quantity}=req.body;
    const cart = await addToCart(req.user._id, productId, quantity);
    res.status(200).json({
        success:true,
        message:'Item added to cart',
        cart,
    });
};

//Get Cart
const getMyCart=async(req, res)=>{
    const cart = await getCart(req.user._id);
    res.status(200).json({
        success:true,
        cart,
    });
};
// remove item
const removeItemFromCart = async (req, res) => {
  const { quantity } = req.body;
  const cart = await removeFromCart(req.user._id, req.params.productId, quantity);
  res.status(200).json({
    success: true,
    message: 'Cart updated',
    cart,
  });
};
// remove whole product
const removeWholeProduct = async (req, res) => {
  const cart = await removeProductFromCart(req.user._id, req.params.productId);
  res.status(200).json({
    success: true,
    message: 'Product removed from cart',
    cart,
  });
};

//clear cart 
const clearMyCart=async(req, res)=>{
    const cart= await clearCart(req.user._id);
    res.status(200).json({
        success:true,
        message:'Cart cleared',
        cart,
    });
};

module.exports = {
  addItemToCart,
  getMyCart,
  removeItemFromCart,
  removeWholeProduct,
  clearMyCart,
};