const User=require('../models/user.model');
const { sendWelcomeEmail } = require('./email.service');

const registerUser = async(userData) =>{
    const existingUser = await User.findOne({email: userData.email});
    if(existingUser){
        throw new Error('Email already exists')
    }
     const plainPassword = userData.password; // ← save BEFORE create!
  const user = await User.create(userData);

      await sendWelcomeEmail(user.name, user.email, userData.password, user.role);
    return user;
};

const loginUser=async(email, password)=>{
    const user=await User.findOne({email}).select('+password');
    if(!user){
        throw new Error('Inavlid email or password');
    }
    const isMatch=await user.comparePassword(password);
    if(!isMatch){   
        throw new Error('Invalid email or password');
    }
    return user;
};

const getUserById= async(id)=>{

    const user=await User.findById(id);
    if(!user){
        throw new Error('User not found')
    }
    return user;
}


// Get all users — admin only
const getAllUsers = async () => {
  const users = await User.find();
  return users;
};

// Update user
const updateUser = async (id, updateData) => {
  const user = await User.findByIdAndUpdate(
    id,
    updateData,
    { new: true, runValidators: true }
  );
  if (!user) {
    throw new Error('User not found');
  }
  return user;
};

// Delete user
const deleteUser = async (id) => {
  const user = await User.findByIdAndDelete(id);
  if (!user) {
    throw new Error('User not found');
  }
  return user;
};

// Get all customers
const getAllCustomers = async () => {
  const customers = await User.find({ role: 'customer' });
  return customers;
};

module.exports = {
  registerUser,
  loginUser,
  getUserById,
  getAllUsers,
  updateUser,
  deleteUser,
  getAllCustomers,
};