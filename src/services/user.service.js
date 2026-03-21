const User=require('../models/user.model');

const registerUser = async(userData) =>{
    const existingUser = await User.findOne({email: userData.email});
    if(existingUser){
        throw new Error('Email already exists')
    }
    const user=await User.create(userData);
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

module.exports={registerUser, loginUser, getUserById};