import React, { useState } from "react";
import Modal from "./Modal";

const WeeklyTaskModal = ({ isOpen, onClose, onSave, initialTask }) => {
    const [task, setTask] = useState(initialTask || "");
    const [loading, setLoading] = useState(false);

    const handleSave = async () => {
        if (!task.trim()) return;
        setLoading(true);
        await onSave(task.trim());
        setLoading(false);
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Set Weekly Task">
            <div className="mb-4">
                <label className="block text-gray-800 dark:text-gray-100 font-semibold mb-2">
                    Weekly Challenge/Task
                </label>
                <textarea
                    className="w-full p-3 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-[#f4873e] dark:focus:ring-orange-400"
                    rows={4}
                    value={task}
                    onChange={e => setTask(e.target.value)}
                    placeholder="Describe this week's group challenge..."
                />
            </div>
            <div className="flex justify-end gap-2">
                <button
                    className="px-4 py-2 rounded-lg bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 font-semibold hover:bg-gray-300 dark:hover:bg-gray-600 border border-gray-300 dark:border-gray-600"
                    onClick={onClose}
                    disabled={loading}
                >
                    Cancel
                </button>
                <button
                    className="px-4 py-2 rounded-lg bg-gradient-to-r from-orange-500 to-orange-600 dark:from-orange-700 dark:to-orange-900 text-white font-bold hover:shadow-lg border border-orange-500 dark:border-orange-900"
                    onClick={handleSave}
                    disabled={loading || !task.trim()}
                >
                    {loading ? "Saving..." : "Save Task"}
                </button>
            </div>
        </Modal>
    );
};

export default WeeklyTaskModal;
