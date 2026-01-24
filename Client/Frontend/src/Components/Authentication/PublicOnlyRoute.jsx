import React, { useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import useLoginStore from "../Store/Loginstore";
import Spinner from "../Ui/Spinner";

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

  if (!hydrated) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <Spinner size={10} className="text-blue-600" />
      </div>
    );
  }

  // If already logged in, keep them out of /login
  if (token) {
    return <Navigate to="/dashboard" replace state={{ from: location }} />;
  }

  return children;
};

export default PublicOnlyRoute;
