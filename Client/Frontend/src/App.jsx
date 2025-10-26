// src/App.jsx
import React from "react";
import "./index.css";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Layout from "./Components/Dashboard/Layout";
import Master from "./Components/Dashboard/Master";
import Dashboard from "./Components/Dashboard/Dashboard";
import Addproducts from "./Components/Inventory/Addproducts";
import AddCategory from "./Components/Inventory/AddCategory";
import StockManagement from "./Components/Inventory/StockManagement";
import Suppliers from "./Components/Inventory/Suppliers";
import UnitManagement from "./Components/Management/UnitManagement";
import UserManagement from "./Components/Management/UserManagement";
import UserProfile from "./Components/Management/UserProfile";
import Analytics from "./Components/Analytics/Analytics";
import LoginPage from "./Components/Authentication/Login";
import Setting from "./Components/Settings/Setting";
import ProtectedRoute from "./Components/Authentication/ProtectedRoute";
import PublicOnlyRoute from "./Components/Authentication/ProtectedRoute";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public-only route */}
        <Route
          path="/login"
          element={
            <PublicOnlyRoute>
              <LoginPage />
            </PublicOnlyRoute>
          }
        />

        {/* Protected routes */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }
        >
          {/* redirect "/" to "/dashboard" */}
          <Route index element={<Navigate to="dashboard" replace />} />

          {/* NOTE: child paths are RELATIVE (no leading slash) */}
          <Route path="master" element={<Master />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="analytics" element={<Analytics />} />

          <Route path="inventory/products" element={<Addproducts />} />
          <Route path="inventory/categories" element={<AddCategory />} />
          <Route path="inventory/stock" element={<StockManagement />} />
          <Route path="inventory/suppliers" element={<Suppliers />} />

          <Route path="reports/measurement" element={<UnitManagement />} />
          <Route path="reports/user-management" element={<UserManagement />} />
          <Route path="reports/userprofile" element={<UserProfile />} />

          <Route path="settings" element={<Setting />} />
        </Route>

        {/* Catch-all (optional): */}
        {/* <Route path="*" element={<Navigate to="/dashboard" replace />} /> */}
      </Routes>
    </BrowserRouter>
  );
}

export default App;
