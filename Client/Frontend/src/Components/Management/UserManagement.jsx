import React, { useState } from "react";

const required = <span className="text-red-500">*</span>;

function SectionCard({ title, right, children, className = "" }) {
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

function Field({ label, required: req, children, hint }) {
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

function Input(props) {
  return (
    <input
      {...props}
      className={
        "w-full h-10 rounded-xl border border-slate-300 bg-white px-3 text-[15px] outline-none transition " +
        "placeholder:text-slate-400 focus:ring-2 focus:ring-slate-900/5 focus:border-slate-400"
      }
    />
  );
}

function Select({ value, onChange, options, placeholder = "Choose one", className = "" }) {
  const [open, setOpen] = useState(false);
  const ref = React.useRef(null);

  React.useEffect(() => {
    function onDoc(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, []);

  const current = React.useMemo(() => options.find((o) => o.value === value), [options, value]);

  return (
    <div className={"relative " + className} ref={ref}>
      <button
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className="w-full h-10 px-3 rounded-xl border bg-white border-slate-300 text-left text-[15px] flex items-center justify-between"
      >
        <span className={current ? "text-slate-900" : "text-slate-400"}>
          {current ? current.label : placeholder}
        </span>
        <svg
          className={`h-4 w-4 transition-transform ${open ? "rotate-180" : ""}`}
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
                o.value === value ? "bg-slate-50" : ""
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

function Toggle({ checked, onChange }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition ${
        checked ? "bg-slate-900" : "bg-slate-300"
      }`}
    >
      <span
        className={`inline-block h-5 w-5 transform rounded-full bg-white transition ${
          checked ? "translate-x-5" : "translate-x-1"
        }`}
      />
    </button>
  );
}

function Collapsible({ title, children, defaultOpen = false }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border border-slate-200 rounded-xl">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between px-4 py-2 text-left text-sm font-medium text-slate-700"
      >
        <span>{title}</span>
        <svg
          className={`h-4 w-4 transition-transform ${open ? "rotate-180" : ""}`}
          viewBox="0 0 20 20"
          fill="currentColor"
          aria-hidden="true"
        >
          <path d="M5.23 7.21a.75.75 0 011.06.02L10 10.17l3.71-2.94a.75.75 0 011.04 1.08l-4.24 3.36a.75.75 0 01-.94 0L5.21 8.31a.75.75 0 01.02-1.1z" />
        </svg>
      </button>
      {open && <div className="p-4 pt-0">{children}</div>}
    </div>
  );
}

export default function UserManagementPage() {
  const [role, setRole] = useState("");
  const [isActive, setIsActive] = useState(true);
  const roleOptions = [
    { value: "admin", label: "Admin" },
    { value: "manager", label: "Manager" },
    { value: "staff", label: "Staff" },
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Top bar */}
      <div className="sticky top-0 z-30 border-b border-slate-200 bg-white/80 backdrop-blur">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3 text-sm text-slate-600">
            <button className="hover:text-slate-900">← Back to User Management</button>
            <span className="text-slate-300">/</span>
            <span className="hidden sm:inline">User Management</span>
            <span className="text-slate-300">/</span>
            <span className="font-medium text-slate-900">Add User</span>
          </div>
          <div className="flex items-center gap-3">
            <Collapsible title={<span className="text-sm font-medium">Additional Details</span>} defaultOpen={false} />
          </div>
        </div>
      </div>

      {/* Heading */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight mt-6 mb-4">Add User</h1>
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pb-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
          {/* Left column */}
          <div className="lg:col-span-8 space-y-6">
            <SectionCard
              title="User Details"
              right={
                <div className="flex items-center gap-3 text-sm">
                  <span className="text-slate-700">Active</span>
                  <Toggle checked={isActive} onChange={setIsActive} />
                </div>
              }
            >
              <div className="grid sm:grid-cols-2 gap-4">
                <Field label="Full Name" required>
                  <Input placeholder="e.g., John Doe" />
                </Field>
                <Field label="Email" required>
                  <Input placeholder="e.g., john.doe@example.com" type="email" />
                </Field>
                <Field label="Role" required>
                  <Select
                    options={roleOptions}
                    value={role}
                    onChange={setRole}
                    placeholder="Choose user role"
                  />
                </Field>
                <Field label="Phone Number">
                  <Input placeholder="e.g., +1 234 567 8900" type="tel" />
                </Field>
                <Field label="Employee ID">
                  <Input placeholder="e.g., EMP123" />
                </Field>
              </div>
            </SectionCard>

            {/* Footer actions */}
            <div className="flex flex-wrap items-center gap-3">
              <button className="inline-flex items-center justify-center rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white shadow hover:bg-black">
                Save
              </button>
              <button className="inline-flex items-center justify-center rounded-xl border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50">
                Reset
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}