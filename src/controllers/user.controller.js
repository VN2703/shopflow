const jwt = require('jsonwebtoken');
const { registerUser, loginUser, getUserById, getAllUsers, updateUser, deleteUser, getAllCustomers } = require('../services/user.service');

const generateToken=(id)=>{
    return jwt.sign({id},process.env.JWT_SECRET,{
        expiresIn:process.env.JWT_EXPIRES_IN,
    });
};

const register = async (req, res) => {
  const { name, email, password, role } = req.body;
  const user = await registerUser({ name, email, password, role });
    const token=generateToken(user._id);
    res.status(201).json({
        success:true,
        token,
        user:{
            id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
        },
    });

};
const login=async(req, res)=>{
    const{email, password}=req.body;
    const user=await loginUser(email, password);
    const token=generateToken(user._id);
     res.status(200).json({
    success: true,
    token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
  });
}

const getProfile = async (req, res) => {
  const user = await getUserById(req.user.id);
  res.status(200).json({
    success: true,
    user,
  });
};

// Get all users — admin only
const getUsers = async (req, res) => {
  const users = await getAllUsers();
  res.status(200).json({
    success: true,
    count: users.length,
    users,
  });
};

// Get single user
const getUser = async (req, res) => {
  const user = await getUserById(req.params.id);
  res.status(200).json({
    success: true,
    user,
  });
};

// Update user
const updateUserById = async (req, res) => {
  const user = await updateUser(req.params.id, req.body);
  res.status(200).json({
    success: true,
    message: 'User updated successfully',
    user,
  });
};

// Delete user
const deleteUserById = async (req, res) => {
  await deleteUser(req.params.id);
  res.status(200).json({
    success: true,
    message: 'User deleted successfully',
  });
};

// Get all customers — manager only
const getCustomers = async (req, res) => {
  const customers = await getAllCustomers();
  res.status(200).json({
    success: true,
    count: customers.length,
    customers,
  });
};


module.exports = { 
  register, 
  login, 
  getProfile,
  getUsers,
  getUser,
  updateUserById,
  deleteUserById,
  getCustomers,
};