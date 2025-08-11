import React, { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const SalesPurchaseChart = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('12 Months');

  const salesPurchaseData = [
    { month: 'Feb', sales: 20000, purchase: 15000 },
    { month: 'Mar', sales: 25000, purchase: 18000 },
    { month: 'Apr', sales: 30000, purchase: 22000 },
    { month: 'May', sales: 35000, purchase: 25000 },
    { month: 'Jun', sales: 45591, purchase: 30000 },
    { month: 'Jul', sales: 40000, purchase: 28000 },
    { month: 'Aug', sales: 45000, purchase: 32000 },
    { month: 'Sep', sales: 48000, purchase: 35000 },
    { month: 'Oct', sales: 50000, purchase: 38000 },
    { month: 'Nov', sales: 52000, purchase: 40000 },
    { month: 'Dec', sales: 55000, purchase: 42000 },
    { month: 'Jan', sales: 60000, purchase: 45000 },
  ];

  const getFilteredData = () => {
    switch (selectedPeriod) {
      case '6 Months':
        return salesPurchaseData.slice(6);
      case '30 Days':
        return salesPurchaseData.slice(11);
      case '7 Days':
        return salesPurchaseData.slice(11);
      default:
        return salesPurchaseData;
    }
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">Sales & Purchase</h2>
        <div className="flex space-x-2">
          {['12 Months', '6 Months', '30 Days', '7 Days'].map((period) => (
            <button
              key={period}
              onClick={() => setSelectedPeriod(period)}
              className={`px-3 py-1 rounded ${selectedPeriod === period ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
            >
              {period}
            </button>
          ))}
        </div>
      </div>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={getFilteredData()}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="sales" stroke="#3b82f6" />
          <Line type="monotone" dataKey="purchase" stroke="#22c55e" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default SalesPurchaseChart;