import React from "react";
import "./index.css";
import Login from "./Components/authentication/Login";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Layout from "./Components/Dashboard/Layout";
import Master from "./Components/Dashboard/Master";
import { Sidebar } from "lucide-react";
import Dashboard from "./Components/Dashboard/Dashboard";
// import Transactions from "./Components/Dashboard/Transactions";
// import AddProductForm from "./Components/Dashboard/Addproduct";
// import Report from "./Components/Dashboard/Report";
// import Setting from "./Components/Dashboard/Setting";
// import Notification from "./Components/Dashboard/Notification";
// import Configuration from "./Components/Dashboard/Configuration";
import Addproducts from "./Components/Inventory/Addproducts";
import AddCategory from "./Components/Inventory/AddCategory";
import StockManagement from "./Components/Inventory/StockManagement";
import Suppliers from "./Components/Inventory/Suppliers";

import UnitManagement from "./Components/Management/UnitManagement";
import UserManagement from "./Components/Management/UserManagement";
import UserProfile from "./Components/Management/UserProfile";

import Analytics from "./Components/Analytics/Analytics";
import LoginPage from "./Components/authentication/Login";
import Setting from "./Components/Settings/Setting";
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/" element={<Layout />}>
          <Route path="master" element={<Master />} />
          <Route path="/dashboard" element={<Sidebar />} />
          <Route path="/analytics" element={<Dashboard />} />



          <Route path="/inventory/products" element={<Addproducts />} />
          <Route path="/inventory/categories" element={<AddCategory />} />
          <Route path="/inventory/stock" element={<StockManagement />} />
          <Route path="/inventory/suppliers" element={<Suppliers />} />

          <Route path="/reports/measurement" element={<UnitManagement />} />
          <Route path="/reports/user-management" element={<UserManagement />} />
          <Route path="/reports/userprofile" element={<UserProfile />} />

          <Route path="/analytics" element={<Analytics />} />

          <Route path="/settings" element={<Setting />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
