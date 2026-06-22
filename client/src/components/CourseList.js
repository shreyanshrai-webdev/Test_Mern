import React from "react";

const FALLBACK_THUMB =
  "data:image/svg+xml;utf8," +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="120" height="90" viewBox="0 0 120 90">
      <rect width="120" height="90" fill="#EFE7D6"/>
      <text x="60" y="49" font-family="Georgia, serif" font-size="13" fill="#9C8F75" text-anchor="middle">No Image</text>
    </svg>`
  );

function resolveThumbnailUrl(thumbnail) {
  if (!thumbnail) return FALLBACK_THUMB;
  if (thumbnail.startsWith("http") || thumbnail.startsWith("data:")) return thumbnail;
  return thumbnail; // relative path like /uploads/xyz.jpg served by backend (proxied)
}

function levelClass(level) {
  switch (level) {
    case "Beginner":
      return "badge badge-beginner";
    case "Intermediate":
      return "badge badge-intermediate";
    case "Advanced":
      return "badge badge-advanced";
    default:
      return "badge";
  }
}

function CourseCard({ course, onEdit, onDelete }) {
  return (
    <article className="course-card">
      <div className="course-thumb-wrap">
        <img
          className="course-thumb"
          src={resolveThumbnailUrl(course.thumbnail)}
          alt={`${course.courseName} thumbnail`}
          onError={(e) => {
            e.currentTarget.src = FALLBACK_THUMB;
          }}
        />
      </div>

      <div className="course-body">
        <div className="course-card-top">
          <h3 className="course-name">{course.courseName}</h3>
          <span className={levelClass(course.level)}>{course.level}</span>
        </div>

        <p className="course-instructor">Taught by {course.instructor}</p>

        <dl className="course-meta">
          <div className="meta-row">
            <dt>Category</dt>
            <dd>{course.category}</dd>
          </div>
          <div className="meta-row">
            <dt>Duration</dt>
            <dd>{course.duration} hrs</dd>
          </div>
        </dl>
      </div>

      <div className="course-actions">
        <button className="btn btn-edit" onClick={() => onEdit(course)}>
          Edit
        </button>
        <button className="btn btn-delete" onClick={() => onDelete(course)}>
          Delete
        </button>
      </div>
    </article>
  );
}

function SkeletonCard() {
  return (
    <div className="course-card skeleton-card" aria-hidden="true">
      <div className="course-thumb-wrap skeleton-block" />
      <div className="course-body">
        <div className="skeleton-line" style={{ width: "70%" }} />
        <div className="skeleton-line" style={{ width: "45%" }} />
        <div className="skeleton-line" style={{ width: "55%" }} />
      </div>
    </div>
  );
}

export default function CourseList({ courses, loading, onEdit, onDelete, onAddFirst, hasSearch }) {
  if (loading) {
    return (
      <div className="course-grid">
        {[1, 2, 3].map((n) => (
          <SkeletonCard key={n} />
        ))}
      </div>
    );
  }

  if (courses.length === 0) {
    return (
      <div className="empty-state">
        {hasSearch ? (
          <>
            <h2 className="empty-title">No matching courses</h2>
            <p className="empty-body">
              Nothing in the catalog matches your search. Try a different name, instructor, category, or level.
            </p>
          </>
        ) : (
          <>
            <h2 className="empty-title">The catalog is empty</h2>
            <p className="empty-body">
              Add your first course to start building the record.
            </p>
            <button className="btn btn-primary" onClick={onAddFirst}>
              + Add Course
            </button>
          </>
        )}
      </div>
    );
  }

  return (
    <div className="course-grid">
      {courses.map((course) => (
        <CourseCard
          key={course._id}
          course={course}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}
