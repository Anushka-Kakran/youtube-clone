import { app, connectDB } from "./app.js";

// Use dynamic port (Render) or fallback to 3000 (local)
const PORT = process.env.PORT || 3000;

// Connect DB first, then start server
const startServer = async () => {
  try {
    await connectDB(); // connect to MongoDB

    app.listen(PORT, () => {
      console.log(`✅ Server is running on port ${PORT}`);
    });

  } catch (error) {
    console.error("❌ Database connection failed:", error);
    process.exit(1); // stop app if DB fails
  }
};

startServer();