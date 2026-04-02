import React from 'react';
import { X } from 'lucide-react';

const Modal = ({ isOpen, onClose, title, children }) => {
    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={onClose}>
            <div
                className="bg-white dark:bg-gray-800 rounded-[40px] p-8 max-w-lg w-full shadow-2xl relative"
                onClick={e => e.stopPropagation()}
            >
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
                >
                    <X className="w-6 h-6 text-gray-600 dark:text-gray-400" />
                </button>
                {title && (
                    <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">{title}</h2>
                )}
                {children}
            </div>
        </div>
    );
};

export default Modal;
