// src/Components/Authentication/ProtectedRoute.jsx
import React, { useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import useLoginStore from "../Store/Loginstore";
import Spinner from "../Ui/Spinner";

const ProtectedRoute = ({ children }) => {
  const token = useLoginStore((s) => s.token);
  const [hydrated, setHydrated] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const store = useLoginStore.persist;

    // If already hydrated
    if (store?.hasHydrated?.()) {
      setHydrated(true);
      return;
    }

    // Wait for hydration to finish
    const unsubscribe = store?.onFinishHydration?.(() => {
      setHydrated(true);
    });

    return () => unsubscribe?.();
  }, []);

  // Show a clean loader while checking auth
  if (!hydrated) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <Spinner size={10} className="text-blue-600" />
      </div>
    );
  }

  // Not logged in → go to login
  if (!token) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  // Logged in → show page
  return children;
};

export default ProtectedRoute;