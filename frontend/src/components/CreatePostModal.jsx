import React, { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { X, Image as ImageIcon, Trash2 } from 'lucide-react';
import { createPost } from "../services/communityService";
import { showError } from "../utils/uiFeedback";

const CreatePostModal = ({ onClose, onPostCreated, groupId = null }) => {
    const queryClient = useQueryClient();
    const [content, setContent] = useState("");
    const [type, setType] = useState("general");
    const [category, setCategory] = useState("other");
    const [tags, setTags] = useState("");
    const [selectedImage, setSelectedImage] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
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

    const handleImageSelect = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        // Validate file type
        if (!file.type.startsWith('image/')) {
            showError('Please select an image file!');
            return;
        }

        // Validate file size (5MB max)
        if (file.size > 5 * 1024 * 1024) {
            showError('Image size must be less than 5MB!');
            return;
        }

        setSelectedImage(file);

        // Create preview
        const reader = new FileReader();
        reader.onloadend = () => {
            setImagePreview(reader.result);
        };
        reader.readAsDataURL(file);
    };

    const handleRemoveImage = () => {
        setSelectedImage(null);
        setImagePreview(null);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!content.trim()) return;

        setSubmitting(true);
        try {
            // Just pass the raw data object to the service
            const result = await createPost({
                content: content.trim(),
                type,
                category,
                tags, // Pass the raw string "tag1, tag2"
                groupId,
                image: selectedImage // The File object
            });

            queryClient.invalidateQueries({ queryKey: ["community"] });
            onPostCreated(result.post);
            onClose(); // Close modal on success
        } catch (error) {
            showError("Failed to create post. Check console for details.");
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

                    {/* Image Upload Section */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                            Add Image (optional)
                        </label>

                        {!imagePreview ? (
                            <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl p-6 text-center hover:border-[#89beab] transition-colors cursor-pointer">
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageSelect}
                                    className="hidden"
                                    id="image-upload"
                                />
                                <label htmlFor="image-upload" className="cursor-pointer">
                                    <ImageIcon className="w-12 h-12 mx-auto text-gray-400 dark:text-gray-500 mb-2" />
                                    <p className="text-sm text-gray-600 dark:text-gray-400">
                                        Click to upload an image
                                    </p>
                                    <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                                        PNG, JPG, GIF up to 5MB
                                    </p>
                                </label>
                            </div>
                        ) : (
                            <div className="relative">
                                <img
                                    src={imagePreview}
                                    alt="Preview"
                                    className="w-full rounded-xl max-h-96 object-cover"
                                />
                                <button
                                    type="button"
                                    onClick={handleRemoveImage}
                                    className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors shadow-lg"
                                >
                                    <Trash2 className="w-5 h-5" />
                                </button>
                            </div>
                        )}
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