import React from "react";
import Modal from "./Modal";

const DeleteAlert = ({ isOpen, onClose, onConfirm, title = "Delete Item", message = "Are you sure you want to delete this? This action cannot be undone." }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title}>
      <div className="space-y-4">
        <p className="text-sm text-gray-600">{message}</p>

        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm rounded-md border border-gray-300 hover:bg-gray-100 transition"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 text-sm rounded-md bg-red-500 text-white hover:bg-red-600 active:scale-95 transition"
          >
            Delete
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default DeleteAlert;
