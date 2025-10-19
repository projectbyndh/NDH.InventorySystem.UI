import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "http://ndhinventoryapi-001-site1.mtempurl.com/api/",
  timeout: 10000,
});

// Add Authorization header automatically
axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Unwrap backend response
axiosInstance.interceptors.response.use(
  (res) => {
    const body = res.data;
    if (body && typeof body === "object" && "_success" in body) {
      if (body._success) return body._data; // ✅ plain data returned
      throw new Error(body._message || "Request failed");
    }
    return body;
  },
  (error) => {
    console.error("API Error:", error);
    throw error;
  }
);

export default axiosInstance;