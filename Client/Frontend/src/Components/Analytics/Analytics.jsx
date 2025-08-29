import React from 'react';
import Header from '../Dashboard/Header';
import SummaryStats from '../Dashboard/SummaryStats';
import SalesPurchaseChart from '../Dashboard/SalesPurchaseChart'
import StockStatsChart from '../Dashboard/StockStatsChart';
import SellsGraph from '../Dashboard/SellsGraph';
import Transactions from '../Dashboard/Transactions';

const Analytics = () => {
  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <Header />
      <SummaryStats />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <SalesPurchaseChart />
        <StockStatsChart />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <SellsGraph />
        <Transactions />
      </div>
    </div>
  );
};

export default Analytics;