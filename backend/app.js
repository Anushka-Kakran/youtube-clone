import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import fileUpload from "express-fileupload";
import cors from 'cors';

import userRoute from "./routes/user.js";
import videoRoute from "./routes/video.js";
import commentRoute from "./routes/comment.js";


dotenv.config();

const app = express();

// --- Middleware ---
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//cors
app.use(cors());

// File Upload Configuration
app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: "/tmp/",
  })
);

// --- Database Connection ---
const connectDB = async () => {
  try {
    if (!process.env.MONGO_URI) {
      throw new Error("MONGO_URI is missing in environment variables ❌");
    }

    const conn = await mongoose.connect(process.env.MONGO_URI);

    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`❌ Database Connection Error: ${error.message}`);
    process.exit(1);
  }
};

// --- Routes ---
app.use("/user", userRoute);
app.use("/video", videoRoute);
app.use("/comment", commentRoute);

// --- Test Route (VERY IMPORTANT for Render) ---
app.get("/", (req, res) => {
  res.send("API is running 🚀");
});

export { app, connectDB };