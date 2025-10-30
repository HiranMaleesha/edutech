'use client';

import React from 'react';

/**
 * Props interface for the DeleteConfirmationModal component.
 */
interface DeleteConfirmationModalProps {
  /** Controls modal visibility */
  isOpen: boolean;
  /** Callback function to close the modal */
  onClose: () => void;
  /** Callback function to confirm the deletion */
  onConfirm: () => void;
  /** Modal title text */
  title: string;
  /** Modal message text */
  message: string;
  /** Loading state during deletion operation */
  loading?: boolean;
}

/**
 * Modal component for confirming destructive actions like deletion.
 * Provides a responsive overlay with confirmation buttons and loading states.
 *
 * @param props - Component props
 * @returns JSX element representing the confirmation modal
 */
const DeleteConfirmationModal: React.FC<DeleteConfirmationModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  loading = false,
}) => {
  // Don't render if modal is not open
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg p-4 sm:p-6 w-full max-w-sm shadow-xl">
        <h2 className="text-lg sm:text-xl font-bold mb-4 text-gray-900">{title}</h2>
        <p className="text-gray-700 mb-6 text-sm sm:text-base">{message}</p>
        <div className="flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-2">
          <button
            onClick={onClose}
            className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors"
            disabled={loading}
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-colors"
            disabled={loading}
          >
            {loading ? 'Deleting...' : 'Delete'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmationModal;