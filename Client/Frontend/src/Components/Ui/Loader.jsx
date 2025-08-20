// src/components/ui/Loader.jsx
import React from "react";

const Loader = ({ type = "spinner", size = "md" }) => {
  const sizes = {
    sm: "w-4 h-4 border-2",
    md: "w-8 h-8 border-4",
    lg: "w-12 h-12 border-4",
  };

  if (type === "spinner") {
    return (
      <div className="flex items-center justify-center p-4">
        <div
          className={`${sizes[size]} border-blue-600 border-t-transparent rounded-full animate-spin`}
        ></div>
      </div>
    );
  }

  if (type === "skeleton") {
    return (
      <div className="space-y-3 p-4 w-full">
        <div className="h-4 bg-gray-200 rounded w-3/4 animate-pulse"></div>
        <div className="h-4 bg-gray-200 rounded w-1/2 animate-pulse"></div>
        <div className="h-4 bg-gray-200 rounded w-full animate-pulse"></div>
      </div>
    );
  }

  return null;
};

export default Loader;
