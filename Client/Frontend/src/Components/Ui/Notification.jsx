
import React, { useEffect } from "react";

const Notification = ({ message, type = "info", onClose }) => {
  const colors = {
    success: "bg-green-100 border-green-500 text-green-800",
    error: "bg-red-100 border-red-500 text-red-800",
    warning: "bg-yellow-100 border-yellow-500 text-yellow-800",
    info: "bg-blue-100 border-blue-500 text-blue-800",
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 3000); // Auto close in 3s
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div
      className={`fixed top-5 right-5 px-4 py-2 rounded-lg border-l-4 shadow-lg ${colors[type]}`}
    >
      {message}
    </div>
  );
};

export default Notification;
