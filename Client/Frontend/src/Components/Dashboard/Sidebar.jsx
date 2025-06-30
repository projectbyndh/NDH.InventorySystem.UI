import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  Bell,
  Box,
  Cog,
  FileText,
  LayoutDashboard,
  LogOut,
  Settings,
  TrendingUp,
} from 'lucide-react';

const menuItems = [
  { title: 'Dashboard', url: '/dashboard', icon: LayoutDashboard },
  { title: 'Master', url: '/master', icon: Box },
  { title: 'Transaction', url: '/transaction', icon: TrendingUp },
  { title: 'Report', url: '/report', icon: FileText },
  { title: 'Configuration', url: '/configuration', icon: Cog },
  { title: 'Notification', url: '/notification', icon: Bell },
  { title: 'Settings', url: '/settings', icon: Settings },
];

function Sidebar() {
  return (
    <div className="flex h-screen w-64 flex-col bg-white border-r border-gray-200 transition-all duration-300 ease-in-out lg:w-64 md:w-20 sm:w-16 xs:w-0">
      <div className="p-4 flex items-center border-b border-gray-200">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-600">
          <Box className="h-6 w-6 text-white" />
        </div>
        <div className="flex flex-col ml-3">
          <span className="text-sm font-semibold text-gray-900">NDH Inventory</span>
          <span className="text-xs text-gray-500">System</span>
        </div>
      </div>

      <div className="flex-1 p-2 space-y-1 overflow-y-auto">
        {menuItems.map((item) => (
          <NavLink
            key={item.title}
            to={item.url}
            className={({ isActive }) =>
              `flex items-center w-full text-base font-normal ${
                isActive ? 'text-white bg-blue-600' : 'text-gray-700'
              } py-2 px-3 rounded hover:bg-gray-100 focus:outline-none`
            }
          >
            <item.icon className="h-5 w-5 mr-2" />
            <span className="truncate">{item.title}</span>
          </NavLink>
        ))}
      </div>

      <div className="p-2 border-t border-gray-200">
        <NavLink
          to="/logout"
          className={({ isActive }) =>
            `flex items-center w-full text-gray-500 hover:text-gray-700 py-2 px-3 rounded hover:bg-gray-100 focus:outline-none ${
              isActive ? 'text-white bg-blue-600' : ''
            }`
          }
        >
          <LogOut className="h-4 w-4 mr-2" />
          <span>Log out</span>
        </NavLink>
        <div className="mt-2 px-2">
          <p className="text-xs text-gray-500">Manandhar Store Pvt. Ltd.</p>
        </div>
      </div>
    </div>
  );
}

export default Sidebar;