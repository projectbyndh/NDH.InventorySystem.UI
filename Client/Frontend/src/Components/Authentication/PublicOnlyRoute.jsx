import React, { useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import useLoginStore from "../Store/Loginstore";

const PublicOnlyRoute = ({ children }) => {
  const token = useLoginStore((s) => s.token);
  const [hydrated, setHydrated] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const unsub = useLoginStore.persist?.onFinishHydration?.(() => {
      setHydrated(true);
    });
    if (useLoginStore.persist?.hasHydrated?.()) setHydrated(true);
    return () => unsub?.();
  }, []);

  if (!hydrated) return null; // or a tiny loader

  // If already logged in, keep them out of /login
  if (token) {
    return <Navigate to="/dashboard" replace state={{ from: location }} />;
  }

  return children;
};

export default PublicOnlyRoute;
