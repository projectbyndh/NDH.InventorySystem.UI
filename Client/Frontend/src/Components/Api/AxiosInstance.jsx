// src/Components/Api/AxiosInstance.jsx
import axios from "axios";
import useLoginStore from "../Store/Loginstore";

const axiosInstance = axios.create({
  baseURL: "http://ndhinventoryapi-001-site1.mtempurl.com/api",
  headers: { "Content-Type": "application/json", Accept: "application/json" },
  withCredentials: false, // set true only if server uses cookies
});

const isAuthFree = (url) =>
  !!url && (url.includes("/Auth/login") || url.includes("/Auth/refresh"));

let isRefreshing = false;
let pendingQueue = [];

axiosInstance.interceptors.request.use((config) => {
  const { token } = useLoginStore.getState();
  if (token && !isAuthFree(config.url)) {
    config.headers.Authorization = `Bearer ${token}`;
    // console.debug("[axios] Authorization header attached");
  } else {
    delete config.headers.Authorization;
  }
  return config;
});

axiosInstance.interceptors.response.use(
  (res) => res,
  async (error) => {
    const original = error?.config;
    const status = error?.response?.status;

    if (status === 401 && !original._retry && !isAuthFree(original?.url)) {
      original._retry = true;

      // If already refreshing, wait for it to finish and retry
      if (isRefreshing) {
        return new Promise((resolve) => {
          pendingQueue.push((newToken) => {
            if (newToken) original.headers.Authorization = `Bearer ${newToken}`;
            resolve(axiosInstance(original));
          });
        });
      }

      try {
        isRefreshing = true;
        const { refreshToken } = useLoginStore.getState();
        if (!refreshToken) throw new Error("No refresh token");

        const refreshRes = await axiosInstance.post("/Auth/refresh", {
          refreshToken,
        });

        const payload = typeof refreshRes.data === "string"
          ? JSON.parse(refreshRes.data)
          : refreshRes.data;

        const newToken = payload?._data?.jwtToken;
        const newRefresh = payload?._data?.refreshToken ?? refreshToken;

        if (!newToken) throw new Error("Refresh response missing jwtToken");

        useLoginStore.getState().setToken(newToken);
        useLoginStore.getState().setRefresh(newRefresh);

        pendingQueue.forEach((fn) => fn(newToken));
        pendingQueue = [];
        original.headers.Authorization = `Bearer ${newToken}`;
        return axiosInstance(original);
      } catch (e) {
        pendingQueue.forEach((fn) => fn(null));
        pendingQueue = [];
        useLoginStore.getState().clearAuth();
        // optional: window.location.assign("/login");
        return Promise.reject(e);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
