import React from "react";
import toast from "react-hot-toast";

export const showSuccess = (message) => toast.success(message);
export const showError = (message) => toast.error(message);
export const showInfo = (message) => toast(message);

export const confirmAction = (
    message,
    { confirmText = "Confirm", cancelText = "Cancel" } = {}
) =>
    new Promise((resolve) => {
        toast((t) => (
            <div className="max-w-sm">
                <p className="text-sm text-gray-900 mb-3">{message}</p>
                <div className="flex gap-2 justify-end">
                    <button
                        onClick={() => {
                            toast.dismiss(t.id);
                            resolve(false);
                        }}
                        className="px-3 py-1.5 rounded-md bg-gray-100 text-gray-700 text-xs font-semibold hover:bg-gray-200 transition"
                    >
                        {cancelText}
                    </button>
                    <button
                        onClick={() => {
                            toast.dismiss(t.id);
                            resolve(true);
                        }}
                        className="px-3 py-1.5 rounded-md bg-red-600 text-white text-xs font-semibold hover:bg-red-700 transition"
                    >
                        {confirmText}
                    </button>
                </div>
            </div>
        ), { duration: Infinity });
    });
