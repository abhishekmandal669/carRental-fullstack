import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    // Optional: Listen for successful connection
    mongoose.connection.on('connected', () => {
      console.log('MongoDB connected successfully');
    });

    // Connect to MongoDB
    await mongoose.connect(`${process.env.MONGODB_URL}/car-rental`, {
    });
  } catch (error) {
    console.log(error.message);
  }
};

export default connectDB;
