import React, { useState } from "react";
import { X } from 'lucide-react';
import { createPost } from "../services/communityService";

const CreatePostModal = ({ onClose, onPostCreated, groupId = null }) => {
    const [content, setContent] = useState("");
    const [type, setType] = useState("general");
    const [category, setCategory] = useState("other");
    const [tags, setTags] = useState("");
    const [submitting, setSubmitting] = useState(false);

    const types = [
        { value: "general", label: "General", icon: "💬" },
        { value: "tip", label: "Tip", icon: "💡" },
        { value: "reflection", label: "Reflection", icon: "🤔" },
        { value: "motivation", label: "Motivation", icon: "🔥" },
        { value: "story", label: "Story", icon: "📖" }
    ];

    const categories = [
        { value: "wellbeing", label: "Wellbeing", icon: "💚" },
        { value: "habits", label: "Habits", icon: "✅" },
        { value: "journaling", label: "Journaling", icon: "📝" },
        { value: "gratitude", label: "Gratitude", icon: "🙏" },
        { value: "mindfulness", label: "Mindfulness", icon: "🧘" },
        { value: "fitness", label: "Fitness", icon: "💪" },
        { value: "other", label: "Other", icon: "✨" }
    ];

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!content.trim()) {
            alert("Please write something!");
            return;
        }

        setSubmitting(true);
        try {
            const postData = {
                content: content.trim(),
                type,
                category,
                tags: tags.split(',').map(t => t.trim()).filter(Boolean),
                groupId
            };

            const result = await createPost(postData);
            onPostCreated(result.post);
        } catch (error) {
            console.error("Error creating post:", error);
            alert("Failed to create post. Please try again.");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-gray-800 rounded-3xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                        <span className="text-[#f4873e]">Create </span>
                        <span className="text-[#89beab]">Post</span>
                    </h2>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
                    >
                        <X className="w-6 h-6 text-gray-600 dark:text-gray-400" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Content */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                            What's on your mind?
                        </label>
                        <textarea
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            placeholder="Share your thoughts, experiences, or tips..."
                            className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#89beab] resize-none"
                            rows="6"
                            maxLength="2000"
                        />
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 text-right">
                            {content.length}/2000
                        </p>
                    </div>

                    {/* Type Selection */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                            Post Type
                        </label>
                        <div className="flex flex-wrap gap-2">
                            {types.map(t => (
                                <button
                                    key={t.value}
                                    type="button"
                                    onClick={() => setType(t.value)}
                                    className={`px-4 py-2 rounded-full flex items-center gap-2 transition-all ${type === t.value
                                            ? "bg-[#f4873e] text-white shadow-md"
                                            : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
                                        }`}
                                >
                                    <span>{t.icon}</span>
                                    <span className="text-sm font-medium">{t.label}</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Category Selection */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                            Category
                        </label>
                        <div className="flex flex-wrap gap-2">
                            {categories.map(cat => (
                                <button
                                    key={cat.value}
                                    type="button"
                                    onClick={() => setCategory(cat.value)}
                                    className={`px-4 py-2 rounded-full flex items-center gap-2 transition-all ${category === cat.value
                                            ? "bg-[#89beab] text-white shadow-md"
                                            : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
                                        }`}
                                >
                                    <span>{cat.icon}</span>
                                    <span className="text-sm font-medium">{cat.label}</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Tags */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                            Tags (optional)
                        </label>
                        <input
                            type="text"
                            value={tags}
                            onChange={(e) => setTags(e.target.value)}
                            placeholder="gratitude, growth, wellness (comma separated)"
                            className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#89beab]"
                        />
                    </div>

                    {/* Buttons */}
                    <div className="flex gap-3 justify-end pt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-6 py-3 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 font-semibold hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={submitting || !content.trim()}
                            className="px-6 py-3 rounded-full bg-[#f4873e] text-white font-semibold hover:bg-[#FFA669] transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
                        >
                            {submitting ? "Posting..." : "Post"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreatePostModal;