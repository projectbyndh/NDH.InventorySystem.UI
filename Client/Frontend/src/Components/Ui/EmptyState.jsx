import React from 'react';

export default function EmptyState({ icon, title = 'No items', subtitle, action }) {
  return (
    <div className="py-20 text-center animate-fadeIn">
      <div className="mx-auto mb-6 h-20 w-20 rounded-full bg-slate-50 flex items-center justify-center shadow-inner border border-slate-100">
        {icon || (
          <svg className="h-10 w-10 text-slate-300" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V7" />
            <path strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" d="M16 3v4M8 3v4" />
          </svg>
        )}
      </div>
      <h3 className="text-xl font-bold text-slate-900 mb-2">{title}</h3>
      {subtitle && <p className="mb-8 text-slate-500 max-w-sm mx-auto">{subtitle}</p>}
      {action && <div className="flex justify-center">{action}</div>}
    </div>
  );
}
