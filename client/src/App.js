import React, { useEffect, useState, useCallback } from "react";
import "./App.css";
import CourseForm from "./components/CourseForm";
import CourseList from "./components/CourseList";
import SearchBar from "./components/SearchBar";
import Toast from "./components/Toast";
import {
  fetchCourses,
  createCourse,
  updateCourse,
  deleteCourse,
} from "./api";

function App() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [editingCourse, setEditingCourse] = useState(null); // null = add mode
  const [formOpen, setFormOpen] = useState(false);
  const [toast, setToast] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const showToast = (message, type = "success") => {
    setToast({ message, type });
  };

  const loadCourses = useCallback(async (search = "") => {
    setLoading(true);
    setError("");
    try {
      const data = await fetchCourses(search);
      setCourses(data);
    } catch (err) {
      setError(
        "Could not reach the server. Make sure the backend is running on port 5000."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadCourses();
  }, [loadCourses]);

  // Debounce search input -> refetch from server
  useEffect(() => {
    const timer = setTimeout(() => {
      loadCourses(searchTerm);
    }, 350);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchTerm]);

  const handleOpenAdd = () => {
    setEditingCourse(null);
    setFormOpen(true);
  };

  const handleOpenEdit = (course) => {
    setEditingCourse(course);
    setFormOpen(true);
  };

  const handleCloseForm = () => {
    setFormOpen(false);
    setEditingCourse(null);
  };

  const handleSubmit = async (formData, isEdit, id) => {
    try {
      if (isEdit) {
        await updateCourse(id, formData);
        showToast("Course updated successfully.");
      } else {
        await createCourse(formData);
        showToast("Course added successfully.");
      }
      setFormOpen(false);
      setEditingCourse(null);
      loadCourses(searchTerm);
    } catch (err) {
      showToast(
        err?.response?.data?.message || "Something went wrong while saving.",
        "error"
      );
    }
  };

  const requestDelete = (course) => {
    setDeleteTarget(course);
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    try {
      await deleteCourse(deleteTarget._id);
      showToast(`"${deleteTarget.courseName}" was deleted.`);
      setDeleteTarget(null);
      loadCourses(searchTerm);
    } catch (err) {
      showToast("Could not delete the course. Try again.", "error");
      setDeleteTarget(null);
    }
  };

  const cancelDelete = () => setDeleteTarget(null);

  return (
    <div className="app-shell">
      <header className="masthead">
        <div className="masthead-inner">
          <div className="masthead-left">
            <span className="masthead-mark">CM</span>
            <div>
              <h1 className="masthead-title">CourseManagerApp</h1>
              <p className="masthead-subtitle">Catalog &amp; Records — Database: Test · Collection: sub</p>
            </div>
          </div>
          <button className="btn btn-primary" onClick={handleOpenAdd}>
            + Add Course
          </button>
        </div>
      </header>

      <main className="content">
        <div className="content-toolbar">
          <SearchBar value={searchTerm} onChange={setSearchTerm} />
          <span className="result-count">
            {loading ? "Loading…" : `${courses.length} course${courses.length === 1 ? "" : "s"}`}
          </span>
        </div>

        {error && <div className="banner banner-error">{error}</div>}

        <CourseList
          courses={courses}
          loading={loading}
          onEdit={handleOpenEdit}
          onDelete={requestDelete}
          onAddFirst={handleOpenAdd}
          hasSearch={searchTerm.trim().length > 0}
        />
      </main>

      {formOpen && (
        <CourseForm
          initialCourse={editingCourse}
          onSubmit={handleSubmit}
          onClose={handleCloseForm}
        />
      )}

      {deleteTarget && (
        <div className="modal-overlay" role="dialog" aria-modal="true">
          <div className="modal confirm-modal">
            <h2 className="confirm-title">Delete this course?</h2>
            <p className="confirm-body">
              <strong>{deleteTarget.courseName}</strong> will be permanently removed from the catalog. This cannot be undone.
            </p>
            <div className="confirm-actions">
              <button className="btn btn-ghost" onClick={cancelDelete}>
                Cancel
              </button>
              <button className="btn btn-danger" onClick={confirmDelete}>
                Delete Course
              </button>
            </div>
          </div>
        </div>
      )}

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onDone={() => setToast(null)}
        />
      )}
    </div>
  );
}

export default App;
