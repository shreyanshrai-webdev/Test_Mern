import axios from "axios";

// Base URL of the backend Express server.
// During local dev, CRA proxies /api requests to the server (see package.json "proxy"),
// so this can remain a relative path.
const API_BASE = "/api/courses";

export const fetchCourses = (search = "") => {
  const url = search ? `${API_BASE}?search=${encodeURIComponent(search)}` : API_BASE;
  return axios.get(url).then((res) => res.data);
};

export const fetchCourseById = (id) => {
  return axios.get(`${API_BASE}/${id}`).then((res) => res.data);
};

export const createCourse = (formData) => {
  return axios
    .post(API_BASE, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    })
    .then((res) => res.data);
};

export const updateCourse = (id, formData) => {
  return axios
    .put(`${API_BASE}/${id}`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    })
    .then((res) => res.data);
};

export const deleteCourse = (id) => {
  return axios.delete(`${API_BASE}/${id}`).then((res) => res.data);
};
