// // Packages
// import express from "express";
// import cookieParser from "cookie-parser";
// import dotenv from "dotenv";
// import path from "path";

// // Files
// import connectDB from "./config/db.js";
// import userRoutes from "./routes/userRoutes.js";
// import genreRoutes from "./routes/genreRoutes.js";
// import moviesRoutes from "./routes/moviesRoutes.js";
// import uploadRoutes from "./routes/uploadRoutes.js";

// // Configuration
// dotenv.config();
// connectDB();

// const app = express();

// // middlewares
// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));
// app.use(cookieParser());

// const PORT = process.env.PORT || 3000;

// // Routes
// app.use("/api/v1/users", userRoutes);
// app.use("/api/v1/genre", genreRoutes);
// app.use("/api/v1/movies", moviesRoutes);
// app.use("/api/v1/upload", uploadRoutes);

// const __dirname = path.resolve();
// app.use("/uploads", express.static(path.join(__dirname + "/uploads")));

// app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));


// Packages
import express from "express";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import path from "path";

// Files
import connectDB from "./config/db.js";
import userRoutes from "./routes/userRoutes.js";
import genreRoutes from "./routes/genreRoutes.js";
import moviesRoutes from "./routes/moviesRoutes.js";
import uploadRoutes from "./routes/uploadRoutes.js";

// Configuration
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Routes
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/genre", genreRoutes);
app.use("/api/v1/movies", moviesRoutes);
app.use("/api/v1/upload", uploadRoutes);

const __dirname = path.resolve();
app.use("/uploads", express.static(path.join(__dirname + "/uploads")));

// ✅ Connect to DB first, then run server
const startServer = async () => {
  try {
    await connectDB();
    console.log("✅ Successfully connected to MongoDB");

    app.listen(PORT, () =>
      console.log(`🚀 Server is running on port ${PORT}`)
    );
  } catch (error) {
    console.error("❌ MongoDB connection failed:", error.message);
    process.exit(1); // stop the process if DB fails
  }
};

startServer();  
