import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const StockStatsChart = () => {
  const stockData = [
    { item: 'Water Bottle', stock: 93 },
    { item: 'Water Bottle', stock: 93 },
    { item: 'Chips', stock: 211 },
    { item: 'Wai Wai', stock: 974 },
    { item: 'Milk', stock: 72 },
  ];

  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">Stock Stats</h2>
        <select className="p-1 border rounded">
          <option>Low</option>
          <option>High</option>
        </select>
      </div>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={stockData} layout="vertical">
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis type="number" />
          <YAxis dataKey="item" type="category" />
          <Tooltip />
          <Legend />
          <Bar dataKey="stock" fill="#3b82f6" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default StockStatsChart;