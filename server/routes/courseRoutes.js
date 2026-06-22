const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const Course = require("../models/Course");

// Ensure uploads folder exists
const uploadDir = path.join(__dirname, "..", "uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Multer storage config for thumbnail uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueName + path.extname(file.originalname));
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("Only image files are allowed"));
    }
  },
});

// ------------------------------------------------------------------

// ------------------------------------------------------------------
router.get("/", async (req, res) => {
  try {
    const { search } = req.query;
    let query = {};

    if (search) {
      const regex = new RegExp(search, "i");
      query = {
        $or: [
          { courseName: regex },
          { instructor: regex },
          { category: regex },
          { level: regex },
        ],
      };
    }

    const courses = await Course.find(query).sort({ createdAt: -1 });
    res.json(courses);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ------------------------------------------------------------------

// ------------------------------------------------------------------
router.get("/:id", async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) return res.status(404).json({ message: "Course not found" });
    res.json(course);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ------------------------------------------------------------------

// ------------------------------------------------------------------
router.post("/", upload.single("thumbnail"), async (req, res) => {
  try {
    const { courseName, instructor, category, duration, level } = req.body;

    const newCourse = new Course({
      courseName,
      instructor,
      category,
      duration,
      level,
      thumbnail: req.file ? `/uploads/${req.file.filename}` : "",
    });

    const saved = await newCourse.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// ------------------------------------------------------------------

// ------------------------------------------------------------------
router.put("/:id", upload.single("thumbnail"), async (req, res) => {
  try {
    const {
      courseName,
      instructor,
      category,
      duration,
      level,
      existingThumbnail,
    } = req.body;

    const updateData = {
      courseName,
      instructor,
      category,
      duration,
      level,
    };

    if (req.file) {
      const existing = await Course.findById(req.params.id);
      if (existing && existing.thumbnail) {
        const oldPath = path.join(__dirname, "..", existing.thumbnail);
        if (fs.existsSync(oldPath)) {
          fs.unlink(oldPath, () => {});
        }
      }
      updateData.thumbnail = `/uploads/${req.file.filename}`;
    } else if (existingThumbnail) {
      updateData.thumbnail = existingThumbnail;
    }

    const updated = await Course.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
      runValidators: true,
    });

    if (!updated) return res.status(404).json({ message: "Course not found" });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// ------------------------------------------------------------------

// ------------------------------------------------------------------
router.delete("/:id", async (req, res) => {
  try {
    const course = await Course.findByIdAndDelete(req.params.id);
    if (!course) return res.status(404).json({ message: "Course not found" });

    // Remove thumbnail file from disk
    if (course.thumbnail) {
      const filePath = path.join(__dirname, "..", course.thumbnail);
      if (fs.existsSync(filePath)) {
        fs.unlink(filePath, () => {});
      }
    }

    res.json({ message: "Course deleted successfully", id: req.params.id });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
