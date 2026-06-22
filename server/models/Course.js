const mongoose = require("mongoose");

// Schema for a Course document
const courseSchema = new mongoose.Schema(
  {
    courseName: {
      type: String,
      required: true,
      trim: true,
    },
    instructor: {
      type: String,
      required: true,
      trim: true,
    },
    category: {
      type: String,
      required: true,
      trim: true,
    },
    duration: {
      type: Number,
      required: true,
    },
    level: {
      type: String,
      enum: ["Beginner", "Intermediate", "Advanced"],
      default: "Beginner",
    },
    thumbnail: {
      type: String, // stores the path/URL of the uploaded image
      default: "",
    },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("Course", courseSchema, "sub");
