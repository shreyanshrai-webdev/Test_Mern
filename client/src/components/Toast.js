import React, { useEffect } from "react";

export default function Toast({ message, type = "success", onDone }) {
  useEffect(() => {
    const timer = setTimeout(onDone, 2800);
    return () => clearTimeout(timer);
  }, [onDone]);

  return (
    <div className={`toast toast-${type}`} role="status">
      <span className="toast-mark">{type === "error" ? "!" : "✓"}</span>
      <span>{message}</span>
    </div>
  );
}
