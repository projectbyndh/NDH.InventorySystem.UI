import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import { Menu } from "lucide-react";

function Layout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="flex h-screen">
      <div
        className={`fixed inset-y-0 left-0 transform ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0 transition-transform duration-300 ease-in-out z-30 bg-white`}
      >
        <Sidebar />
      </div>
      <div className="flex-1 p-6 bg-gray-100 lg:ml-64">
        <button
          className="lg:hidden p-2 bg-gray-200 rounded-md mb-4"
          onClick={toggleSidebar}
        >
          <Menu className="h-6 w-6" />
        </button>
        <Outlet />
      </div>
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden"
          onClick={toggleSidebar}
        />
      )}
    </div>
  );
}

export default Layout;
