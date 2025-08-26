import React, { useMemo, useState } from "react";

// Updated sample data for reports with more IMS-like fields
const sampleReports = [
  { sn: 1, name: "Inventory Valuation Report", code: "INV_VAL_001", type: "Monthly", format: "PDF", enabled: true, schedule: "End of Month" },
  { sn: 2, name: "Stock Aging Analysis", code: "STK_AGE_002", type: "Quarterly", format: "Excel", enabled: true, schedule: "Quarter End" },
  { sn: 3, name: "Sales by Product Category", code: "SLS_CAT_003", type: "Weekly", format: "PDF", enabled: false, schedule: "Every Sunday" },
  { sn: 4, name: "Purchase Order Summary", code: "PUR_SUM_004", type: "Daily", format: "CSV", enabled: true, schedule: "Daily 6PM" },
  { sn: 5, name: "Supplier Performance Metrics", code: "SUP_PER_005", type: "Monthly", format: "Excel", enabled: true, schedule: "Month Start" },
  { sn: 6, name: "Low Stock Reorder Report", code: "LOW_STK_006", type: "Real-time", format: "Email", enabled: true, schedule: "As Needed" },
  { sn: 7, name: "Warehouse Utilization Report", code: "WAR_UTL_007", type: "Bi-weekly", format: "PDF", enabled: false, schedule: "Every 15 Days" },
  { sn: 8, name: "Returns and Refunds Analysis", code: "RET_REF_008", type: "Monthly", format: "Excel", enabled: true, schedule: "Month End" },
  { sn: 9, name: "Demand Forecasting Report", code: "DEM_FOR_009", type: "Quarterly", format: "PDF", enabled: true, schedule: "Quarter Start" },
  { sn: 10, name: "Audit Compliance Checklist", code: "AUD_COM_010", type: "Annual", format: "PDF", enabled: false, schedule: "Year End" },
];

const reportCategories = [
  "Inventory",
  "Sales",
  "Purchases",
  "Warehouse",
  "Compliance",
];

export default function Report() {
  const [category, setCategory] = useState("Inventory");
  const [search, setSearch] = useState("");
  const [sortKey, setSortKey] = useState("sn");
  const [sortDir, setSortDir] = useState("asc");

  const filtered = useMemo(() => {
    const byCat = sampleReports.filter((r) => true); // Can add category filter
    const bySearch = search
      ? byCat.filter((r) =>
          [r.name, r.code, r.schedule].some((f) => f.toLowerCase().includes(search.toLowerCase()))
        )
      : byCat;
    const sorted = [...bySearch].sort((a, b) => {
      const A = a[sortKey];
      const B = b[sortKey];
      let cmp = 0;
      if (typeof A === "string") cmp = A.localeCompare(B);
      else cmp = A - B;
      return sortDir === "asc" ? cmp : -cmp;
    });
    return sorted;
  }, [search, sortKey, sortDir]);

  return (
    <div className="min-h-screen bg-gray-50 ">
      <header className="sticky top-0 z-10 bg-white/90 backdrop-blur-md border-b shadow-sm">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <button className="text-sm text-gray-600 hover:text-gray-900 flex items-center gap-2">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="15 18 9 12 15 6"></polyline>
            </svg>
            Back to Reports
          </button>
          <div className="flex items-center gap-4">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-64 rounded-full border border-gray-300 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 placeholder-gray-400"
              placeholder="Search by Report Name, Code or Schedule"
            />
            <div className="h-8 w-8 rounded-full bg-indigo-500 flex items-center justify-center text-white text-sm">U</div>
            <span className="text-sm font-medium text-gray-700">Admin User</span>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
        <nav className="text-sm text-gray-500 mb-4 flex items-center gap-2">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
          Reports / Report Configuration
        </nav>

        <div className="mb-6 flex justify-between items-center">
          <h1 className="text-3xl font-semibold text-gray-900 flex items-center gap-2">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M3 3h18v18H3zM21 3v18" />
            </svg>
            Report Configuration
          </h1>
          <button className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 flex items-center gap-2">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 4v16m8-8H4" />
            </svg>
            Add New Report
          </button>
        </div>

        <section className="rounded-xl bg-white shadow-lg ring-1 ring-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-gray-50">
            <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              Report List
            </h2>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full sm:w-auto rounded-xl border border-gray-300 bg-white px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              {reportCategories.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>

          <div className="px-6 py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-gray-50">
            <div className="flex items-center gap-2 flex-1">
              <label className="text-sm font-medium text-gray-700">Search:</label>
              <div className="relative w-full">
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full rounded-xl border border-gray-300 pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="Search reports..."
                />
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="11" cy="11" r="8"></circle>
                    <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                  </svg>
                </span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <label className="text-sm font-medium text-gray-700">Sort By:</label>
              <select
                value={sortKey}
                onChange={(e) => setSortKey(e.target.value)}
                className="rounded-xl border border-gray-300 bg-white px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="sn">S.N</option>
                <option value="name">Name</option>
                <option value="code">Code</option>
                <option value="type">Type</option>
              </select>
              <button
                onClick={() => setSortDir((d) => (d === "asc" ? "desc" : "asc"))}
                className="rounded-xl border border-gray-300 px-3 py-2 text-sm hover:bg-gray-100"
              >
                {sortDir === "asc" ? "↑" : "↓"}
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  {["S.N", "Report Name", "Code", "Type", "Format", "Schedule", "Enabled", "Action"].map((header) => (
                    <th key={header} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filtered.map((row, idx) => (
                  <tr key={row.code} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{idx + 1}</td>
                    <td className="px-6 py-4 text-sm text-gray-900">{row.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{row.code}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{row.type}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{row.format}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{row.schedule}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${row.enabled ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>
                        {row.enabled ? "Enabled" : "Disabled"}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-right">
                      <button className="text-indigo-600 hover:text-indigo-900 mr-4">Edit</button>
                      <button className="text-red-600 hover:text-red-900">Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="px-6 py-4 border-t bg-gray-50 flex items-center justify-between">
            <span className="text-sm text-gray-700">Showing 1 to {filtered.length} of {sampleReports.length} reports</span>
            <div className="flex gap-2">
              <button className="px-4 py-2 text-sm text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50">Previous</button>
              <button className="px-4 py-2 text-sm text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50">Next</button>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};