const{
    createProduct,
    getAllProducts,
    getProductById,
    updateProduct,
    deleteProduct,
} = require('../services/product.service');

// Create Product
const addProduct = async(req, res)=>{
    const productData={
        ...req.body,
        createdBy:req.user._id,

    };
    const product = await createProduct(productData);
    res.status(201).json({
        success:true,
        message:'Product created successfully',
        product,

    });
};

// Get all products
const  getProducts=async(req,res)=>{
    const products=await getAllProducts();
    res.status(200).json({
        success:true,
        count:products.length,
        products,
    });
};

// Get Single product
const getProduct = async(req, res)=>{
    const product=await getProductById(req.params.id);
    res.status(200).json({
        success:true,
        product,
    });
}

// Update product
const updateProductById=async(req,res)=>{
    const product=await updateProduct(req.params.id, req.body);
    res.status(200).json({
        success:true,
        message: 'Product updated successfully',
        product,
    });
}

//Delete product

const deleteProductById = async (req, res) => {
  await deleteProduct(req.params.id);
  res.status(200).json({
    success: true,
    message: 'Product deleted successfully',
  });
};

module.exports = {
  addProduct,
  getProducts,
  getProduct,
  updateProductById,
  deleteProductById,
};