import React from 'react';

export default function IconButton({ onClick, children, title, className = '' }) {
  return (
    <button title={title} onClick={onClick} className={`rounded-md p-1 text-gray-500 hover:bg-gray-100 hover:text-gray-700 transition-colors ${className}`}>
      {children}
    </button>
  );
}
