// const mongoose = require('mongoose');

// const connectDB = async () => {
//   try {
//     // Connect to MongoDB using the URI in your .env file
//     await mongoose.connect(process.env.MONGO_URI, {
//       useNewUrlParser: true,
//       useUnifiedTopology: true
//       // useCreateIndex: true   // only if using older mongoose versions
//     });

//     console.log('MongoDB connected successfully');
//   } catch (err) {
//     console.error('MongoDB connection failed:', err.message);
//     process.exit(1); // Exit process with failure
//   }
// };

// module.exports = connectDB;
import mongoose from "mongoose";

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1); // Stop the app if connection fails
  }
};

export default connectDB;
