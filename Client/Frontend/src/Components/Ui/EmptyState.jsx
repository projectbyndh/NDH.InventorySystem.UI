import React from 'react';

export default function EmptyState({ icon, title = 'No items', subtitle }) {
  return (
    <div className="py-20 text-center text-slate-500">
      <div className="mx-auto mb-4 h-16 w-16 rounded-full bg-slate-100 flex items-center justify-center">
        {icon || (
          <svg className="h-8 w-8 text-slate-400" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V7" />
            <path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M16 3v4M8 3v4" />
          </svg>
        )}
      </div>
      <p className="text-lg font-medium">{title}</p>
      {subtitle ? <p className="mt-1 text-sm">{subtitle}</p> : null}
    </div>
  );
}
