// src/Components/Authentication/PublicOnlyRoute.jsx
import { Navigate } from "react-router-dom";
import useLoginStore from "../Store/Loginstore";

const PublicOnlyRoute = ({ children }) => {
  const token = useLoginStore((s) => s.token);
  const hasHydrated =
    useLoginStore.persist?.hasHydrated?.() ?? true;

  if (!hasHydrated) return null;
  return token ? <Navigate to="/dashboard" replace /> : children;
};

export default PublicOnlyRoute;
