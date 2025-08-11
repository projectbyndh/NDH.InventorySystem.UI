import React from 'react';

const SummaryStats = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-6">
      <div className="bg-white p-4 rounded-lg shadow">
        <p className="text-sm text-gray-600">Today's Sales (Rs)</p>
        <p className="text-2xl font-bold text-green-600 flex items-center">↑ Rs. 18,240.00</p>
      </div>
      <div className="bg-white p-4 rounded-lg shadow">
        <p className="text-sm text-gray-600">No. of Bills</p>
        <p className="text-2xl font-bold text-green-600 flex items-center">↑ 124</p>
      </div>
      <div className="bg-white p-4 rounded-lg shadow">
        <p className="text-sm text-gray-600">Net Sales Value</p>
        <p className="text-2xl font-bold text-green-600 flex items-center">↑ Rs. 17,790.00</p>
      </div>
      <div className="bg-white p-4 rounded-lg shadow">
        <p className="text-sm text-gray-600">Returns Today</p>
        <p className="text-2xl font-bold text-red-600 flex items-center">↓ Rs. 450.00</p>
      </div>
      <div className="bg-white p-4 rounded-lg shadow">
        <p className="text-sm text-gray-600">Stock Alerts</p>
        <p className="text-2xl font-bold text-yellow-600 flex items-center">⚠️ 6 items low</p>
      </div>
    </div>
  );
};

export default SummaryStats;