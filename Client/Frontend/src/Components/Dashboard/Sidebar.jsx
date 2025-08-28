import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Package, 
  Users, 
  BarChart3, 
  Settings, 
  FileText, 
  ShoppingCart,
  Warehouse,
  TrendingUp,
  Bell,
  Search,
  User,
  LogOut,
  ChevronDown,
  ChevronRight,
  ChevronLeft,
  Grid3X3,
  Truck,
  CreditCard,
  Shield,
  HelpCircle
} from 'lucide-react';

const ProfessionalSidebar = () => {
  const [activeMenu, setActiveMenu] = useState('dashboard');
  const [expandedMenus, setExpandedMenus] = useState({});
  const [isCollapsed, setIsCollapsed] = useState(false);

  // Responsiveness: Collapse sidebar on small screens
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1024) { // lg breakpoint, adjust as needed
        setIsCollapsed(true);
      } else {
        setIsCollapsed(false);
      }
    };

    window.addEventListener('resize', handleResize);
    handleResize(); // Initial check

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const menuItems = [
    {
      id: 'dashboard',
      title: 'Dashboard',
      icon: LayoutDashboard,
      path: '/dashboard',
      badge: null
    },
    {
      id: 'analytics',
      title: 'Analytics',
      icon: BarChart3,
      path: '/analytics',
      badge: 'New'
    },
    {
      id: 'inventory',
      title: 'Inventory',
      icon: Package,
      children: [
        { id: 'products', title: 'Products', icon: Package, path: '/inventory/products' },
        { id: 'categories', title: 'Categories', icon: Grid3X3, path: '/inventory/categories' },
        { id: 'Vendor', title: 'Stock Management', icon: Warehouse, path: '/inventory/stock' },
        { id: 'Warehouse', title: 'Suppliers', icon: Truck, path: '/inventory/suppliers' }
      ]
    },
    {
      id: 'orders',
      title: 'Orders',
      icon: ShoppingCart,
      children: [
        { id: 'all-orders', title: 'All Orders', icon: FileText, path: '/orders/all' },
        { id: 'pending', title: 'Pending', icon: TrendingUp, path: '/orders/pending', badge: '12' },
        { id: 'completed', title: 'Completed', icon: Shield, path: '/orders/completed' },
        { id: 'returns', title: 'Returns', icon: CreditCard, path: '/orders/returns' }
      ]
    },

    
    {
      id: 'reports',
      title: 'Management',
      icon: FileText,
      children: [
        { id: 'Measurement', title: 'Unit of Measurement ', icon: TrendingUp, path: '/reports/measurement' },
        { id: 'User management', title: 'User management ', icon: Package, path: '/reports/user-management' },
        { id: 'User profile', title: 'User Profile', icon: Users, path: '/reports/userprofile' }
      ]
    }
  ];

  const bottomMenuItems = [

    {
      id: 'settings',
      title: 'Settings',
      icon: Settings,
      path: '/settings'
    }
  ];

  const toggleExpanded = (menuId) => {
    setExpandedMenus(prev => ({
      ...prev,
      [menuId]: !prev[menuId]
    }));
  };

  const handleMenuClick = (menuId, hasChildren = false) => {
    if (hasChildren) {
      toggleExpanded(menuId);
    } else {
      setActiveMenu(menuId);
    }
  };

  const MenuItem = ({ item, isChild = false }) => {
    const isActive = activeMenu === item.id;
    const isExpanded = expandedMenus[item.id];
    const hasChildren = item.children && item.children.length > 0;
    const ItemComponent = item.path && !hasChildren ? Link : 'button';

    return (
      <li className={`${isChild ? 'ml-4' : ''}`}>
        <ItemComponent
          {...(item.path && !hasChildren ? { to: item.path } : {})}
          onClick={() => handleMenuClick(item.id, hasChildren)}
          className={`
            group relative flex w-full items-center gap-3 rounded-lg px-4 py-3 text-left text-sm font-medium transition-all duration-200
            ${isActive 
              ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20' 
              : 'text-gray-600 hover:bg-gray-50 hover:text-gray-800'
            }
            ${isChild ? 'pl-6 text-gray-500 hover:text-gray-700' : ''}
            focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
          `}
        >
          {/* Active indicator */}
          {isActive && !isChild && (
            <div className="absolute left-0 top-1/2 h-6 w-1 -translate-y-1/2 rounded-r bg-white"></div>
          )}
          
          {/* Icon */}
          <item.icon className={`
            h-5 w-5 shrink-0 transition-colors duration-200
            ${isActive ? 'text-white' : 'text-gray-500 group-hover:text-gray-700'}
          `} />
          
          {/* Title (hidden when collapsed) */}
          {!isCollapsed && <span className="flex-1 truncate">{item.title}</span>}
          
          {/* Badge */}
          {item.badge && !isCollapsed && (
            <span className={`
              inline-flex items-center justify-center rounded-full px-2 py-0.5 text-xs font-medium
              ${item.badge === 'New' 
                ? 'bg-green-100 text-green-700' 
                : 'bg-red-100 text-red-700'
              }
              ${isActive ? 'bg-white/30 text-white' : ''}
            `}>
              {item.badge}
            </span>
          )}
          
          {/* Chevron for expandable items */}
          {hasChildren && !isCollapsed && (
            <ChevronDown className={`
              h-4 w-4 shrink-0 transition-transform duration-200
              ${isExpanded ? 'rotate-180' : ''}
              ${isActive ? 'text-white' : 'text-gray-400 group-hover:text-gray-600'}
            `} />
          )}
        </ItemComponent>
        
        {/* Submenu */}
        {hasChildren && isExpanded && !isCollapsed && (
          <ul className="mt-1 space-y-1 border-l-2 border-gray-100 pl-3">
            {item.children.map(child => (
              <MenuItem key={child.id} item={child} isChild={true} />
            ))}
          </ul>
        )}
      </li>
    );
  };

  return (
    <aside className={`
      fixed left-0 top-0 z-40 flex h-screen flex-col bg-white shadow-lg transition-all duration-300 ease-in-out
      ${isCollapsed ? 'w-16' : 'w-64'}
      border-r border-gray-200 overflow-hidden
      lg:w-64 lg:translate-x-0 // Always expanded on lg screens
    `}>
      {/* Header */}
      <div className="flex items-center justify-between border-b border-gray-200 px-4 py-3">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600">
            <Package className="h-5 w-5 text-white" />
          </div>
          {!isCollapsed && (
            <div>
              <h1 className="text-base font-semibold text-gray-900">InvenPro</h1>
              <p className="text-xs text-gray-500">Inventory Management</p>
            </div>
          )}
        </div>
        
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="rounded-md p-1 text-gray-500 hover:bg-gray-100 hover:text-gray-700 transition-colors lg:hidden"
        >
          {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </button>
      </div>




      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-2 py-4">
        <ul className="space-y-1">
          {menuItems.map(item => (
            <MenuItem key={item.id} item={item} />
          ))}
        </ul>
        
        {/* Divider */}
        <div className="my-4 border-t border-gray-200"></div>
        
        {/* Bottom Menu Items */}
        <ul className="space-y-1">
          {bottomMenuItems.map(item => (
            <MenuItem key={item.id} item={item} />
          ))}
        </ul>
      </nav>

      {/* User Profile */}
      <div className="border-t border-gray-200 p-3">
        <div className="flex items-center gap-2 rounded-md bg-gray-50 p-2">
          <div className="h-8 w-8 rounded-full bg-blue-600 flex items-center justify-center">
            <User className="h-4 w-4 text-white" />
          </div>
          {!isCollapsed && (
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">John Doe</p>
              <p className="text-xs text-gray-500 truncate">Administrator</p>
            </div>
          )}
          {!isCollapsed && (
            <button className="rounded-md p-1 text-gray-500 hover:bg-gray-200 hover:text-gray-700 transition-colors">
              <LogOut className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>
    </aside>
  );
};

export default ProfessionalSidebar; 