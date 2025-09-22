import React, { useMemo, useRef, useState, useEffect } from "react";

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

function Textarea(props) {
  return (
    <textarea
      rows={3}
      {...props}
      className={
        "w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-[15px] outline-none transition " +
        "placeholder:text-slate-400 focus:ring-2 focus:ring-slate-900/5 focus:border-slate-400"
      }
    />
  );
}

function Chevron({ open }) {
  return (
    <svg
      className={`h-4 w-4 transition-transform ${open ? "rotate-180" : ""}`}
      viewBox="0 0 20 20"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M5.23 7.21a.75.75 0 011.06.02L10 10.17l3.71-2.94a.75.75 0 011.04 1.08l-4.24 3.36a.75.75 0 01-.94 0L5.21 8.31a.75.75 0 01.02-1.1z" />
    </svg>
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

function useOutsideClose(ref, onClose) {
  useEffect(() => {
    function onDoc(e) {
      if (ref.current && !ref.current.contains(e.target)) onClose();
    }
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, [ref, onClose]);
}

function Select({ value, onChange, options, placeholder = "Choose one", className = "" }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  useOutsideClose(ref, () => setOpen(false));

  const current = useMemo(() => options.find((o) => o.value === value), [options, value]);

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
        <Chevron open={open} />
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

export default function SettingsPage() {
  const [profileImage, setProfileImage] = useState(null);
  const [userName, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [language, setLanguage] = useState("");
  const [notifications, setNotifications] = useState(true);
  const fileInputRef = useRef(null);

  const languageOptions = [
    { value: "en", label: "English" },
    { value: "es", label: "Spanish" },
    { value: "fr", label: "French" },
  ];

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current.click();
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Top bar */}
      <div className="sticky top-0 z-30 border-b border-slate-200 bg-white/80 backdrop-blur">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3 text-sm text-slate-600">
            <button className="hover:text-slate-900">← Back to Dashboard</button>
            <span className="text-slate-300">/</span>
            <span className="hidden sm:inline">Dashboard</span>
            <span className="text-slate-300">/</span>
            <span className="font-medium text-slate-900">Settings</span>
          </div>
        </div>
      </div>

      {/* Heading */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight mt-6 mb-4">Settings</h1>
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pb-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
          {/* Left column */}
          <div className="lg:col-span-8 space-y-6">
            <SectionCard title="Profile Image">
              <div className="flex items-center gap-4">
                <div className="h-24 w-24 rounded-full bg-slate-200 flex items-center justify-center overflow-hidden">
                  {profileImage ? (
                    <img src={profileImage} alt="Profile" className="h-full w-full object-cover" />
                  ) : (
                    <span className="text-slate-500">No Image</span>
                  )}
                </div>
                <div>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    ref={fileInputRef}
                    onChange={handleImageChange}
                  />
                  <button
                    type="button"
                    onClick={triggerFileInput}
                    className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2 text-white text-sm font-medium shadow hover:bg-indigo-700"
                  >
                    Upload Image
                  </button>
                  <p className="mt-1 text-xs text-slate-500">Recommended size: 200x200px, max 2MB</p>
                </div>
              </div>
            </SectionCard>

            <SectionCard title="Personal Details">
              <div className="grid sm:grid-cols-2 gap-4">
                <Field label="Full Name" required>
                  <Input
                    placeholder="e.g., John Doe"
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                  />
                </Field>
                <Field label="Email Address" required>
                  <Input
                    type="email"
                    placeholder="e.g., john.doe@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </Field>
                <Field label="Phone Number">
                  <Input
                    type="tel"
                    placeholder="e.g., +1 123-456-7890"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                  />
                </Field>
                <Field label="Language Preference">
                  <Select
                    options={languageOptions}
                    value={language}
                    onChange={setLanguage}
                    placeholder="Choose language"
                  />
                </Field>
                <div className="sm:col-span-2">
                  <Field label="Bio" hint="Tell us about yourself">
                    <Textarea placeholder="Write a short bio..." />
                  </Field>
                </div>
              </div>
            </SectionCard>

            <SectionCard
              title="Notifications"
              right={
                <div className="flex items-center gap-3 text-sm">
                  <span className="text-slate-700">Enable Notifications</span>
                  <Toggle checked={notifications} onChange={setNotifications} />
                </div>
              }
            >
              <p className="text-sm text-slate-600">
                Receive email notifications for inventory updates and alerts.
              </p>
            </SectionCard>

            {/* Footer actions */}
            <div className="flex items-center gap-3">
              <button className="inline-flex items-center justify-center rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white shadow hover:bg-black">
                Save Changes
              </button>
              <button className="inline-flex items-center justify-center rounded-xl border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50">
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}