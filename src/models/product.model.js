const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
    {
        name:{
            type:String,
            required:[true, 'Product name is required'],
            trim:true,
        },
        description:{
            type: String,
            required:[true, 'Product description is required'],
        },
        price:{
            type:Number,
            required:[true, 'Product price is required'],
        },
        stock:{
            type:Number,
            required:[true, 'Product stock is required'],
        }, 
        category:{
            type:String,
            required:[true, 'Category is required'],     
        },
        isActive:{
            type:Boolean,
            default:true,
        },
        createdBy:{
            type: mongoose.Schema.Types.ObjectId,
            ref:'User',
            required:true,
        },
    },
    {
        timestamps:true,
    }

)

const Product=mongoose.model('Product',productSchema);
module.exports=Product;