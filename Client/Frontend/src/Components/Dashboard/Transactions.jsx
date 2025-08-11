import React from 'react';

const Transactions = () => {
  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">Transactions</h2>
        <a href="#" className="text-blue-600">See All Transactions</a>
      </div>
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <span className="bg-green-100 text-green-800 px-2 py-1 rounded">Completed</span>
          <span>Cash</span>
          <span>Jan 17, 2022</span>
          <span>Rs. 182.94</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded">Pending</span>
          <span>IMEPay</span>
          <span>Jan 17, 2022</span>
          <span>Rs. 99.00</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="bg-red-100 text-red-800 px-2 py-1 rounded">Cancelled</span>
          <span>Phone Pay</span>
          <span>Jan 17, 2022</span>
          <span>Rs. 249.94</span>
        </div>
      </div>
    </div>
  );
};

export default Transactions;