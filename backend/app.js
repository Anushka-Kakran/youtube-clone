import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import fileUpload from 'express-fileupload';
import userRoute from './routes/user.js';
import videoRoute from './routes/video.js';
import commentRoute from './routes/comment.js'


dotenv.config();

const app = express();

// --- Middleware ---

app.use(express.json()); 
app.use(express.urlencoded({ extended: true }));

// File Upload Configuration
app.use(fileUpload({
    useTempFiles: true,
    tempFileDir: '/tmp/' 
}));

// --- Database Connection ---
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`Mongoose connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Database Connection Error: ${error.message}`);
    process.exit(1);
  }
};

// --- Routes ---
app.use('/user', userRoute);
app.use('/video',videoRoute);
app.use('/comment', commentRoute);

export { app, connectDB };