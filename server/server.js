require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");

const courseRoutes = require("./routes/courseRoutes");

const app = express();
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/Test";

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve uploaded thumbnail images statically
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// API routes
app.use("/api/courses", courseRoutes);

// Health check
app.get("/", (req, res) => {
  res.json({ message: "CourseManagerApp API is running", db: "Test", collection: "sub" });
});

// Connect to MongoDB (Database: Test) and start server
mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log(" MongoDB connected -> Database: Test, Collection: sub");
    app.listen(PORT, () => {
      console.log(` Server running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error(" MongoDB connection error:", err.message);
    process.exit(1);
  });
