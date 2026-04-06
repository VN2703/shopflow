const app = require('./app');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

dotenv.config();  //dotenv.config()`** → loads all variables from your `.env` file into `process.env`


const PORT = process.env.PORT || 8000;     //process.env.PORT → reads the PORT value from your .env file. || 8000 means if PORT is not set, use 8000 as default

connectDB();
app.listen(PORT, () => {    //actually starts the server on that port and keeps it running
  console.log(`Server is running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV}`);
  console.log(`Health check: http://localhost:${PORT}/health`);
});
