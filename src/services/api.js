import axios from "axios";

const api = axios.create({ baseURL: "https://localhost:7137" });

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("AccessToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
