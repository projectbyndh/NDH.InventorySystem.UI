// src/App.jsx
import React from "react";
import "./index.css";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Layout from "./Components/Dashboard/Layout";
import Master from "./Components/Dashboard/Master";
import Dashboard from "./Components/Dashboard/Dashboard";
import Addproducts from "./Components/Inventory/Addproducts";
import AddCategory from "./Components/Inventory/AddCategory";
import UnitManagement from "./Components/Management/UnitManagement";
import UserManagement from "./Components/Management/UserManagement";
import UserProfile from "./Components/Management/UserProfile";
import Analytics from "./Components/Analytics/Analytics";
import LoginPage from "./Components/Authentication/Login";
import Setting from "./Components/Settings/Setting";
import VendorManager from "./Components/Inventory/VendorManager";
import RouteNotifier from "./Components/Ui/RouteNotifier";
import ProtectedRoute from "./Components/Authentication/ProtectedRoute";
import PublicOnlyRoute from "./Components/Authentication/PublicOnlyRoute";
import CategoryCRUD from "./Components/Inventory/CategoryCRUD";
import WareHouse from "./Components/Inventory/WareHouse";
import ProductCRUD from "./Components/Inventory/ProductCrud";

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

          <Route path="master" element={<Master />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="analytics" element={<Analytics />} />

          {/* Inventory */}
          <Route
            path="inventory/products"
            element={
              <RouteNotifier name="Products">
                <Addproducts />
              </RouteNotifier>
            }
          />
          <Route
            path="inventory/categories"
            element={
              <RouteNotifier name="Categories">
                <AddCategory />
              </RouteNotifier>
            }
          />
          <Route
            path="inventory/vendordetails"
            element={
              <RouteNotifier name="Vendor Manager">
                <VendorManager />
              </RouteNotifier>
            }
          />
          <Route
            path="inventory/warehouse"
            element={
              <RouteNotifier name="Warehouse">
                <WareHouse />
              </RouteNotifier>
            }
          />

          {/* Reports */}
          <Route
            path="reports/measurement"
            element={
              <RouteNotifier name="Unit Management">
                <UnitManagement />
              </RouteNotifier>
            }
          />
          <Route
            path="reports/user-management"
            element={
              <RouteNotifier name="User Management">
                <UserManagement />
              </RouteNotifier>
            }
          />
          <Route
            path="reports/userprofile"
            element={
              <RouteNotifier name="User Profile">
                <UserProfile />
              </RouteNotifier>
            }
          />

          {/* CATEGORY CRUD – FIXED PATH */}
          <Route
            path="inventory/category-rdu"
            element={
              <RouteNotifier name="Category CRUD">
                <CategoryCRUD />
              </RouteNotifier>
            }
          />
          <Route
            path="inventory/product-crud"
            element={
              <RouteNotifier name="Product CRUD">
                <ProductCRUD />
              </RouteNotifier>
            }
          />

          {/* vendor details*/}
          <Route path="settings" element={<Setting />} />
        </Route>

        {/* 404 */}
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;