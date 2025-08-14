// sidebar.jsx
import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
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
  { title: 'Dashboard', url: '/moduledashboard', icon: LayoutDashboard },
  { title: 'Master', url: '/modulemaster', icon: Box },
  { title: 'Transaction', url: '/moduletransaction', icon: TrendingUp },
  { title: 'Report', url: '/modulereport', icon: FileText },
  { title: 'Configuration', url: '/moduleconfiguration', icon: Cog },
  { title: 'Notification', url: '/modulenotification', icon: Bell },
];

function Sidebar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    navigate('/login');
  };

  return (
<div class="absolute top-4 left-4 w-[260px] h-[960px] flex justify-between pt-[1px] pr-[3.33px] pb-[1px] pl-[3.33px] opacity-100 rotate-0 bg-gray-100 rounded-lg">      <div className="flex items-center justify-between p-[--spacing-200] border-b-[--border-md] border-[--color-neutral-black-300]">
        <div className="flex items-center">
          <div className="flex h-[40px] w-[40px] items-center justify-center rounded-md bg-[--color-primary-600]">
            <Box className="h-6 w-6 text-[--color-neutral-white-100]" />
          </div>
          <div className="flex flex-col ml-[--spacing-100]">
            <span className="text-h3-semibold text-[--color-neutral-black-500]">NDH Inventory</span>
            <span className="text-body-xsmall-regular text-[--color-neutral-black-400]">System</span>
          </div>
        </div>
      </div>

      <div className="flex-1 p-[--spacing-200] space-y-[--spacing-100]">
        {menuItems.map((item) => (
          <NavLink
            key={item.title}
            to={item.url}
            className={({ isActive }) =>
              `flex items-center text-body-large-regular rounded-md py-[--spacing-100] px-[--spacing-200] ${
                isActive
                  ? 'text-[--color-neutral-white-100] bg-[--color-primary-500]'
                  : 'text-[--color-neutral-black-500] hover:bg-[--color-neutral-white-300]'
              } focus:outline-none transition-colors`
            }
            aria-label={`Navigate to ${item.title}`}
            role="menuitem"
          >
            <item.icon className="h-5 w-5 mr-[--spacing-100]" />
            <span className="truncate">{item.title}</span>
          </NavLink>
        ))}
      </div>

      <div className="p-[--spacing-200] border-t-[--border-md] border-[--color-neutral-black-300] space-y-[--spacing-200]">
        <div className="text-body-medium-regular text-[--color-neutral-black-500]">Setting</div>
        <button
          onClick={handleLogout}
          className="flex items-center w-full text-body-medium-regular text-[--color-neutral-black-500] hover:text-[--color-primary-500] py-[--spacing-100] px-[--spacing-200] rounded-md hover:bg-[--color-neutral-white-300] transition-colors"
          aria-label="Logout"
          role="button"
        >
          <LogOut className="h-4 w-4 mr-[--spacing-100]" />
          <span>Log out</span>
        </button>
        <div className="text-center">
          <p className="text-body-xsmall-regular text-[--color-neutral-black-400]">NDH Pvt. Ltd.</p>
        </div>
      </div>
    </div>
  );
}

export default Sidebar;
