/* eslint-disable no-empty-pattern */

import React from "react";

const Table = ({ columns, data, actions }) => {
    <Table
  columns={[
    { header: "Product", accessor: "name" },
    { header: "Stock", accessor: "stock" },
    { header: "Price", accessor: "price" },
  ]}
  data={[
    { name: "Keyboard", stock: 120, price: "$25" },
    { name: "Mouse", stock: 80, price: "$15" },
  ]}
  actions={[
    ({ }) => <button className="text-blue-600">Edit</button>,
    ({ }) => <button className="text-red-600">Delete</button>,
  ]}
/>

  return (
    <div className="overflow-x-auto bg-white shadow-md rounded-lg">
      <table className="w-full text-sm text-left border-collapse">
        <thead className="bg-gray-100 text-gray-700">
          <tr>
            {columns.map((col, idx) => (
              <th key={idx} className="px-4 py-2 border-b">
                {col.header}
              </th>
            ))}
            {actions && <th className="px-4 py-2 border-b">Actions</th>}
          </tr>
        </thead>
        <tbody>
          {data.length > 0 ? (
            data.map((row, rowIndex) => (
              <tr key={rowIndex} className="hover:bg-gray-50">
                {columns.map((col, colIndex) => (
                  <td key={colIndex} className="px-4 py-2 border-b">
                    {row[col.accessor]}
                  </td>
                ))}
                {actions && (
                  <td className="px-4 py-2 border-b flex space-x-2">
                    {actions.map((Action, actionIndex) => (
                      <Action key={actionIndex} row={row} />
                    ))}
                  </td>
                )}
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={columns.length + 1} className="px-4 py-4 text-center text-gray-500">
                No data available
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Table;
