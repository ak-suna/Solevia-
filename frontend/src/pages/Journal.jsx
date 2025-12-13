
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { BookOpen, Plus, Search, Calendar, Tag, Edit2, Trash2, Save, X, ArrowLeft, Bold, Italic, List, ListOrdered, Heading1, Heading2, Underline as UnderlineIcon, Highlighter, AlignLeft, AlignCenter, AlignRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import toast, { Toaster } from 'react-hot-toast';
import Sidebar from '../components/Sidebar';
import axios from 'axios';
import { getToken } from '../services/auth';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import TextAlign from '@tiptap/extension-text-align';
import Highlight from '@tiptap/extension-highlight';
import { TextStyle } from '@tiptap/extension-text-style';
import { Color } from '@tiptap/extension-color';

// Helper function for relative time
const getRelativeTime = (dateString) => {
  const date = new Date(dateString);
  const now = new Date();
  const diffInMs = now - date;
  const diffInSec = Math.floor(diffInMs / 1000);
  const diffInMin = Math.floor(diffInSec / 60);
  const diffInHour = Math.floor(diffInMin / 60);
  const diffInDay = Math.floor(diffInHour / 24);

  if (diffInDay > 30) {
    return `${Math.floor(diffInDay / 30)} month${Math.floor(diffInDay / 30) > 1 ? 's' : ''} ago`;
  } else if (diffInDay > 0) {
    return `${diffInDay} day${diffInDay > 1 ? 's' : ''} ago`;
  } else if (diffInHour > 0) {
    return `${diffInHour} hour${diffInHour > 1 ? 's' : ''} ago`;
  } else if (diffInMin > 0) {
    return `${diffInMin} minute${diffInMin > 1 ? 's' : ''} ago`;
  } else {
    return 'just now';
  }
};

// Toolbar Button Component
const ToolbarButton = ({ onClick, active, children, title }) => (
  <button
    onClick={onClick}
    type="button"
    title={title}
    className={`p-2 rounded hover:bg-gray-100 transition-colors ${
      active ? 'bg-[#D8E4E8] text-[#244856]': 'text-gray-700'
    }`}
  >
    {children}
  </button>
);

const Journal = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [entries, setEntries] = useState([]);
  const [isWriting, setIsWriting] = useState(false);
  const [editingEntry, setEditingEntry] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterTag, setFilterTag] = useState('all');
  const [loading, setLoading] = useState(false);
  const [currentPrompt, setCurrentPrompt] = useState('');
  const [expandedEntry, setExpandedEntry] = useState(null);
  
  // Form state
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [mood, setMood] = useState('');
  const [tags, setTags] = useState('');

  const API_URL = 'http://localhost:5000/api/journal';

  // Tiptap Editor
  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
      Highlight.configure({ multicolor: true }),
      TextStyle,
      Color,
    ],
    content: content,
    onUpdate: ({ editor }) => {
      setContent(editor.getHTML());
    },
  });

  const moods = [
    { value: 'happy', emoji: '😊', label: 'Happy' },
    { value: 'sad', emoji: '😢', label: 'Sad' },
    { value: 'excited', emoji: '🤩', label: 'Excited' },
    { value: 'neutral', emoji: '😐', label: 'Neutral' },
    { value: 'tired', emoji: '😴', label: 'Tired' },
    { value: 'anxious', emoji: '😰', label: 'Anxious' },
    { value: 'angry', emoji: '😠', label: 'Angry' }
  ];

  const defaultPrompts = [
    "What made you smile today?",
    "What are you grateful for?",
    "What challenged you today?",
    "What do you want to remember about today?",
    "How are you feeling right now?"
  ];

  const getMoodBasedPrompt = (moodValue, period) => {
    const prompts = {
      happy: [
        "What made you smile today? 😊",
        "What positive moments do you want to remember? 🌈",
        "Share what's bringing you happiness! 💛"
      ],
      sad: [
        "It's okay to feel sad. What's weighing on your heart? 💙",
        "Want to talk about what's bothering you? Writing can help. 🫂",
        "Express your feelings - this is a safe space. 💜"
      ],
      excited: [
        "What has you feeling so energized? Share your excitement! ⚡",
        "Something great is happening! Tell me about it! 🎉",
        "Capture this wonderful energy - what's making you excited! ✨"
      ],
      neutral: [
        "How was your day? What stands out? 🤔",
        "What's on your mind right now? 💭",
        "Reflect on your day - what happened? 📝"
      ],
      tired: [
        "You seem tired. What's been draining your energy? 😴",
        "It's okay to rest. What's been exhausting you? 🌙",
        "What do you need right now? Let's talk about it. 💤"
      ],
      anxious: [
        "What's making you feel anxious? Let's work through it together. 🌊",
        "Writing can help calm your mind. What are you worried about? 🕊️",
        "Take a deep breath. What thoughts are racing through your mind? 🧘"
      ],
      angry: [
        "What's frustrating you right now? It's okay to be angry. 🔥",
        "Let's channel this emotion. What triggered these feelings? 💢",
        "Express what's bothering you - this is your space. ⚡"
      ]
    };

    const moodPrompts = prompts[moodValue] || prompts.neutral;
    const selectedPrompt = moodPrompts[Math.floor(Math.random() * moodPrompts.length)];
    
    return `${period === 'morning' ? '🌅 Morning Check-In' : '🌙 Evening Reflection'}: ${selectedPrompt}`;
  };

  // Check if coming from mood check - RUNS ONCE ON MOUNT
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    if (location.state?.fromMoodCheck) {
      const moodValue = location.state.mood;
      const period = location.state.period;
      
      setMood(moodValue);
      setIsWriting(true);
      
      const prompt = getMoodBasedPrompt(moodValue, period);
      setCurrentPrompt(prompt);
      
      toast.success('Ready to journal! Express yourself freely 💭');
      
      // Clear the state to prevent re-triggering
      window.history.replaceState({}, document.title);
    }
  }, []);

  // Set random prompt when manually clicking "New Entry"
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    if (isWriting && !currentPrompt && !mood) {
      const randomPrompt = defaultPrompts[Math.floor(Math.random() * defaultPrompts.length)];
      setCurrentPrompt(randomPrompt);
    }
  }, [isWriting]);

  // Load entries on mount
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    loadEntries();
  }, []);

  // Update editor content when editing
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    if (editor && content) {
      editor.commands.setContent(content);
    }
  }, [editor, editingEntry]);

  const loadEntries = async () => {
    setLoading(true);
    try {
      const token = getToken();
      const response = await axios.get(API_URL, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setEntries(response.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
    } catch (error) {
      console.error('Error loading entries:', error);
      if (error.response?.status === 401) {
        navigate('/login');
      }
    } finally {
      setLoading(false);
    }
  };

  const saveEntry = async () => {
    if (!content.trim() || content === '<p></p>') {
      toast.error('Please write something before saving!');
      return;
    }

    const entryData = {
      title: title.trim() || 'Untitled',
      content: content.trim(),
      mood: mood || 'neutral',
      tags: tags.split(',').map(t => t.trim()).filter(Boolean)
    };

    setLoading(true);
    try {
      const token = getToken();
      
      if (editingEntry) {
        await axios.put(
          `${API_URL}/${editingEntry._id}`,
          entryData,
          { headers: { Authorization: `Bearer ${token}` }}
        );
        toast.success('Entry updated successfully! 📝');
      } else {
        await axios.post(
          API_URL,
          entryData,
          { headers: { Authorization: `Bearer ${token}` }}
        );
        toast.success('Entry saved successfully! ✨');
      }
      
      await loadEntries();
      resetForm();
    } catch (error) {
      console.error('Error saving entry:', error);
      toast.error('Failed to save entry. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const deleteEntry = async (id) => {
    toast((t) => (
      <div>
        <p className="font-medium mb-2">Delete this entry?</p>
        <p className="text-sm text-gray-600 mb-3">This cannot be undone.</p>
        <div className="flex gap-2">
          <button
            onClick={async () => {
              setLoading(true);
              try {
                const token = getToken();
                await axios.delete(`${API_URL}/${id}`, {
                  headers: { Authorization: `Bearer ${token}` }
                });
                await loadEntries();
                toast.success('Entry deleted');
              } catch (error) {
                console.error('Error deleting entry:', error);
                toast.error('Failed to delete entry.');
              } finally {
                setLoading(false);
              }
              toast.dismiss(t.id);
            }}
            className="px-3 py-1 bg-red-600 text-white rounded text-sm hover:bg-red-700"
          >
            Delete
          </button>
          <button
            onClick={() => toast.dismiss(t.id)}
            className="px-3 py-1 bg-gray-200 rounded text-sm hover:bg-gray-300"
          >
            Cancel
          </button>
        </div>
      </div>
    ), { duration: 5000 });
  };

  const startEdit = (entry) => {
    setEditingEntry(entry);
    setTitle(entry.title);
    setContent(entry.content);
    setMood(entry.mood);
    setTags(entry.tags.join(', '));
    setIsWriting(true);
    setCurrentPrompt('');
    if (editor) {
      editor.commands.setContent(entry.content);
    }
    toast('Editing mode activated 📝');
  };

  const resetForm = () => {
    setTitle('');
    setContent('');
    setMood('');
    setTags('');
    setEditingEntry(null);
    setIsWriting(false);
    setCurrentPrompt('');
    if (editor) {
      editor.commands.clearContent();
    }
  };

  const allTags = [...new Set(entries.flatMap(e => e.tags || []))];

  const filteredEntries = entries.filter(entry => {
    const matchesSearch = entry.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         entry.content.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTag = filterTag === 'all' || (entry.tags || []).includes(filterTag);
    return matchesSearch && matchesTag;
  });

  if (!editor) {
    return <div>Loading editor...</div>;
  }

  return (
    <div className="min-h-screen flex gap-6  border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 rounded-[50px] p-8 shadow-[0_10px_25px_rgba(248,186,144,0.25)] dark:shadow-[0_10px_25px_rgba(0,0,0,0.3)]">
      <Toaster position="top-center" />
      <Sidebar />

<div className="flex-1 ml-28 border-2 border-gray-200 dark:border-gray-700 bg-[#f4f2f0] dark:bg-gray-800 rounded-[50px] p-8 shadow-[0_10px_25px_rgba(248,186,144,0.25)] dark:shadow-[0_10px_25px_rgba(0,0,0,0.3)] overflow-y-auto">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-6"
        >
          <div className="flex items-center gap-3">
            <button 
              onClick={() => navigate('/dashboard')}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-6 h-6 text-gray-600" />
            </button>
            <BookOpen className="w-8 h-8 text-[#244856]" />
            <div>
              <h1 className="text-3xl font-bold text-gray-800">My Journal</h1>
              <p className="text-gray-600">Your safe space for thoughts and reflections</p>
            </div>
          </div>
          {!isWriting && (
            <motion.button
  whileHover={{ scale: 1.05 }}
  whileTap={{ scale: 0.95 }}
  onClick={() => setIsWriting(true)}
  disabled={loading}
  className="
    flex flex-col items-center justify-center
    bg-[#89beab] text-white
    w-24 h-24
    rounded-full shadow-lg
    hover:bg-[#f8ba90]
    hover:shadow-xl
    transition-all
    disabled:opacity-50 disabled:cursor-not-allowed
  "
>
  <Plus className="w-9 h-8 mb-1" />
  <span className="text-sm font-semibold text-white">New Entry</span>
</motion.button>


          )}
        </motion.div>

        {/* Writing Interface */}
        <AnimatePresence>
          {isWriting && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
className="bg-[#FCF8F5] rounded-2xl p-6 mb-6 overflow-hidden"
            >
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-gray-800">
                  {editingEntry ? 'Edit Entry' : 'New Entry'}
                </h2>
                <button onClick={resetForm} className="text-gray-400 hover:text-gray-600">
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Mood-based prompt */}
              {currentPrompt && (
                <motion.div 
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="bg-[#EDE5DA] border-l-4 border-[#244856] p-4 mb-4 rounded"

                >
                  <p className="text-[#244856] italic">
                    💭 {currentPrompt}
                  </p>
                </motion.div>
              )}

              <input
                type="text"
                placeholder="Title (optional)"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-[#244856]
"
              />

              {/* Tiptap Toolbar */}
              <div className="bg-[#FFFFF] border border-gray-300 rounded-t-lg p-2 flex flex-wrap gap-1">
                <ToolbarButton
                  onClick={() => editor.chain().focus().toggleBold().run()}
                  active={editor.isActive('bold')}
                  title="Bold"
                >
                  <Bold className="w-4 h-4" />
                </ToolbarButton>
                <ToolbarButton
                  onClick={() => editor.chain().focus().toggleItalic().run()}
                  active={editor.isActive('italic')}
                  title="Italic"
                >
                  <Italic className="w-4 h-4" />
                </ToolbarButton>
                <ToolbarButton
                  onClick={() => editor.chain().focus().toggleUnderline().run()}
                  active={editor.isActive('underline')}
                  title="Underline"
                >
                  <UnderlineIcon className="w-4 h-4" />
                </ToolbarButton>
                
                <div className="w-px h-6 bg-gray-300 mx-1"></div>
                
                <ToolbarButton
                  onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
                  active={editor.isActive('heading', { level: 1 })}
                  title="Heading 1"
                >
                  <Heading1 className="w-4 h-4" />
                </ToolbarButton>
                <ToolbarButton
                  onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                  active={editor.isActive('heading', { level: 2 })}
                  title="Heading 2"
                >
                  <Heading2 className="w-4 h-4" />
                </ToolbarButton>
                
                <div className="w-px h-6 bg-gray-300 mx-1"></div>
                
                <ToolbarButton
                  onClick={() => editor.chain().focus().toggleBulletList().run()}
                  active={editor.isActive('bulletList')}
                  title="Bullet List"
                >
                  <List className="w-4 h-4" />
                </ToolbarButton>
                <ToolbarButton
                  onClick={() => editor.chain().focus().toggleOrderedList().run()}
                  active={editor.isActive('orderedList')}
                  title="Numbered List"
                >
                  <ListOrdered className="w-4 h-4" />
                </ToolbarButton>
                
                <div className="w-px h-6 bg-gray-300 mx-1"></div>
                
                <ToolbarButton
                  onClick={() => editor.chain().focus().setTextAlign('left').run()}
                  active={editor.isActive({ textAlign: 'left' })}
                  title="Align Left"
                >
                  <AlignLeft className="w-4 h-4" />
                </ToolbarButton>
                <ToolbarButton
                  onClick={() => editor.chain().focus().setTextAlign('center').run()}
                  active={editor.isActive({ textAlign: 'center' })}
                  title="Align Center"
                >
                  <AlignCenter className="w-4 h-4" />
                </ToolbarButton>
                <ToolbarButton
                  onClick={() => editor.chain().focus().setTextAlign('right').run()}
                  active={editor.isActive({ textAlign: 'right' })}
                  title="Align Right"
                >
                  <AlignRight className="w-4 h-4" />
                </ToolbarButton>
                
                <div className="w-px h-6 bg-gray-300 mx-1"></div>
                
                <ToolbarButton
                  onClick={() => editor.chain().focus().toggleHighlight({ color: '#fef08a' }).run()}
                  active={editor.isActive('highlight')}
                  title="Highlight"
                >
                  <Highlighter className="w-4 h-4" />
                </ToolbarButton>
                
                <input
                  type="color"
                  onInput={(e) => editor.chain().focus().setColor(e.target.value).run()}
                  value={editor.getAttributes('textStyle').color || '#000000'}
                  className="w-8 h-8 rounded cursor-pointer"
                  title="Text Color"
                />
              </div>

              {/* Tiptap Editor */}
              <div className="bg-white border border-gray-200 border-t-0 rounded-b-lg p-4 min-h-[16rem]">
                <style dangerouslySetInnerHTML={{__html: `
                  .ProseMirror {
                    outline: none !important;
                    min-height: 240px;
                  }
                  .ProseMirror h1 {
                    font-size: 2em;
                    font-weight: 700;
                    margin: 0.5em 0;
                    line-height: 1.2;
                  }
                  .ProseMirror h2 {
                    font-size: 1.5em;
                    font-weight: 700;
                    margin: 0.5em 0;
                    line-height: 1.3;
                  }
                  .ProseMirror ul {
                    list-style-type: disc;
                    padding-left: 1.5rem;
                    margin: 1em 0;
                  }
                  .ProseMirror ol {
                    list-style-type: decimal;
                    padding-left: 1.5rem;
                    margin: 1em 0;
                  }
                  .ProseMirror li {
                    margin: 0.25em 0;
                  }
                  .ProseMirror p {
                    margin: 0.5em 0;
                  }
                  .ProseMirror strong {
                    font-weight: 700;
                  }
                  .ProseMirror em {
                    font-style: italic;
                  }
                  .ProseMirror u {
                    text-decoration: underline;
                  }
                  .ProseMirror mark {
                    background-color: #fef08a;
                    padding: 0.1em 0.2em;
                    border-radius: 0.2em;
                  }
                `}} />
                <EditorContent editor={editor} />
              </div>

              <div className="mb-4 mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  How are you feeling?
                </label>
                <div className="flex gap-2 flex-wrap">
                  {moods.map(m => (
                    <motion.button
                      key={m.value}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      type="button"
                      onClick={() => setMood(m.value)}
                      className={`px-4 py-2 rounded-lg border-2 transition-all ${
                        mood === m.value
                          ? 'border-purple-600 bg-purple-50'
                          : 'border-gray-200 hover:border-purple-300'
                      }`}
                    >
                      <span className="text-2xl mr-2">{m.emoji}</span>
                      <span className="text-sm">{m.label}</span>
                    </motion.button>
                  ))}
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tags (comma-separated)
                </label>
                <input
                  type="text"
                  placeholder="gratitude, work, family..."
                  value={tags}
                  onChange={(e) => setTags(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#244856]
"
                />
              </div>

              <div className="flex items-center justify-between mb-4 text-sm text-gray-600">
                <span>{content.replace(/<[^>]*>/g, '').split(/\s+/).filter(Boolean).length} words</span>
                <span>{content.replace(/<[^>]*>/g, '').length} characters</span>
              </div>

              <div className="flex gap-3">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={saveEntry}
                  disabled={!content.trim() || loading}
                  type="button"
                  className="px-8 py-4 flex items-center justify-center gap-2 bg-[#89beab] text-white rounded-full shadow-lg hover:bg-[#f8ba90] hover:shadow-xl min-w-[150px] min-h-[50px] transition-all"
                >
                  <Save className="w-5 h-5" />
                  {loading ? 'Saving...' : (editingEntry ? 'Update' : 'Save')} Entry
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={resetForm}
                  disabled={loading}
                  type="button"
                  className="px-8 py-4 border-2 border-gray-400 text-black rounded-full shadow-lg  hover:shadow-xl min-w-[150px] min-h-[50px] flex justify-center items-center transition-all"
                >
                  Cancel
                </motion.button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Loading State */}
        {loading && !isWriting && (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
          </div>
        )}

        {/* Search and Filters */}
        {!isWriting && !loading && entries.length > 0 && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-gray-50 rounded-2xl p-6 mb-6"
          >
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search entries..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#244856]
"
                />
              </div>
              <select
                value={filterTag}
                onChange={(e) => setFilterTag(e.target.value)}
                className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#244856]
"
              >
                <option value="all">All Tags</option>
                {allTags.map(tag => (
                  <option key={tag} value={tag}>{tag}</option>
                ))}
              </select>
            </div>
          </motion.div>
        )}

        {/* Entries List */}
        {!loading && (
          <div className="space-y-4">
            {filteredEntries.length === 0 ? (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-gray-50 rounded-2xl p-12 text-center"
              >
                <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-700 mb-2">
                  {entries.length === 0 ? 'Start Your Journey' : 'No Entries Found'}
                </h3>
                <p className="text-gray-500 mb-6">
                  {entries.length === 0 
                    ? 'Begin documenting your thoughts and feelings.'
                    : 'Try adjusting your search or filters.'
                  }
                </p>
                {entries.length === 0 && (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setIsWriting(true)}
                    className="bg-[#89beab] text-white  p-5 rounded-full shadow-lg hover:bg-[#f8ba90] hover:shadow-xl "
                  >
                    Write First Entry
                  </motion.button>
                )}
              </motion.div>
            ) : (
              <AnimatePresence>
                {filteredEntries.map((entry, index) => {
                  const moodData = moods.find(m => m.value === entry.mood);
                  const isExpanded = expandedEntry === entry._id;
                  
                  return (
                    <motion.div
                      key={entry._id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: -100 }}
                      transition={{ delay: index * 0.05 }}
                      className="bg-gray-50 rounded-2xl p-6 hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-xl font-bold text-gray-800">{entry.title}</h3>
                            {moodData && (
                              <span className="text-2xl" title={moodData.label}>
                                {moodData.emoji}
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-4 text-sm text-gray-500">
                            <div className="flex items-center gap-1">
                              <Calendar className="w-4 h-4" />
                              {new Date(entry.createdAt).toLocaleDateString('en-US', {
                                month: 'short',
                                day: 'numeric',
                                year: 'numeric'
                              })}
                            </div>
                            <span className="text-purple-600">
                              {getRelativeTime(entry.createdAt)}
                            </span>
                            <span>{entry.content.replace(/<[^>]*>/g, '').split(/\s+/).filter(Boolean).length} words</span>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => startEdit(entry)}
                            className="p-2 text-gray-400 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
                          >
                            <Edit2 className="w-5 h-5" />
                          </motion.button>
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => deleteEntry(entry._id)}
                            className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          >
                            <Trash2 className="w-5 h-5" />
                          </motion.button>
                        </div>
                      </div>

                      <div 
                        className={`text-gray-700 mb-3 prose prose-sm max-w-none cursor-pointer ${!isExpanded ? 'line-clamp-3' : ''}`}
                        onClick={() => setExpandedEntry(isExpanded ? null : entry._id)}
                        dangerouslySetInnerHTML={{ __html: entry.content }}
                      />

                      {entry.content.length > 200 && (
                        <button
                          onClick={() => setExpandedEntry(isExpanded ? null : entry._id)}
                          className="text-purple-600 text-sm hover:underline mb-3"
                        >
                          {isExpanded ? 'Show less' : 'Read more'}
                        </button>
                      )}

                      {entry.tags && entry.tags.length > 0 && (
                        <div className="flex items-center gap-2 flex-wrap">
                          <Tag className="w-4 h-4 text-gray-400" />
                          {entry.tags.map((tag, idx) => (
                            <motion.span
                              key={idx}
                              whileHover={{ scale: 1.05 }}
                              className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm cursor-pointer"
                              onClick={() => setFilterTag(tag)}
                            >
                              {tag}
                            </motion.span>
                          ))}
                        </div>
                      )}
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Journal;