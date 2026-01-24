import React from 'react';
import IconActionButton from './IconActionButton';
import { X } from 'lucide-react';

export default function Modal({ open, onClose, title, children, size = 'md' }) {
  if (!open) return null;

  const sizes = {
    sm: 'max-w-md',
    md: 'max-w-3xl',
    lg: 'max-w-5xl',
    xl: 'max-w-7xl',
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
      <div className={`relative w-full ${sizes[size]} max-h-[90vh] overflow-y-auto rounded-2xl bg-white p-6 shadow-2xl`}>
        <div className="flex items-center justify-between mb-4 border-b border-slate-200 pb-3">
          <h2 className="text-lg font-semibold text-slate-900">{title}</h2>
          <IconActionButton
            icon={X}
            onClick={onClose}
            variant="view"
            size="sm"
            ariaLabel="Close Modal"
          />
        </div>
        {children}
      </div>
    </div>
  );
}
