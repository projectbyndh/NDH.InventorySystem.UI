import React from "react";
import "./index.css";
import Login from "./Components/authentication/Login";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Layout from "./Components/Dashboard/Layout";
import Master from "./Components/Dashboard/Master";
import { Sidebar } from "lucide-react";
import Dashboard from "./Components/Dashboard/Dashboard";
import Transactions from "./Components/Dashboard/Transactions";
import AddProductForm from "./Components/Dashboard/Addproduct";
import Report from "./Components/Dashboard/Report";
import Setting from "./Components/Dashboard/Setting";
import Notification from "./Components/Dashboard/Notification";
import Configuration from "./Components/Dashboard/Configuration";
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Layout />}>
          <Route path="master" element={<Master />} />
          <Route path="/dashboard" element={<Sidebar />} />
          <Route path="/moduledashboard" element={<Dashboard />} />
          <Route path="/modulemaster" element={<Master />} />
          <Route path="/moduletransaction" element={<Transactions />} />
          <Route path="/addproduct" element={<AddProductForm />} />
          <Route path="/modulereport" element={<Report />} />
          <Route path="/settings" element={<Setting />} />
          <Route path="/modulenotification" element={<Notification />} />
          <Route path="/moduleconfiguration" element={<Configuration />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App;
