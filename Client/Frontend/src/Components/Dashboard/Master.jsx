import React, { useMemo, useState } from "react";

// Sample data for products
const sampleData = [
  { sn: 1, name: "HP DeskJet Wireless Color", code: "93731", unit: "Pcs", pr: 1120, sr: 1550, vat: true },
  { sn: 2, name: "Apple Pencil (2nd Generation) White", code: "78577", unit: "Pcs", pr: 731, sr: 1650, vat: false },
  { sn: 3, name: "Apple Lightning to USB Cable", code: "30321", unit: "Pcs", pr: 1400, sr: 2000, vat: false },
  { sn: 4, name: "HP DeskJet Wireless Color", code: "44322", unit: "Pcs", pr: 1400, sr: 1500, vat: true },
  { sn: 5, name: "Fjallraven Women's Kanken Backpack", code: "32116", unit: "Pcs", pr: 2440, sr: 2550, vat: false },
  { sn: 6, name: "YETI Rambler Jr. 12 oz Kids Bottle", code: "68545", unit: "Pcs", pr: 1876, sr: 2250, vat: true },
  { sn: 7, name: "TV 24\" Professional LED Monitor HDMI", code: "40322", unit: "Pcs", pr: 81, sr: 2850, vat: false },
  { sn: 8, name: "Dakine Accessory Case", code: "69822", unit: "Pcs", pr: 1995, sr: 2600, vat: true },
  { sn: 9, name: "Mead Spiral Notebooks 6 Pack", code: "48144", unit: "Pcs", pr: 750, sr: 4000, vat: false },
  { sn: 10, name: "Travel Laptop Backpack", code: "45453", unit: "Pcs", pr: 1400, sr: 1500, vat: true },
];

// Available product categories
const categories = [
  "Accessories",
  "Electronics",
  "Peripherals",
  "Household",
  "Stationery",
];

export default function Master() {
  const [category, setCategory] = useState("Accessories");
  const [search, setSearch] = useState("");
  const [sortKey, setSortKey] = useState("sn");
  const [sortDir, setSortDir] = useState("asc");

  // Memoized filtered and sorted data
  const filtered = useMemo(() => {
    const byCat = sampleData; // Replace with category filter when real categories are implemented
    const bySearch = search
      ? byCat.filter((r) =>
          [r.name, r.code].some((f) => f.toLowerCase().includes(search.toLowerCase()))
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
  }, [category, search, sortKey, sortDir]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sticky Header */}
      <header className="sticky top-0 z-10 bg-white/90 backdrop-blur-md border-b shadow-sm">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <button className="text-sm text-gray-600 hover:text-gray-900 flex items-center gap-2">
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="15 18 9 12 15 6"></polyline>
            </svg>
            Back to Master
          </button>
          <div className="flex items-center gap-4">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-64 rounded-full border border-gray-300 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 placeholder-gray-400"
              placeholder="Search by Item Name or Code"
            />
            <div className="h-8 w-8 rounded-full bg-gray-200"></div>
            <span className="text-sm font-medium text-gray-700">Manandhar Store Pvt. Ltd.</span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
        {/* Breadcrumb */}
        <nav className="text-sm text-gray-500 mb-4">
          <ol className="flex items-center gap-2">
            <li>Master</li>
            <li className="px-1">/</li>
            <li className="text-gray-900 font-medium">Product Master</li>
          </ol>
        </nav>

        {/* Page Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-semibold text-gray-900">Product Master</h1>
        </div>

        {/* Product Card */}
        <section className="rounded-xl bg-white shadow-lg ring-1 ring-gray-200">
          {/* Header */}
          <div className="px-6 py-4 border-b flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <h2 className="text-xl font-semibold text-gray-900">Product List</h2>
            <div className="flex flex-col sm:flex-row gap-4">
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full sm:w-auto rounded-xl border border-gray-300 bg-white px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 appearance-none"
              >
                {categories.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Toolbar */}
          <div className="px-6 py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-2">
              <label className="text-sm font-medium text-gray-700">Search:</label>
              <div className="relative w-full sm:w-80">
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full rounded-xl border border-gray-300 pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="Search by Item Name or Code"
                />
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <circle cx="11" cy="11" r="8"></circle>
                    <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                  </svg>
                </span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <label className="text-sm font-medium text-gray-700">Sort By:</label>
              <div className="flex items-center gap-2">
                <select
                  value={sortKey}
                  onChange={(e) => setSortKey(e.target.value)}
                  className="rounded-xl border border-gray-300 bg-white px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="sn">S.N</option>
                  <option value="name">Item Name</option>
                  <option value="code">Item Code</option>
                  <option value="pr">Purchase Rate</option>
                  <option value="sr">Selling Rate</option>
                </select>
                <button
                  onClick={() => setSortDir((d) => (d === "asc" ? "desc" : "asc"))}
                  className="rounded-xl border border-gray-300 px-3 py-2 text-sm hover:bg-gray-50"
                  title="Toggle sort direction"
                >
                  {sortDir === "asc" ? "↑" : "↓"}
                </button>
              </div>
            </div>
          </div>

          {/* Table */}
          <div className="px-6 pb-6 overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  {[
                    "S.N",
                    "Item Name",
                    "Item Code",
                    "Unit",
                    "Purchase Rate",
                    "Selling Rate",
                    "VAT Included",
                    "Action",
                  ].map((header) => (
                    <th
                      key={header}
                      className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider sticky top-0 bg-gray-50"
                    >
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filtered.map((row, idx) => (
                  <tr key={row.code} className="hover:bg-gray-50">
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">{idx + 1}.</td>
                    <td className="px-4 py-4 text-sm text-gray-900 max-w-xs truncate" title={row.name}>
                      {row.name}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">{row.code}</td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">{row.unit}</td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">{row.pr.toFixed(2)}</td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">{row.sr.toFixed(2)}</td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm">
                      <span
                        className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                          row.vat ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {row.vat ? "Yes" : "No"}
                      </span>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm">
                      <div className="flex gap-2">
                        <button className="inline-flex items-center gap-1 rounded-md bg-emerald-500 text-white px-3 py-1.5 text-xs font-medium shadow-sm hover:bg-emerald-600 focus:outline-none">
                          View
                        </button>
                        <button className="inline-flex items-center gap-1 rounded-md bg-indigo-500 text-white px-3 py-1.5 text-xs font-medium shadow-sm hover:bg-indigo-600 focus:outline-none">
                          Edit
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Pagination */}
            <div className="flex items-center justify-between mt-4">
              <span className="text-sm text-gray-700">
                Showing 1 to {filtered.length} of {sampleData.length} products
              </span>
              <div className="flex space-x-2">
                <button className="px-4 py-2 text-sm text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50">
                  Previous
                </button>
                <button className="px-4 py-2 text-sm text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50">
                  Next
                </button>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}