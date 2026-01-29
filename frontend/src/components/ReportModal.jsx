import React, { useState } from "react";
import { X, AlertTriangle } from 'lucide-react';
import { createReport } from "../services/communityService";

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
            alert("Please select a reason");
            return;
        }

        setSubmitting(true);
        try {
            await createReport(targetId, targetType, reason, description);
            alert("Report submitted successfully. Thank you for helping keep our community safe.");
            onClose();
        } catch (error) {
            console.error("Error submitting report:", error);
            alert(error.response?.data?.error || "Failed to submit report. Please try again.");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-gray-800 rounded-3xl p-8 max-w-md w-full shadow-2xl">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-red-100 dark:bg-red-900/30 rounded-full">
                            <AlertTriangle className="w-6 h-6 text-red-600 dark:text-red-400" />
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                            Report {targetType === "post" ? "Post" : "User"}
                        </h2>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
                    >
                        <X className="w-6 h-6 text-gray-600 dark:text-gray-400" />
                    </button>
                </div>

                <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
                    Your report is anonymous. If someone is in immediate danger, call local emergency services - don't wait.
                </p>

                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Reason Selection */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                            Why are you reporting this?
                        </label>
                        <div className="space-y-2">
                            {reasons.map(r => (
                                <button
                                    key={r.value}
                                    type="button"
                                    onClick={() => setReason(r.value)}
                                    className={`w-full text-left px-4 py-3 rounded-xl flex items-center gap-3 transition-all ${reason === r.value
                                            ? "bg-red-100 dark:bg-red-900/30 border-2 border-red-500"
                                            : "bg-gray-50 dark:bg-gray-700 border-2 border-transparent hover:border-gray-300 dark:hover:border-gray-600"
                                        }`}
                                >
                                    <span className="text-2xl">{r.icon}</span>
                                    <span className="font-medium text-gray-900 dark:text-white">
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
                            className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-500 resize-none"
                            rows="4"
                            maxLength="500"
                        />
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 text-right">
                            {description.length}/500
                        </p>
                    </div>

                    {/* Buttons */}
                    <div className="flex gap-3 pt-4">
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