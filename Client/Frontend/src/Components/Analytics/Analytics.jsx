// src/components/Dashboard/Dashboard.jsx
import React, { useEffect, useState } from "react";
import DashboardService from "../Api/Dashbaordapi";
import {
  Users, Package, Tags, Building2, Warehouse,
  AlertCircle
} from "lucide-react";
import Spinner from "../UI/Spinner";

const MetricCard = ({ icon: Icon, label, value, color }) => (
  <div className="bg-white rounded-2xl shadow-lg p-6 flex items-center gap-5 hover:shadow-xl transition-all transform hover:-translate-y-1">
    <div className={`p-4 rounded-xl ${color}`}>
      <Icon className="w-7 h-7 text-white" />
    </div>
    <div>
      <p className="text-slate-600 text-sm font-medium">{label}</p>
      <p className="text-3xl font-bold text-slate-900 mt-1">{value ?? 0}</p>
    </div>
  </div>
);

export default function Dashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError("");
      try {
        const result = await DashboardService.getCounts();
        setData(result);
      } catch (err) {
        setError(err?.response?.data?._message || "Failed to load dashboard");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <div className="text-center">
          <Spinner className="w-12 h-12 text-sky-600 mx-auto mb-4" />
          <p className="text-slate-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900">Inventory Dashboard</h1>
          <p className="text-slate-600 mt-1">Real-time system overview</p>
        </div>

        {error && (
          <div className="mb-6 p-5 bg-red-50 border border-red-200 rounded-xl flex items-center gap-3 text-red-700">
            <AlertCircle className="w-6 h-6 flex-shrink-0" />
            <div>
              <p className="font-semibold">Error</p>
              <p className="text-sm">{error}</p>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
          <MetricCard icon={Users}     label="Total Users"      value={data?.totalUsers}      color="bg-sky-600" />
          <MetricCard icon={Tags}      label="Categories"       value={data?.totalCategories} color="bg-emerald-600" />
          <MetricCard icon={Package}   label="Products"         value={data?.totalProducts}   color="bg-amber-600" />
          <MetricCard icon={Building2} label="Vendors"          value={data?.totalVendors}    color="bg-purple-600" />
          <MetricCard icon={Warehouse} label="Warehouses"       value={data?.totalWareHouses} color="bg-rose-600" />
        </div>
      </div>
    </div>
  );
}