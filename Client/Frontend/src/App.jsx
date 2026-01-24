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
          <Route
            path="products"
            element={
              <RouteNotifier name="Products">
                <ProductCRUD />
              </RouteNotifier>
            }
          />
          <Route
            path="categories"
            element={
              <RouteNotifier name="Categories">
                <CategoryCRUD />
              </RouteNotifier>
            }
          />
          <Route
            path="vendors"
            element={
              <RouteNotifier name="Vendors">
                <VendorManager />
              </RouteNotifier>
            }
          />
          <Route
            path="warehouses"
            element={
              <RouteNotifier name="Warehouses">
                <WareHouse />
              </RouteNotifier>
            }
          />

          {/* Reports / Management */}
          <Route
            path="units"
            element={
              <RouteNotifier name="Units">
                <UnitManagement />
              </RouteNotifier>
            }
          />
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