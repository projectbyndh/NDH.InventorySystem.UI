import React from 'react';
import Modal from './Modal';
import FormButton from './FormButton';

export default function ConfirmModal({ open, onClose, onConfirm, title = 'Confirm', message, confirmText = 'Confirm', cancelText = 'Cancel', loading = false }) {
  return (
    <Modal open={open} onClose={onClose} title={title} size="sm">
      <div className="py-2">
        <p className="text-sm text-slate-700 mb-4">{message}</p>
        <div className="flex justify-end gap-3">
          <FormButton
            variant="secondary"
            onClick={onClose}
            size="sm"
            className="!w-auto"
          >
            {cancelText}
          </FormButton>
          <FormButton
            variant="danger"
            onClick={onConfirm}
            loading={loading}
            size="sm"
            className="!w-auto"
          >
            {confirmText}
          </FormButton>
        </div>
      </div>
    </Modal>
  );
}
