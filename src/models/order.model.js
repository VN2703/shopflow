const mongoose = require('mongoose');
const orderItemSchema =new mongoose.Schema({
    product:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Product',
        required:true,
    },

    quantity:{
        type:Number,
        required:true,
    },
    price:{
        type:Number,
        required:true,
    },
});

const orderSchema= new mongoose.Schema({
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true,
    
    },
    items:[orderItemSchema],
    totalPrice:{
        type:Number,
        required:true,
    },
    status:{
        type:String,
        enum:['pending','confirmed','shipped','delivered','cancelled'],
        default:'pending',
    },
    shippingAddress:{
        street:{type:String, required:true},
        city:{type:String, required:true},
        state:{type:String, required:true},
        pincode:{type:String, required:true},
    },
    paymentStatus:{
        type:String,
        enum:['pending', 'paid', 'failed'],
        default:'pending',
    },

},
     {
        timestamps:true,
     }
);

const Order=mongoose.model('Order', orderSchema);
module.exports = Order;

