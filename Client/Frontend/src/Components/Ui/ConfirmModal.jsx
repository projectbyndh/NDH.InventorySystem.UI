import React from 'react';
import Modal from './Modal';

export default function ConfirmModal({ open, onClose, onConfirm, title = 'Confirm', message, confirmText = 'Confirm', cancelText = 'Cancel', loading = false }) {
  return (
    <Modal open={open} onClose={onClose} title={title} size="sm">
      <div className="py-2">
        <p className="text-sm text-slate-700 mb-4">{message}</p>
        <div className="flex justify-end gap-3">
          <button onClick={onClose} className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-xl hover:bg-slate-50">{cancelText}</button>
          <button onClick={onConfirm} disabled={loading} className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-xl hover:bg-red-700 flex items-center gap-2">
            {loading ? (
              <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/></svg>
            ) : null}
            {confirmText}
          </button>
        </div>
      </div>
    </Modal>
  );
}
