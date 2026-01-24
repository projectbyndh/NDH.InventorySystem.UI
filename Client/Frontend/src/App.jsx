import React from "react";
import "./index.css";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import CategoryList from "./Components/Inventory/Category/CategoryList";
import CategoryForm from "./Components/Inventory/Category/CategoryForm";
import ProductList from "./Components/Inventory/Product/ProductList";
import ProductForm from "./Components/Inventory/Product/ProductForm";
import WarehouseList from "./Components/Inventory/Warehouse/WarehouseList";
import WarehouseForm from "./Components/Inventory/Warehouse/WarehouseForm";
import VendorList from "./Components/Inventory/Vendor/VendorList";
import VendorForm from "./Components/Inventory/Vendor/VendorForm";
import UnitList from "./Components/Inventory/Unit/UnitList";
import UnitForm from "./Components/Inventory/Unit/UnitForm";

// Infrastructure & Shared
import Layout from "./Components/Dashboard/Layout";
import Master from "./Components/Dashboard/Master";
import Dashboard from "./Components/Dashboard/Dashboard";
import Analytics from "./Components/Analytics/Analytics";
import LoginPage from "./Components/Authentication/Login";
import Setting from "./Components/Settings/Setting";
import RouteNotifier from "./Components/Ui/RouteNotifier";
import ProtectedRoute from "./Components/Authentication/ProtectedRoute";
import PublicOnlyRoute from "./Components/Authentication/PublicOnlyRoute";

// Management
import UserManagement from "./Components/Management/UserManagement";
import UserProfile from "./Components/Management/UserProfile";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public */}
        <Route
          path="/login"
          element={
            <PublicOnlyRoute>
              <LoginPage />
            </PublicOnlyRoute>
          }
        />

        {/* Protected Dashboard */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="dashboard" replace />} />

          <Route
            path="dashboard"
            element={
              <RouteNotifier name="Dashboard">
                <Dashboard />
              </RouteNotifier>
            }
          />
          <Route
            path="analytics"
            element={
              <RouteNotifier name="Analytics">
                <Analytics />
              </RouteNotifier>
            }
          />
          <Route
            path="master"
            element={
              <RouteNotifier name="Product Master">
                <Master />
              </RouteNotifier>
            }
          />

          {/* Inventory */}
          <Route path="products">
            <Route index element={<RouteNotifier name="Products"><ProductList /></RouteNotifier>} />
            <Route path="new" element={<RouteNotifier name="New Product"><ProductForm /></RouteNotifier>} />
            <Route path="edit/:id" element={<RouteNotifier name="Edit Product"><ProductForm /></RouteNotifier>} />
          </Route>

          <Route path="categories">
            <Route index element={<RouteNotifier name="Categories"><CategoryList /></RouteNotifier>} />
            <Route path="new" element={<RouteNotifier name="New Category"><CategoryForm /></RouteNotifier>} />
            <Route path="edit/:id" element={<RouteNotifier name="Edit Category"><CategoryForm /></RouteNotifier>} />
          </Route>

          <Route path="vendors">
            <Route index element={<RouteNotifier name="Vendors"><VendorList /></RouteNotifier>} />
            <Route path="new" element={<RouteNotifier name="New Vendor"><VendorForm /></RouteNotifier>} />
            <Route path="edit/:id" element={<RouteNotifier name="Edit Vendor"><VendorForm /></RouteNotifier>} />
          </Route>

          <Route path="warehouses">
            <Route index element={<RouteNotifier name="Warehouses"><WarehouseList /></RouteNotifier>} />
            <Route path="new" element={<RouteNotifier name="New Warehouse"><WarehouseForm /></RouteNotifier>} />
            <Route path="edit/:id" element={<RouteNotifier name="Edit Warehouse"><WarehouseForm /></RouteNotifier>} />
          </Route>

          {/* Reports / Management */}
          <Route path="units">
            <Route index element={<RouteNotifier name="Units"><UnitList /></RouteNotifier>} />
            <Route path="new" element={<RouteNotifier name="New Unit"><UnitForm /></RouteNotifier>} />
            <Route path="edit/:id" element={<RouteNotifier name="Edit Unit"><UnitForm /></RouteNotifier>} />
          </Route>

          <Route
            path="users"
            element={
              <RouteNotifier name="Users">
                <UserManagement />
              </RouteNotifier>
            }
          />
          <Route
            path="profile"
            element={
              <RouteNotifier name="Profile">
                <UserProfile />
              </RouteNotifier>
            }
          />

          {/* Settings */}
          <Route path="settings" element={<Setting />} />
        </Route>

        {/* 404 */}
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;