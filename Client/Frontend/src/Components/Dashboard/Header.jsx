import React from 'react';

const Header = () => {
  return (
    <div className="flex justify-between items-center mb-6">
      <h1 className="text-2xl font-bold">Dashboard</h1>
      <div className="flex items-center space-x-4">
        <select className="p-2 border rounded">
          <option>Today</option>
          <option>Yesterday</option>
        </select>
        <input type="text" placeholder="Search" className="p-2 border rounded" />
        <div className="relative">
          <button className="p-2 border rounded">🔔</button>
        </div>
        <select className="p-2 border rounded">
          <option>Mandanhar Store Pvt. Ltd.</option>
        </select>
      </div>
    </div>
  );
};

export default Header;