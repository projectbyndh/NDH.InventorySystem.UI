import React, { useState } from "react";

export default function Settings() {
  const [search, setSearch] = useState("");

  // Sample settings categories
  const settingsCategories = [
    "General",
    "User Profile",
    "Security",
    "Notifications",
    "Integrations",
  ];

  // Sample configurable settings
  const sampleSettings = [
    { id: 1, category: "General", key: "Company Name", value: "NDH Pvt. Ltd.", type: "text" },
    { id: 2, category: "General", key: "Currency", value: "USD", type: "select", options: ["USD", "EUR", "GBP"] },
    { id: 3, category: "User Profile", key: "Full Name", value: "John Doe", type: "text" },
    { id: 4, category: "User Profile", key: "Email", value: "john.doe@example.com", type: "email" },
    { id: 5, category: "Security", key: "Two-Factor Authentication", value: true, type: "boolean" },
    { id: 6, category: "Security", key: "Password", value: "", type: "password" },
    { id: 7, category: "Notifications", key: "Email Alerts", value: true, type: "boolean" },
    { id: 8, category: "Notifications", key: "SMS Alerts", value: false, type: "boolean" },
    { id: 9, category: "Integrations", key: "API Key", value: "abc123xyz", type: "text" },
    { id: 10, category: "Integrations", key: "Webhook URL", value: "https://example.com/webhook", type: "url" },
  ];

  const [category, setCategory] = useState("General");
  const [settings, setSettings] = useState(sampleSettings);

  const filteredSettings = settings.filter(
    (setting) =>
      setting.category === category &&
      (setting.key.toLowerCase().includes(search.toLowerCase()) || setting.value.toString().toLowerCase().includes(search.toLowerCase()))
  );

  const handleChange = (id, newValue) => {
    setSettings((prev) =>
      prev.map((s) => (s.id === id ? { ...s, value: newValue } : s))
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 ">
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
            Back to Dashboard
          </button>
          <div className="flex items-center gap-4">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-64 rounded-full border border-gray-300 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 placeholder-gray-400"
              placeholder="Search settings..."
            />
            <div className="h-8 w-8 rounded-full bg-gray-200"></div>
            <span className="text-sm font-medium text-gray-700">NDH Pvt. Ltd.</span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
        {/* Breadcrumb */}
        <nav className="text-sm text-gray-500 mb-4">
          <ol className="flex items-center gap-2">
            <li>Dashboard</li>
            <li className="px-1">/</li>
            <li className="text-gray-900 font-medium">Settings</li>
          </ol>
        </nav>

        {/* Page Header */}
        <div className="mb-6 flex justify-between items-center">
          <h1 className="text-3xl font-semibold text-gray-900">System Settings</h1>
          <button className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700">
            Save Changes
          </button>
        </div>

        {/* Settings Card */}
        <section className="rounded-xl bg-white shadow-lg ring-1 ring-gray-200">
          {/* Category Selector */}
          <div className="px-6 py-4 border-b flex flex-wrap gap-4">
            {settingsCategories.map((cat) => (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                className={`px-4 py-2 rounded-md text-sm font-medium ${
                  category === cat ? "bg-indigo-100 text-indigo-800" : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Settings List */}
          <div className="px-6 py-4">
            <div className="space-y-6">
              {filteredSettings.map((setting) => (
                <div key={setting.id} className="flex items-center justify-between border-b pb-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">{setting.key}</label>
                    <p className="text-sm text-gray-500">Adjust {setting.key.toLowerCase()} for the system.</p>
                  </div>
                  <div className="w-64">
                    {setting.type === "text" || setting.type === "email" || setting.type === "url" ? (
                      <input
                        type={setting.type}
                        value={setting.value}
                        onChange={(e) => handleChange(setting.id, e.target.value)}
                        className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                    ) : setting.type === "password" ? (
                      <input
                        type="password"
                        value={setting.value}
                        onChange={(e) => handleChange(setting.id, e.target.value)}
                        className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        placeholder="Enter new password"
                      />
                    ) : setting.type === "select" ? (
                      <select
                        value={setting.value}
                        onChange={(e) => handleChange(setting.id, e.target.value)}
                        className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      >
                        {setting.options.map((opt) => (
                          <option key={opt} value={opt}>
                            {opt}
                          </option>
                        ))}
                      </select>
                    ) : setting.type === "boolean" ? (
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={setting.value}
                          onChange={(e) => handleChange(setting.id, e.target.checked)}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                      </label>
                    ) : null}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};