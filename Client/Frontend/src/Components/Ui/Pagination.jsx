import React from 'react';
import ActionButton from './ActionButton';

export default function Pagination({ page, pageCount, onPrev, onNext }) {
  return (
    <div className="flex items-center gap-2">
      <ActionButton
        variant="secondary"
        size="sm"
        onClick={onPrev}
        disabled={page <= 1}
      >
        Previous
      </ActionButton>
      <span className="px-3 py-2 font-medium text-slate-900 text-sm">Page {page} of {pageCount}</span>
      <ActionButton
        variant="secondary"
        size="sm"
        onClick={onNext}
        disabled={page >= pageCount}
      >
        Next
      </ActionButton>
    </div>
  );
}
