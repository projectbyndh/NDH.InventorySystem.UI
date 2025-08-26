import React from 'react';

const Configuration = () => {
  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">System Configuration</h1>
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Configuration Settings</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-gray-700">Currency</label>
              <input type="text" className="rounded-lg border border-gray-300 p-2" placeholder="USD" />
            </div>
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-gray-700">Tax Rate</label>
              <input type="number" className="rounded-lg border border-gray-300 p-2" placeholder="15%" />
            </div>
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-gray-700">Save</label>
              <button className="bg-blue-500 text-white px-4 py-2 rounded-lg">Save</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Configuration;