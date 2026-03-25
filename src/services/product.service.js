const Product= require('../models/product.model');

//Create product
const createProduct=async(productData)=>{
    const product=await Product.create(productData);
    return product;
};

//Get all products
const getAllProducts=async()=>{
    const products=await Product.find({isActive:true}).populate('createdBy', 'name email role');
    return products;
}

// Get single product
const getProductById=async(id)=>{
    const product=await Product.findById(id).populate('createdBy','name email role');
    if(!product ){
        throw new Error('Product not found');
    }
    return product;
}

//update product
const updateProduct=async(id, updateData)=>{
    const product=await Product.findByIdAndUpdate(id, updateData, {
        new:true, runValidators:true
    });

    if(!product){
        throw new Error('Product not found');

    }
    return product;
}



//delete product

const deleteProduct=async(id)=>{
    const product=await Product.findByIdAndDelete(id);
    if(!product){
        throw new Error('Product not found');
    }
    return product;
}

module.exports = {
  createProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct,
};