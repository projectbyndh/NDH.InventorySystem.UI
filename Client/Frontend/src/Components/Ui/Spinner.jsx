import React from 'react';

export default function Spinner({ size = 6, className = '' }) {
  const s = `${size}`;
  return (
    <div className={`inline-block ${className}`}>
      <svg className={`animate-spin h-${s} w-${s} text-slate-600`} viewBox="0 0 24 24" fill="none" stroke="currentColor">
        <circle className="opacity-25" cx="12" cy="12" r="10" strokeWidth="4"></circle>
        <path className="opacity-75" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" strokeWidth="4"></path>
      </svg>
    </div>
  );
}
