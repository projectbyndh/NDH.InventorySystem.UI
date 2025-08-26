import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  Bell,
  Box,
  Cog,
  FileText,
  LayoutDashboard,
  LogOut,
  TrendingUp,
} from "lucide-react";

const menuItems = [
  { title: "Dashboard", url: "/moduledashboard", icon: LayoutDashboard },
  { title: "Master", url: "/modulemaster", icon: Box },
  { title: "Transaction", url: "/moduletransaction", icon: TrendingUp },
  { title: "Report", url: "/modulereport", icon: FileText },
  { title: "Configuration", url: "/moduleconfiguration", icon: Cog },
  { title: "Notification", url: "/modulenotification", icon: Bell },
];

function Sidebar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    navigate("/login");
  };

  const linkBase =
    "group relative flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[--color-primary-500]";
  const linkInactive =
    "text-gray-700 hover:bg-gray-100 aria-[current=page]:text-[--color-primary-700]";
  const linkActive =
    "bg-[--color-primary-50] text-[--color-primary-700]";

  return (
    <aside
      className="fixed left-0 top-0 z-40 h-screen w-[260px] bg-white border-r border-gray-200 shadow-sm flex flex-col rounded-r-xl"
      role="navigation"
      aria-label="Main sidebar"
    >
      {/* Header */}
      <div className="flex items-center gap-3 px-4 h-16 border-b border-gray-200">
        <div className="flex h-10 w-10 items-center justify-center rounded-md bg-[--color-primary-600]">
          <Box className="h-6 w-6 text-white" />
        </div>
        <div className="leading-tight">
          <div className="text-base font-semibold text-gray-900">
            NDH Inventory
          </div>
          <div className="text-xs text-gray-500">System</div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-3 py-3" role="menu">
        <ul className="space-y-1">
          {menuItems.map((item) => (
            <li key={item.title}>
              <NavLink
                to={item.url}
                className={({ isActive }) =>
                  [
                    linkBase,
                    isActive ? linkActive : linkInactive,
                  ].join(" ")
                }
                role="menuitem"
                aria-label={`Navigate to ${item.title}`}
              >
                {/* Active left bar */}
                <span
                  className={
                    "absolute left-0 top-1/2 -translate-y-1/2 h-6 w-[3px] rounded-full " +
                    "bg-[--color-primary-600] " +
                    "opacity-0 group-aria-[current=page]:opacity-100"
                  }
                  aria-hidden="true"
                />
                <item.icon className="h-5 w-5 shrink-0" />
                <span className="truncate">{item.title}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      <div className="mt-auto border-t border-gray-200 px-3 py-3">
        <NavLink
          to="/settings"
          className={({ isActive }) =>
            [
              linkBase,
              "w-full",
              isActive ? linkActive : linkInactive,
            ].join(" ")
          }
          role="menuitem"
          aria-label="Open Settings"
        >
          <span
            className={
              "absolute left-0 top-1/2 -translate-y-1/2 h-6 w-[3px] rounded-full " +
              "bg-[--color-primary-600] " +
              "opacity-0 group-aria-[current=page]:opacity-100"
            }
            aria-hidden="true"
          />
          <Cog className="h-5 w-5" />
          <span>Settings</span>
        </NavLink>

        <button
          onClick={handleLogout}
          className="group mt-2 w-full flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[--color-primary-500]"
          aria-label="Logout"
        >
          <LogOut className="h-5 w-5" />
          <span className="truncate">Log out</span>
        </button>

        <p className="mt-3 text-center text-[11px] text-gray-400">NDH Pvt. Ltd.</p>
      </div>
    </aside>
  );
}

export default Sidebar;
