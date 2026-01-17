import axios from "axios";
import useLoginStore from "../Store/Loginstore";
import { serverToast } from "../UI/toast";

const axiosInstance = axios.create({
  baseURL: "https://api-inventory.ndhtechnologies.com/swagger/index.html",
  headers: { "Content-Type": "application/json", Accept: "application/json" },
  withCredentials: false, 
});

const isAuthFree = (url) =>
  !!url && (url.includes("/Auth/login") || url.includes("/Auth/refresh"));

let isRefreshing = false;
let pendingQueue = [];

axiosInstance.interceptors.request.use((config) => {
  const { token } = useLoginStore.getState();
  config.headers = config.headers || {};

  if (token && !isAuthFree(config.url)) {
    config.headers.Authorization = `Bearer ${token}`; 
  } else {
    delete config.headers.Authorization;
  }
  return config;
});

axiosInstance.interceptors.response.use(
  (res) => {
    try {
        const cfg = res?.config || {};
        const method = (cfg.method || "").toLowerCase();
        const body = res?.data ?? res;

        // Attempt to extract message, type/severity, duration from common shapes
        const message =
          body?._message ??
          body?.message ??
          (body?._data && (body._data._message || body._data.message)) ??
          (typeof body === "string" ? body : undefined);

        const providedType = body?.type || body?.severity || body?.level || (body?._data && (body._data.type || body._data.severity));
        const providedDuration = body?.duration ?? body?.ttl ?? (body?._data && body._data.duration);

        // Determine toast type: prefer server-provided, else success for 2xx mutating responses
        let toastType = providedType || (res.status >= 200 && res.status < 300 ? "success" : "info");

        // Some APIs send a boolean `success` flag — if it's explicitly false treat as error
        if (body && typeof body.success === "boolean" && body.success === false) {
          toastType = "error";
        }

        // show backend messages for non-GET mutating responses unless the
        // request explicitly disabled server-toasts via `config.showToast === false`.
        if (message && method !== "get") {
          const dur = providedDuration ? Number(providedDuration) : 3500;
          if (cfg.showToast !== false) {
            serverToast(String(message), toastType, dur);
          }
        }
    } catch {
      // ignore toast failures
    }
    return res;
  },
  async (error) => {
    const original = error?.config || {};
    const status = error?.response?.status;

    if (status === 401 && !original._retry && !isAuthFree(original?.url)) {
      original._retry = true;

      if (isRefreshing) {
        return new Promise((resolve) => {
          pendingQueue.push((newToken) => {
            original.headers = original.headers || {};
            if (newToken) original.headers.Authorization = `Bearer ${newToken}`;
            resolve(axiosInstance(original));
          });
        });
      }

      try {
        isRefreshing = true;
        const { refreshToken } = useLoginStore.getState();
        if (!refreshToken) throw new Error("No refresh token");

        const refreshRes = await axiosInstance.post("/Auth/refresh", { refreshToken });

        const payload = typeof refreshRes.data === "string"
          ? JSON.parse(refreshRes.data)
          : refreshRes.data;

        const newToken = payload?._data?.jwtToken;
        const newRefresh = payload?._data?.refreshToken ?? refreshToken;
        if (!newToken) throw new Error("Refresh response missing jwtToken");

        // update store
        const { setToken, setRefresh } = useLoginStore.getState();
        setToken(newToken);
        setRefresh(newRefresh);

        // flush queue
        pendingQueue.forEach((fn) => fn(newToken));
        pendingQueue = [];

        // retry original
        original.headers = original.headers || {};
        original.headers.Authorization = `Bearer ${newToken}`;
        return axiosInstance(original);
      } catch (e) {
        pendingQueue.forEach((fn) => fn(null));
        pendingQueue = [];
        useLoginStore.getState().clearAuth();
        return Promise.reject(e);
      } finally {
        isRefreshing = false;
      }
    }

    // surface backend error message if present
    try {
      const body = error?.response?.data ?? error?.response;
      const msg = body?._message ?? body?.message ?? (body?._data && (body._data._message || body._data.message));
      if (msg && original.showToast !== false) serverToast(String(msg), "error", 6000);
    } catch {
      // ignore
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
