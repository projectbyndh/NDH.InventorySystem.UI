import React, { useState, useEffect, useRef, useMemo } from 'react';

export default function Select({ value, onChange, options, placeholder = 'Choose one', className = '' }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    function onDoc(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener('mousedown', onDoc);
    return () => document.removeEventListener('mousedown', onDoc);
  }, []);

  const current = useMemo(() => options.find((o) => o.value === value), [options, value]);

  return (
    <div className={'relative ' + className} ref={ref}>
      <button
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className="w-full h-10 px-3 rounded-xl border bg-white border-slate-300 text-left text-[15px] flex items-center justify-between"
      >
        <span className={current ? 'text-slate-900' : 'text-slate-400'}>
          {current ? current.label : placeholder}
        </span>
        <svg
          className={`h-4 w-4 transition-transform ${open ? 'rotate-180' : ''}`}
          viewBox="0 0 20 20"
          fill="currentColor"
          aria-hidden="true"
        >
          <path d="M5.23 7.21a.75.75 0 011.06.02L10 10.17l3.71-2.94a.75.75 0 011.04 1.08l-4.24 3.36a.75.75 0 01-.94 0L5.21 8.31a.75.75 0 01.02-1.1z" />
        </svg>
      </button>
      {open && (
        <ul
          role="listbox"
          tabIndex={-1}
          className="absolute z-20 mt-2 w-full max-h-60 overflow-auto rounded-xl border border-slate-200 bg-white shadow-lg"
        >
          {options.map((o) => (
            <li
              key={o.value}
              role="option"
              aria-selected={o.value === value}
              onClick={() => {
                onChange(o.value);
                setOpen(false);
              }}
              className={`px-3 py-2 cursor-pointer text-[15px] hover:bg-slate-50 ${
                o.value === value ? 'bg-slate-50' : ''
              }`}
            >
              {o.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
