import React from "react";
import "./index.css";
import Login from "./Components/authentication/Login";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Layout from "./Components/Dashboard/Layout";
import Master from "./Components/Dashboard/Master";
import { Sidebar } from "lucide-react";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Layout />}>
          <Route path="master" element={<Master />} />
          <Route path="dashboard" element={<Sidebar/>} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
