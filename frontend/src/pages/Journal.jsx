
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { BookOpen, Plus, Search, Calendar, Tag, Edit2, Trash2, Save, X, ArrowLeft } from 'lucide-react';
import Sidebar from '../components/Sidebar';
import axios from 'axios';
import { getToken } from '../services/auth';

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
  
  // Form state
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [mood, setMood] = useState('');
  const [tags, setTags] = useState('');

  const API_URL = 'http://localhost:5000/api/journal';

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
        "Capture this wonderful energy - what's making you excited? ✨"
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
  useEffect(() => {
    console.log('🔍 Location state on mount:', location.state);
    
    if (location.state?.fromMoodCheck) {
      const moodValue = location.state.mood;
      const period = location.state.period;
      
      console.log('✅ Coming from mood check!');
      console.log('📊 Mood:', moodValue);
      console.log('⏰ Period:', period);
      
      // Set everything at once
      setMood(moodValue);
      setIsWriting(true);
      
      const prompt = getMoodBasedPrompt(moodValue, period);
      console.log('💭 Generated prompt:', prompt);
      setCurrentPrompt(prompt);
      
      // Clear the state to prevent re-triggering
      window.history.replaceState({}, document.title);
    }
  }, []); // Empty dependency array - runs once on mount

  // Set random prompt when manually clicking "New Entry"
  useEffect(() => {
    // Only set prompt if writing manually (not from mood check)
    if (isWriting && !currentPrompt && !mood) {
      const randomPrompt = defaultPrompts[Math.floor(Math.random() * defaultPrompts.length)];
      console.log('📝 Setting random prompt:', randomPrompt);
      setCurrentPrompt(randomPrompt);
    }
  }, [isWriting]);

  // Load entries on mount
  useEffect(() => {
    loadEntries();
  }, []);

  // Debug log to see current state
  useEffect(() => {
    console.log('📌 Current state:', {
      isWriting,
      mood,
      currentPrompt: currentPrompt ? 'SET' : 'NOT SET'
    });
  }, [isWriting, mood, currentPrompt]);

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
    if (!content.trim()) {
      alert('Please write something before saving!');
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
      } else {
        await axios.post(
          API_URL,
          entryData,
          { headers: { Authorization: `Bearer ${token}` }}
        );
      }
      
      await loadEntries();
      resetForm();
    } catch (error) {
      console.error('Error saving entry:', error);
      alert('Failed to save entry. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const deleteEntry = async (id) => {
    if (!window.confirm('Delete this entry? This cannot be undone.')) return;
    
    setLoading(true);
    try {
      const token = getToken();
      await axios.delete(`${API_URL}/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      await loadEntries();
    } catch (error) {
      console.error('Error deleting entry:', error);
      alert('Failed to delete entry.');
    } finally {
      setLoading(false);
    }
  };

  const startEdit = (entry) => {
    setEditingEntry(entry);
    setTitle(entry.title);
    setContent(entry.content);
    setMood(entry.mood);
    setTags(entry.tags.join(', '));
    setIsWriting(true);
    setCurrentPrompt('');
  };

  const resetForm = () => {
    setTitle('');
    setContent('');
    setMood('');
    setTags('');
    setEditingEntry(null);
    setIsWriting(false);
    setCurrentPrompt('');
  };

  const allTags = [...new Set(entries.flatMap(e => e.tags || []))];

  const filteredEntries = entries.filter(entry => {
    const matchesSearch = entry.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         entry.content.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTag = filterTag === 'all' || (entry.tags || []).includes(filterTag);
    return matchesSearch && matchesTag;
  });

  return (
    <div className="min-h-screen bg-[#d6d0eb] p-6 flex gap-6">
      <Sidebar />

      <div className="flex-1 bg-white rounded-[30px] p-8 shadow-xl overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <button 
              onClick={() => navigate('/dashboard')}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-6 h-6 text-gray-600" />
            </button>
            <BookOpen className="w-8 h-8 text-purple-600" />
            <div>
              <h1 className="text-3xl font-bold text-gray-800">My Journal</h1>
              <p className="text-gray-600">Your safe space for thoughts and reflections</p>
            </div>
          </div>
          {!isWriting && (
            <button
              onClick={() => setIsWriting(true)}
              disabled={loading}
              className="flex items-center gap-2 bg-purple-600 text-white px-6 py-3 rounded-xl hover:bg-purple-700 transition-colors disabled:bg-gray-400"
            >
              <Plus className="w-5 h-5" />
              New Entry
            </button>
          )}
        </div>

        {/* Writing Interface */}
        {isWriting && (
          <div className="bg-gray-50 rounded-2xl p-6 mb-6">
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
              <div className="bg-purple-50 border-l-4 border-purple-600 p-4 mb-4 rounded">
                <p className="text-purple-800 italic">
                  💭 {currentPrompt}
                </p>
              </div>
            )}

            <input
              type="text"
              placeholder="Title (optional)"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />

            <textarea
              placeholder="Start writing... Express yourself freely."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full h-64 px-4 py-3 border border-gray-200 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
              autoFocus
            />

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                How are you feeling?
              </label>
              <div className="flex gap-2 flex-wrap">
                {moods.map(m => (
                  <button
                    key={m.value}
                    onClick={() => setMood(m.value)}
                    className={`px-4 py-2 rounded-lg border-2 transition-all ${
                      mood === m.value
                        ? 'border-purple-600 bg-purple-50'
                        : 'border-gray-200 hover:border-purple-300'
                    }`}
                  >
                    <span className="text-2xl mr-2">{m.emoji}</span>
                    <span className="text-sm">{m.label}</span>
                  </button>
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
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>

            <div className="flex items-center justify-between mb-4 text-sm text-gray-600">
              <span>{content.split(/\s+/).filter(Boolean).length} words</span>
              <span>{content.length} characters</span>
            </div>

            <div className="flex gap-3">
              <button
                onClick={saveEntry}
                disabled={!content.trim() || loading}
                className="flex items-center gap-2 bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
              >
                <Save className="w-5 h-5" />
                {loading ? 'Saving...' : (editingEntry ? 'Update' : 'Save')} Entry
              </button>
              <button
                onClick={resetForm}
                disabled={loading}
                className="px-6 py-3 border-2 border-gray-200 rounded-lg hover:bg-gray-50 transition-colors disabled:bg-gray-100"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Loading State */}
        {loading && !isWriting && (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
          </div>
        )}

        {/* Search and Filters */}
        {!isWriting && !loading && entries.length > 0 && (
          <div className="bg-gray-50 rounded-2xl p-6 mb-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search entries..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
              <select
                value={filterTag}
                onChange={(e) => setFilterTag(e.target.value)}
                className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="all">All Tags</option>
                {allTags.map(tag => (
                  <option key={tag} value={tag}>{tag}</option>
                ))}
              </select>
            </div>
          </div>
        )}

        {/* Entries List */}
        {!loading && (
          <div className="space-y-4">
            {filteredEntries.length === 0 ? (
              <div className="bg-gray-50 rounded-2xl p-12 text-center">
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
                  <button
                    onClick={() => setIsWriting(true)}
                    className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700"
                  >
                    Write First Entry
                  </button>
                )}
              </div>
            ) : (
              filteredEntries.map(entry => {
                const moodData = moods.find(m => m.value === entry.mood);
                return (
                  <div key={entry._id} className="bg-gray-50 rounded-2xl p-6 hover:shadow-md transition-shadow">
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
                          <span>{entry.content.split(/\s+/).filter(Boolean).length} words</span>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => startEdit(entry)}
                          className="p-2 text-gray-400 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
                        >
                          <Edit2 className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => deleteEntry(entry._id)}
                          className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </div>

                    <p className="text-gray-700 mb-3 line-clamp-3">{entry.content}</p>

                    {entry.tags && entry.tags.length > 0 && (
                      <div className="flex items-center gap-2 flex-wrap">
                        <Tag className="w-4 h-4 text-gray-400" />
                        {entry.tags.map((tag, idx) => (
                          <span
                            key={idx}
                            className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Journal;