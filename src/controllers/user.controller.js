const jwt=require('jsonwebtoken');
const {registerUser, loginUser, getUserById}=require('../services/user.service');

const generateToken=(id)=>{
    return jwt.sign({id},process.env.JWT_SECRET,{
        expiresIn:process.env.JWT_EXPIRES_IN,
    });
};

const register=async(req, res)=>{
    const{name, email, password}=req.body;
    const user=await registerUser({name, email, password});
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

module.exports = { register, login, getProfile };