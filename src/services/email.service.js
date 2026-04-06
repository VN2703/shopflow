const nodemailer = require('nodemailer');



const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

console.log('Email user:', process.env.EMAIL_USER); // ← add this!

const sendWelcomeEmail = async (name, email, password, role) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Welcome to ShopFlow! 🛒',
    html: `
      <h2>Welcome to ShopFlow, ${name}!</h2>
      <p>Your account has been created. Here are your login credentials:</p>
      <p><b>Email:</b> ${email}</p>
      <p><b>Password:</b> ${password}</p>
      <p><b>Role:</b> ${role}</p>
      <p>Login here: <a href="http://localhost:3000/login">Click here</a></p>
    `,
  };

  await transporter.sendMail(mailOptions);
};

module.exports = { sendWelcomeEmail };