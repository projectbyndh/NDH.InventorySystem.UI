import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../Dashboard/Sidebar';

function Layout() {
  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex-1 p-6 bg-gray-100">
        <Outlet />
      </div>
    </div>
  );
}

export default Layout;