const {getAdminDashboard, getManagerDashboard, getCustomerDashboard}= require('../services/dashboard.service');

const adminDashboard =async(req , res) =>{
    const dashboard = await getAdminDashboard();
    res.status(200).json({
        success:true,
        dashboard,
    });
};

const managerDashboard=async(req, res)=>{
    const dashboard = await getManagerDashboard();
    res.status(200).json({
        success:true,
        dashboard
    });
};

const customerDashboard=async(req, res)=>{
    const dashboard = await getCustomerDashboard(req.user._id);
     res.status(200).json({
        success:true,
        dashboard
     });
};
module.exports = {adminDashboard, managerDashboard, customerDashboard };


