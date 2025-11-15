import React from 'react';

export default function SectionCard({ title, right, children, className = '' }) {
  return (
    <section className={`bg-white rounded-2xl shadow-sm border border-slate-200 ${className}`}>
      <header className="flex items-center justify-between px-5 sm:px-6 py-4 border-b border-slate-200">
        <h3 className="text-slate-900 font-semibold tracking-tight">{title}</h3>
        {right}
      </header>
      <div className="p-5 sm:p-6 space-y-4">{children}</div>
    </section>
  );
}
