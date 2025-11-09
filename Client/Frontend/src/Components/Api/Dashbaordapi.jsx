// src/Components/Api/DashboardApi.jsx
import axiosInstance from "./AxiosInstance";

const parse = (raw) => (typeof raw === "string" ? JSON.parse(raw) : raw);

const unwrap = (res) => {
  const body = parse(res?.data ?? res);
  if (body && typeof body === "object") {
    if ("_data" in body) return body._data;
    if ("data" in body) return body.data;
  }
  return body;
};

// Use relative path WITHOUT leading /api
export const fetchDashboardCounts = async () => {
  try {
    const res = await axiosInstance.get("/DashBoard/counts"); // ← No /api
    return unwrap(res);
  } catch (error) {
    console.error("Dashboard API Error:", error.response || error);
    throw error;
  }
};

const DashboardService = { fetchDashboardCounts };
export default DashboardService;