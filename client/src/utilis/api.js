import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8000/api/", // Ensure this matches Django API
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// Automatically attach JWT token to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token"); // Retrieve token
  if (token) {
    config.headers.Authorization = `Bearer ${token}`; // Attach it to headers
  }
  return config;
});

export default api;
