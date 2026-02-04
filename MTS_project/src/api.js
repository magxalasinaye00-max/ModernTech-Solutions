import axios from "axios";

// Create an Axios instance with backend base URL
const api = axios.create({
  baseURL: "http://localhost:3000", // backend port
  headers: {
    "Content-Type": "application/json"
  }
});

// Attach token automatically if available
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;
