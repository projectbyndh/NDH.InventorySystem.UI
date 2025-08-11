import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const SellsGraph = () => {
  const sellsData = [
    { product: 'Milk', amount: 3382 },
    { product: 'Wai Wai', amount: 974 },
    { product: 'Chips', amount: 211 },
    { product: 'Water Bottle', amount: 93 },
  ];

  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">Sells Graph</h2>
        <select className="p-1 border rounded">
          <option>Today</option>
          <option>Yesterday</option>
        </select>
      </div>
      <ResponsiveContainer width="100%" height={200}>
        <BarChart data={sellsData} layout="vertical">
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis type="number" />
          <YAxis dataKey="product" type="category" />
          <Tooltip />
          <Legend />
          <Bar dataKey="amount" fill="#3b82f6" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default SellsGraph;