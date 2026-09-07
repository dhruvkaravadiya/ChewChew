import axios from "axios";

const BASE_URL = "http://localhost:8000/api/v1/";

const axiosInstance = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
});

axiosInstance.interceptors.request.use((config) => {
  const token =
    localStorage.getItem("__session") ||
    sessionStorage.getItem("__session");

  if (token) {
    config.headers["Authorization"] = `Bearer ${token}`;
  }
  return config;
});

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error?.response?.status === 401) {
      localStorage.removeItem("__session");
      sessionStorage.removeItem("__session");
      localStorage.removeItem("isLoggedIn");
      localStorage.removeItem("role");
      localStorage.removeItem("data");
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;