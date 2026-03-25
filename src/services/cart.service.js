const Cart =require('../models/cart.model');
const Product = require('../models/product.model');


// Add item to cart
const addToCart = async (userId, productId, quantity) => {
    const product=await Product.findById(productId);
    if(!product){
        throw new Error('Product not found');
    }
    if(product.stock<quantity){
        throw new Error('Insufficient stock');
    }
    let cart = await Cart.findOne({ user:userId});
    
    //if cart not exist create new cart
    if(!cart){
        cart = await Cart.create({
            user:userId,
            items:[{product: productId, quantity, price:product.price}],
            totalPrice: product.price*quantity,
        });
        return cart;
    }
    //if cart exist check if product already in cart

    const itemIndex=cart.items.findIndex( (item)=>item.product.toString()===productId.toString());

    if(itemIndex>-1){
        //product exist in cart update quantity and price
        cart.items[itemIndex].quantity +=quantity;
    }else{
        //product not exist in cart add new item
        cart.items.push({product:productId, quantity, price:product.price});
    }

    //recalculate total price
   cart.totalPrice = cart.items.reduce((total, item) => total + item.price * item.quantity, 0);

    await cart.save();
    return cart;

}
// get cart
const getCart= async(userId)=>{
   const cart=await Cart.findOne({user:userId}).populate('items.product','name price stock');
   if(!cart){
    return {items:[], totalPrice:0};
   }
   return cart;
}


//  reduce quantity
const removeFromCart = async (userId, productId, quantity = 1) => {
  const cart = await Cart.findOne({ user: userId });
  if (!cart) {
    throw new Error('Cart not found');
  }

  const itemIndex = cart.items.findIndex(
    (item) => item.product.toString() === productId.toString()
  );

  if (itemIndex === -1) {
    throw new Error('Item not found in cart');
  }

  if (cart.items[itemIndex].quantity <= quantity) {
    // If quantity becomes 0 or less — remove product completely
    cart.items = cart.items.filter(
      (item) => item.product.toString() !== productId.toString()
    );
  } else {
    // Just reduce quantity
    cart.items[itemIndex].quantity -= quantity;
  }

  cart.totalPrice = cart.items.reduce(
    (total, item) => total + item.price * item.quantity, 0
  );

  await cart.save();
  return cart;
};

// Remove whole product from cart
const removeProductFromCart = async (userId, productId) => {
  const cart = await Cart.findOne({ user: userId });
  if (!cart) {
    throw new Error('Cart not found');
  }
  cart.items = cart.items.filter(
    (item) => item.product.toString() !== productId.toString()
  );
  cart.totalPrice = cart.items.reduce(
    (total, item) => total + item.price * item.quantity, 0
  );
  await cart.save();
  return cart;
};

// clear cart
const clearCart= async(userId)=>{
    const cart=await Cart.findOne({user: userId});
    if(!cart){
        throw new Error('Cart not found');
    }
    cart.items=[];
    cart.totalPrice=0;
    await cart.save();
    return cart;

}


module.exports = { addToCart, getCart, removeFromCart, removeProductFromCart, clearCart };