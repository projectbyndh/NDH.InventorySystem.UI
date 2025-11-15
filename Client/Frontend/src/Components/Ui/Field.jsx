import React from 'react';

export const required = <span className="text-red-500">*</span>;

export default function Field({ label, required: req, children, hint }) {
  return (
    <label className="block">
      <div className="mb-1 text-[13px] font-medium text-slate-700">
        {label} {req ? required : null}
      </div>
      {children}
      {hint ? <p className="mt-1 text-xs text-slate-500">{hint}</p> : null}
    </label>
  );
}
