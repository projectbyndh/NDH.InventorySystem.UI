// This file exposes two APIs:
// - `showToast` and `toast` (no-op) for component-level calls (kept no-op)
// - `serverToast` for server/API-originated messages (uses react-toastify)

// Component-level API (no-op): components will call `showToast` or `toast.*`
// but those calls produce no UI. This keeps code paths safe but silent.
export function showToast(message, type = "info", duration = 4000) {
  // intentionally no-op for component-level calls
  return null;
}

export const toast = {
  success: (_msg, _opts) => null,
  error: (_msg, _opts) => null,
  info: (_msg, _opts) => null,
  warn: (_msg, _opts) => null,
  loading: (_msg, _opts) => null,
  update: (_id, _options) => null,
  dismiss: (_id) => null,
};

// Server/API level toasts: import react-toastify here and expose a
// `serverToast` function. Only the Axios interceptor should call this.
import { toast as rtToast } from "react-toastify";

export function serverToast(message, type = "info", duration = 4000) {
  if (!message) return null;
  const opts = { autoClose: Number(duration) || 4000, pauseOnHover: true };
  try {
    switch ((type || "").toLowerCase()) {
      case "success":
        return rtToast.success(String(message), opts);
      case "error":
        return rtToast.error(String(message), opts);
      case "warn":
      case "warning":
        return rtToast.warn(String(message), opts);
      case "info":
      default:
        return rtToast.info(String(message), opts);
    }
  } catch (e) {
    // fallback: log
    console[type === "error" ? "error" : "log"](message);
    return null;
  }
}

export default toast;
