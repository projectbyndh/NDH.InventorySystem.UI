import React from 'react';

export default function Pagination({ page, pageCount, onPrev, onNext }) {
  return (
    <div className="flex items-center gap-2">
      <button onClick={onPrev} disabled={page <= 1} className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-slate-300 disabled:opacity-50">
        <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7"/></svg>
        Previous
      </button>
      <span className="px-3 py-2 font-medium text-slate-900">Page {page} of {pageCount}</span>
      <button onClick={onNext} disabled={page >= pageCount} className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-slate-300 disabled:opacity-50">
        Next
        <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7"/></svg>
      </button>
    </div>
  );
}
