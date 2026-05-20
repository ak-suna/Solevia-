import React, { useState } from "react";
import { X, AlertTriangle } from 'lucide-react';
import { createReport } from "../services/communityService";
import toast from 'react-hot-toast';

const ReportModal = ({ targetId, targetType, onClose }) => {
    const [reason, setReason] = useState("");
    const [description, setDescription] = useState("");
    const [submitting, setSubmitting] = useState(false);

    const reasons = [
        { value: "spam", label: "Spam or misleading", icon: "🚫" },
        { value: "harassment", label: "Harassment or bullying", icon: "😠" },
        { value: "inappropriate-content", label: "Inappropriate content", icon: "⚠️" },
        { value: "misinformation", label: "Misinformation", icon: "❌" },
        { value: "hate-speech", label: "Hate speech", icon: "💔" },
        { value: "self-harm", label: "Self-harm or suicide", icon: "🆘" },
        { value: "violence", label: "Violence or threats", icon: "⚔️" },
        { value: "other", label: "Other", icon: "📝" }
    ];

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!reason) {
            toast.error("Please select a reason");
            return;
        }

        setSubmitting(true);
        try {
            await createReport(targetId, targetType, reason, description);
            toast.success("Report submitted successfully. Thank you for helping keep our community safe.");
            onClose();
        } catch (error) {
            console.error("Error submitting report:", error);
            toast.error(error.response?.data?.error || "Failed to submit report. Please try again.");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 sm:p-6">
            <div className="bg-white dark:bg-gray-800 rounded-3xl p-5 sm:p-8 max-w-md w-full shadow-2xl max-h-[90vh] overflow-y-auto custom-scrollbar flex flex-col">
                {/* Header */}
                <div className="flex items-start sm:items-center justify-between mb-4 shrink-0">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-red-100 dark:bg-red-900/30 rounded-full">
                            <AlertTriangle className="w-6 h-6 text-red-600 dark:text-red-400" />
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white capitalize">
                            Report {targetType}
                        </h2>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
                    >
                        <X className="w-6 h-6 text-gray-600 dark:text-gray-400" />
                    </button>
                </div>

                <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mb-5 shrink-0">
                    Your report is anonymous. If someone is in immediate danger, call local emergency services - don't wait.
                </p>

                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Reason Selection */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                            Why are you reporting this?
                        </label>
                        <div className="space-y-1.5 sm:space-y-2">
                            {reasons.map(r => (
                                <button
                                    key={r.value}
                                    type="button"
                                    onClick={() => setReason(r.value)}
                                    className={`w-full text-left px-3 py-2 sm:px-4 sm:py-2.5 rounded-xl flex items-center gap-3 transition-all ${reason === r.value
                                            ? "bg-red-100 dark:bg-red-900/30 border-2 border-red-500"
                                            : "bg-gray-50 dark:bg-gray-700 border-2 border-transparent hover:border-gray-300 dark:hover:border-gray-600"
                                        }`}
                                >
                                    <span className="text-lg sm:text-xl">{r.icon}</span>
                                    <span className="font-medium text-sm text-gray-900 dark:text-white">
                                        {r.label}
                                    </span>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Additional Details */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                            Additional details (optional)
                        </label>
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Provide more context about your report..."
                            className="w-full px-4 py-2 sm:py-3 rounded-xl bg-gray-50 dark:bg-gray-700 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-500 resize-none"
                            rows="2"
                            maxLength="500"
                        />
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 text-right">
                            {description.length}/500
                        </p>
                    </div>

                    {/* Buttons */}
                    <div className="flex gap-3 pt-2 shrink-0">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 px-6 py-3 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 font-semibold hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={submitting || !reason}
                            className="flex-1 px-6 py-3 rounded-full bg-red-600 text-white font-semibold hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
                        >
                            {submitting ? "Submitting..." : "Submit Report"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ReportModal;