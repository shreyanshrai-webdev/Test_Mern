import React, { useEffect, useRef, useState } from "react";

const LEVELS = ["Beginner", "Intermediate", "Advanced"];

const emptyForm = {
  courseName: "",
  instructor: "",
  category: "",
  duration: "",
  level: "Beginner",
};

export default function CourseForm({ initialCourse, onSubmit, onClose }) {
  const isEdit = Boolean(initialCourse);
  const [fields, setFields] = useState(emptyForm);
  const [thumbnailFile, setThumbnailFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const fileInputRef = useRef(null);
  const firstFieldRef = useRef(null);

  useEffect(() => {
    if (initialCourse) {
      setFields({
        courseName: initialCourse.courseName || "",
        instructor: initialCourse.instructor || "",
        category: initialCourse.category || "",
        duration: initialCourse.duration ?? "",
        level: initialCourse.level || "Beginner",
      });
      setPreviewUrl(initialCourse.thumbnail || "");
    } else {
      setFields(emptyForm);
      setPreviewUrl("");
    }
    setThumbnailFile(null);
  }, [initialCourse]);

  useEffect(() => {
    firstFieldRef.current?.focus();
  }, []);

  // Close on Escape key
  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [onClose]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFields((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setErrors((prev) => ({ ...prev, thumbnail: "Please choose an image file." }));
      return;
    }

    setThumbnailFile(file);
    setErrors((prev) => ({ ...prev, thumbnail: undefined }));

    const reader = new FileReader();
    reader.onload = () => setPreviewUrl(reader.result);
    reader.readAsDataURL(file);
  };

  const handleRemoveThumbnail = () => {
    setThumbnailFile(null);
    setPreviewUrl("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const validate = () => {
    const next = {};
    if (!fields.courseName.trim()) next.courseName = "Course name is required.";
    if (!fields.instructor.trim()) next.instructor = "Instructor name is required.";
    if (!fields.category.trim()) next.category = "Category is required.";
    if (fields.duration === "" || Number(fields.duration) <= 0) {
      next.duration = "Enter a duration greater than 0.";
    }
    if (!isEdit && !thumbnailFile) {
      // Thumbnail optional, but warn softly — not blocking submission
    }
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setSubmitting(true);
    const formData = new FormData();
    formData.append("courseName", fields.courseName.trim());
    formData.append("instructor", fields.instructor.trim());
    formData.append("category", fields.category.trim());
    formData.append("duration", fields.duration);
    formData.append("level", fields.level);

    if (thumbnailFile) {
      formData.append("thumbnail", thumbnailFile);
    } else if (isEdit && initialCourse.thumbnail) {
      formData.append("existingThumbnail", initialCourse.thumbnail);
    }

    await onSubmit(formData, isEdit, initialCourse?._id);
    setSubmitting(false);
  };

  return (
    <div className="modal-overlay" role="dialog" aria-modal="true" aria-labelledby="form-title">
      <div className="modal course-form-modal">
        <div className="modal-header">
          <h2 id="form-title" className="modal-title">
            {isEdit ? "Edit Course" : "Add Course"}
          </h2>
          <button className="icon-btn" onClick={onClose} aria-label="Close form">
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="course-form">
          <div className="form-grid">
            <div className="form-field">
              <label htmlFor="courseName">Course Name</label>
              <input
                ref={firstFieldRef}
                id="courseName"
                name="courseName"
                type="text"
                value={fields.courseName}
                onChange={handleChange}
                placeholder="e.g. Introduction to React"
              />
              {errors.courseName && <span className="field-error">{errors.courseName}</span>}
            </div>

            <div className="form-field">
              <label htmlFor="instructor">Instructor Name</label>
              <input
                id="instructor"
                name="instructor"
                type="text"
                value={fields.instructor}
                onChange={handleChange}
                placeholder="e.g. Priya Sharma"
              />
              {errors.instructor && <span className="field-error">{errors.instructor}</span>}
            </div>

            <div className="form-field">
              <label htmlFor="category">Category</label>
              <input
                id="category"
                name="category"
                type="text"
                value={fields.category}
                onChange={handleChange}
                placeholder="e.g. Web Development"
              />
              {errors.category && <span className="field-error">{errors.category}</span>}
            </div>

            <div className="form-field">
              <label htmlFor="duration">Duration (hours)</label>
              <input
                id="duration"
                name="duration"
                type="number"
                min="0"
                step="0.5"
                value={fields.duration}
                onChange={handleChange}
                placeholder="e.g. 12"
              />
              {errors.duration && <span className="field-error">{errors.duration}</span>}
            </div>

            <div className="form-field">
              <label htmlFor="level">Level</label>
              <select id="level" name="level" value={fields.level} onChange={handleChange}>
                {LEVELS.map((lvl) => (
                  <option key={lvl} value={lvl}>
                    {lvl}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-field thumbnail-field">
              <label htmlFor="thumbnail">Course Thumbnail</label>
              <div className="thumbnail-uploader">
                <div className="thumbnail-preview">
                  {previewUrl ? (
                    <img src={previewUrl} alt="Thumbnail preview" />
                  ) : (
                    <span className="thumbnail-placeholder">No image</span>
                  )}
                </div>
                <div className="thumbnail-controls">
                  <input
                    ref={fileInputRef}
                    id="thumbnail"
                    name="thumbnail"
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                  />
                  {previewUrl && (
                    <button
                      type="button"
                      className="link-btn"
                      onClick={handleRemoveThumbnail}
                    >
                      Remove image
                    </button>
                  )}
                  {isEdit && (
                    <p className="hint-text">
                      Leave as-is to keep the current thumbnail, or choose a new file to replace it.
                    </p>
                  )}
                </div>
              </div>
              {errors.thumbnail && <span className="field-error">{errors.thumbnail}</span>}
            </div>
          </div>

          <div className="form-actions">
            <button type="button" className="btn btn-ghost" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={submitting}>
              {submitting
                ? "Saving…"
                : isEdit
                ? "Save Changes"
                : "Add Course"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
