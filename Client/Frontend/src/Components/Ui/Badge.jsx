import React from 'react';

export default function Badge({ children, variant = 'default' }) {
  const base = 'inline-flex items-center justify-center rounded-full px-2 py-0.5 text-xs font-medium';
  const map = {
    default: 'bg-slate-100 text-slate-800',
    success: 'bg-green-100 text-green-700',
    danger: 'bg-red-100 text-red-700',
  };
  return <span className={`${base} ${map[variant] || map.default}`}>{children}</span>;
}
