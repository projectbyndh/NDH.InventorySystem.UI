import React, { useEffect, useState } from "react";

const id = () => String(Date.now()) + Math.random().toString(16).slice(2, 8);

function Icon({ type }) {
  if (type === "error")
    return (
      <svg className="w-5 h-5 text-rose-600" viewBox="0 0 24 24" fill="none">
        <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    );
  if (type === "success")
    return (
      <svg className="w-5 h-5 text-emerald-600" viewBox="0 0 24 24" fill="none">
        <path d="M20 6L9 17l-5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    );
  return (
    <svg className="w-5 h-5 text-sky-600" viewBox="0 0 24 24" fill="none">
      <path d="M12 8v4m0 4h.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2" />
    </svg>
  );
}

function ToastItem({ t, onClose }) {
  const [progressWidth, setProgressWidth] = useState(100);

  useEffect(() => {
    // kick off the progress animation
    const tick = setTimeout(() => setProgressWidth(0), 20);
    return () => clearTimeout(tick);
  }, []);

  const accent =
    t.type === "error" ? "bg-rose-50 border-rose-200 text-rose-800" : t.type === "success" ? "bg-emerald-50 border-emerald-200 text-emerald-800" : "bg-white border-slate-200 text-slate-900";

  return (
    <div className={`min-w-[260px] max-w-md rounded-2xl shadow-xl border flex flex-col overflow-hidden ${accent}`}>
      <div className="flex gap-3 items-start p-3">
        <div className="shrink-0 mt-0.5">
          <div className="w-9 h-9 flex items-center justify-center rounded-lg bg-white/60">
            <Icon type={t.type} />
          </div>
        </div>

        <div className="flex-1">
          <div className="text-sm leading-snug break-words">{t.message}</div>
        </div>

        <div className="flex items-start">
          <button
            onClick={onClose}
            className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-white/60 hover:bg-white text-slate-600 ml-2"
            aria-label="Close toast"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none">
              <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>
      </div>

      <div className="h-1 bg-white/30">
        <div
          className="h-1 bg-white"
          style={{ width: `${progressWidth}%`, transition: `width ${t.duration}ms linear` }}
        />
      </div>
    </div>
  );
}

export default function ToastProvider() {
  const [toasts, setToasts] = useState([]);

  useEffect(() => {
    const handler = (e) => {
      const detail = e?.detail || {};
      const t = {
        id: id(),
        message: detail.message || String(detail),
        type: detail.type || "info",
        duration: detail.duration || 4000,
      };
      setToasts((s) => [t, ...s]);
      setTimeout(() => {
        setToasts((s) => s.filter((x) => x.id !== t.id));
      }, t.duration + 200);
    };

    window.addEventListener("ndh-toast", handler);
    return () => window.removeEventListener("ndh-toast", handler);
  }, []);

  if (!toasts.length) return null;

  return (
    <div className="fixed top-5 right-5 z-[9999] flex flex-col gap-3 items-end">
      {toasts.map((t) => (
        <ToastItem key={t.id} t={t} onClose={() => setToasts((s) => s.filter((x) => x.id !== t.id))} />
      ))}
    </div>
  );
}
