// lib/api.ts
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://127.0.0.1:8000/api', // Adjust this if your backend URL differs
  withCredentials: true, // Automatically send httpOnly cookies with every request
});

// Optional: Set up interceptors for handling errors or refreshing tokens, if needed
// api.interceptors.response.use(
//   response => response,
//   error => {
//     // Handle errors globally
//     return Promise.reject(error);
//   }
// );

export default api;
