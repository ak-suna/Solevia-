// import React, { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import Sidebar from "../components/Sidebar";
// import NotificationBell from '../components/NotificationBell';
// import { Menu, Plus, Users, Trophy, TrendingUp, Clock, XCircle, ArrowRight, Calendar } from 'lucide-react';
// import { getPosts, getUserGroups, getUserChallenges } from "../services/communityService";

// const CommunityPage = () => {
//     const navigate = useNavigate();
//     const [activeTab, setActiveTab] = useState("feed"); // feed, groups, challenges
//     const [categoryFilter, setCategoryFilter] = useState("all");
//     const [posts, setPosts] = useState([]);
//     const [myGroups, setMyGroups] = useState([]);
//     const [myChallenges, setMyChallenges] = useState([]);
//     const [pendingRequests, setPendingRequests] = useState([]);
//     const [loading, setLoading] = useState(true);

//     useEffect(() => {
//         fetchData();
//     }, [activeTab, categoryFilter]);

//     const fetchData = async () => {
//         setLoading(true);
//         try {
//             // Fetch based on active tab
//             if (activeTab === "feed") {
//                 const data = await getPosts(1, 10, categoryFilter === "all" ? null : categoryFilter);
//                 setPosts(data.posts || []);
//             }

//             // Always fetch user's groups and challenges for right cards
//             const groupsData = await getUserGroups();
//             setMyGroups(groupsData.groups || []);

//             const challengesData = await getUserChallenges();
//             setMyChallenges(challengesData.challenges || []);

//             // TODO: Fetch pending requests (will need new API endpoint)
//             // For now, mock data:
//             setPendingRequests([
//                 // { groupId: "123", groupName: "Mindfulness Group", status: "pending", requestedAt: "2 days ago" },
//                 // { groupId: "456", groupName: "Wellness Circle", status: "rejected", reason: "Group is full. Try again in 2 weeks.", requestedAt: "1 week ago" }
//             ]);

//         } catch (error) {
//             console.error("Error fetching data:", error);
//         } finally {
//             setLoading(false);
//         }
//     };

//     const tabs = [
//         { id: "feed", label: "Community Feed", icon: "📰" },
//         { id: "groups", label: "My Groups", icon: "👥" },
//         { id: "challenges", label: "Challenges", icon: "🏆" }
//     ];

//     const categories = [
//         { id: "all", label: "All", icon: "📋" },
//         { id: "wellbeing", label: "Wellbeing", icon: "💚" },
//         { id: "habits", label: "Habits", icon: "✅" },
//         { id: "journaling", label: "Journaling", icon: "📝" },
//         { id: "gratitude", label: "Gratitude", icon: "🙏" },
//         { id: "mindfulness", label: "Mindfulness", icon: "🧘" },
//         { id: "fitness", label: "Fitness", icon: "💪" },
//         { id: "other", label: "Other", icon: "✨" }
//     ];

//     const getCategoryColor = (category) => {
//         const colors = {
//             wellbeing: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
//             habits: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
//             journaling: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
//             gratitude: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
//             mindfulness: "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400",
//             fitness: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
//             other: "bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400"
//         };
//         return colors[category] || colors.other;
//     };

//     return (
//         <div className="min-h-screen bg-white dark:bg-gray-900 p-6 flex gap-6 relative">
//             {/* LEFT SIDEBAR */}
//             <Sidebar />

//             {/* MAIN CONTENT AREA - Now 65% width */}
//             <div className="flex-1 ml-28 mr-80 border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 rounded-[50px] p-8 shadow-[0_10px_25px_rgba(248,186,144,0.25)] dark:shadow-[0_10px_25px_rgba(0,0,0,0.3)] max-h-[775px] overflow-y-auto">

//                 {/* Header */}
//                 <div className="mb-6">
//                     <h1 className="text-3xl font-bold mb-1" style={{ fontFamily: "Brasika" }}>
//                         <span className="text-[#f4873e] dark:text-orange-400">Community </span>
//                         <span className="text-[#89beab] dark:text-teal-400">Space</span>
//                     </h1>
//                     <p className="text-gray-600 dark:text-gray-400">Connect, share, and grow together</p>
//                 </div>

//                 {/* Tabs */}
//                 <div className="flex gap-6 mb-6 border-b-2 border-gray-200 dark:border-gray-700">
//                     {tabs.map(tab => (
//                         <button
//                             key={tab.id}
//                             onClick={() => setActiveTab(tab.id)}
//                             className={`
//                                 pb-3 px-2 font-semibold transition-all flex items-center gap-2
//                                 ${activeTab === tab.id
//                                     ? 'text-[#f4873e] border-b-4 border-[#f4873e]'
//                                     : 'text-gray-600 dark:text-gray-400 hover:text-[#f4873e]'
//                                 }
//                             `}
//                         >
//                             <span className="text-xl">{tab.icon}</span>
//                             {tab.label}
//                         </button>
//                     ))}
//                 </div>

//                 {/* Category Filters (Only show in Feed tab) */}
//                 {activeTab === "feed" && (
//                     <div className="flex gap-3 mb-6 overflow-x-auto pb-2">
//                         {categories.map(category => (
//                             <button
//                                 key={category.id}
//                                 onClick={() => setCategoryFilter(category.id)}
//                                 className={`
//                                     px-4 py-2 rounded-full text-sm font-semibold whitespace-nowrap transition-all flex items-center gap-2
//                                     ${categoryFilter === category.id
//                                         ? 'bg-[#f4873e] text-white shadow-lg'
//                                         : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:shadow-md'
//                                     }
//                                 `}
//                             >
//                                 <span>{category.icon}</span>
//                                 {category.label}
//                             </button>
//                         ))}
//                     </div>
//                 )}

//                 {/* Tab Content */}
//                 <div>
//                     {/* FEED TAB */}
//                     {activeTab === "feed" && (
//                         <div>
//                             {loading ? (
//                                 <div className="flex justify-center items-center py-12">
//                                     <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#f4873e]"></div>
//                                 </div>
//                             ) : posts.length === 0 ? (
//                                 <div className="text-center py-12">
//                                     <p className="text-gray-600 dark:text-gray-400">No posts yet. Be the first to share!</p>
//                                     <button className="mt-4 px-6 py-3 bg-gradient-to-r from-[#f4873e] to-[#ff9e5e] text-white rounded-full font-bold hover:shadow-lg">
//                                         Create Post
//                                     </button>
//                                 </div>
//                             ) : (
//                                 <div className="space-y-4">
//                                     {posts.map(post => (
//                                         <div key={post._id} className="bg-gradient-to-br from-gray-50 to-white dark:from-gray-700 dark:to-gray-800 rounded-3xl p-6 border-2 border-gray-200 dark:border-gray-600 hover:border-[#f4873e] transition-all">
//                                             {/* Post Header */}
//                                             <div className="flex items-center gap-3 mb-3">
//                                                 <div className="w-10 h-10 bg-gradient-to-br from-[#f4873e] to-[#ff9e5e] rounded-full flex items-center justify-center text-white font-bold">
//                                                     {post.userId?.firstName?.[0]}{post.userId?.lastName?.[0]}
//                                                 </div>
//                                                 <div className="flex-1">
//                                                     <p className="font-bold text-gray-900 dark:text-white">
//                                                         {post.userId?.firstName} {post.userId?.lastName}
//                                                     </p>
//                                                     <p className="text-sm text-gray-500 dark:text-gray-400">
//                                                         {new Date(post.createdAt).toLocaleDateString()}
//                                                     </p>
//                                                 </div>
//                                                 <span className={`px-3 py-1 rounded-full text-xs font-bold ${getCategoryColor(post.category)}`}>
//                                                     {post.category}
//                                                 </span>
//                                             </div>

//                                             {/* Post Content */}
//                                             <p className="text-gray-700 dark:text-gray-300 mb-4">{post.content}</p>

//                                             {/* Reactions */}
//                                             <div className="flex items-center gap-4 text-gray-600 dark:text-gray-400">
//                                                 <button className="hover:text-[#f4873e] transition-colors">👍 {post.reactions?.length || 0}</button>
//                                                 <button className="hover:text-[#f4873e] transition-colors">❤️</button>
//                                                 <button className="hover:text-[#f4873e] transition-colors">🎉</button>
//                                                 <button className="hover:text-[#f4873e] transition-colors">💪</button>
//                                                 <button className="hover:text-[#f4873e] transition-colors">🙏</button>
//                                                 <button className="hover:text-[#f4873e] transition-colors ml-auto">💬 {post.comments?.length || 0}</button>
//                                             </div>
//                                         </div>
//                                     ))}
//                                 </div>
//                             )}
//                         </div>
//                     )}

//                     {/* MY GROUPS TAB */}
//                     {activeTab === "groups" && (
//                         <div>
//                             <div className="flex justify-between items-center mb-6">
//                                 <h2 className="text-xl font-bold text-gray-900 dark:text-white">My Groups</h2>
//                                 <button
//                                     onClick={() => navigate('/community/groups/browse')}
//                                     className="px-6 py-2 bg-gradient-to-r from-[#89beab] to-[#6fa893] text-white rounded-full font-bold hover:shadow-lg flex items-center gap-2"
//                                 >
//                                     Explore Groups
//                                     <ArrowRight className="w-4 h-4" />
//                                 </button>
//                             </div>

//                             {/* Joined Groups */}
//                             {myGroups.length > 0 && (
//                                 <div className="mb-8">
//                                     <h3 className="text-lg font-bold text-gray-700 dark:text-gray-300 mb-4">✓ Joined Groups</h3>
//                                     <div className="grid grid-cols-1 gap-4">
//                                         {myGroups.map(group => (
//                                             <div key={group._id} className="bg-gradient-to-br from-teal-50 to-white dark:from-teal-900/20 dark:to-gray-800 rounded-2xl p-5 border-2 border-teal-200 dark:border-teal-800 hover:shadow-lg transition-all cursor-pointer"
//                                                 onClick={() => navigate(`/community/group/${group._id}`)}>
//                                                 <div className="flex items-center gap-3">
//                                                     <span className="text-3xl">{group.icon || "📝"}</span>
//                                                     <div className="flex-1">
//                                                         <h4 className="font-bold text-gray-900 dark:text-white">{group.name}</h4>
//                                                         <p className="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-2">
//                                                             <Users className="w-4 h-4" />
//                                                             {group.members?.length || 0} members
//                                                         </p>
//                                                     </div>
//                                                 </div>
//                                             </div>
//                                         ))}
//                                     </div>
//                                 </div>
//                             )}

//                             {/* Pending Requests */}
//                             {pendingRequests.filter(r => r.status === 'pending').length > 0 && (
//                                 <div className="mb-8">
//                                     <h3 className="text-lg font-bold text-gray-700 dark:text-gray-300 mb-4">⏳ Pending Requests</h3>
//                                     <div className="space-y-3">
//                                         {pendingRequests.filter(r => r.status === 'pending').map(request => (
//                                             <div key={request.groupId} className="bg-yellow-50 dark:bg-yellow-900/20 rounded-2xl p-4 border-2 border-yellow-200 dark:border-yellow-800">
//                                                 <div className="flex items-center gap-3">
//                                                     <Clock className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
//                                                     <div className="flex-1">
//                                                         <p className="font-bold text-gray-900 dark:text-white">{request.groupName}</p>
//                                                         <p className="text-sm text-gray-600 dark:text-gray-400">Waiting for approval • Sent {request.requestedAt}</p>
//                                                     </div>
//                                                 </div>
//                                             </div>
//                                         ))}
//                                     </div>
//                                 </div>
//                             )}

//                             {/* Rejected Requests */}
//                             {pendingRequests.filter(r => r.status === 'rejected').length > 0 && (
//                                 <div className="mb-8">
//                                     <h3 className="text-lg font-bold text-gray-700 dark:text-gray-300 mb-4">❌ Rejected Requests</h3>
//                                     <div className="space-y-3">
//                                         {pendingRequests.filter(r => r.status === 'rejected').map(request => (
//                                             <div key={request.groupId} className="bg-red-50 dark:bg-red-900/20 rounded-2xl p-4 border-2 border-red-200 dark:border-red-800">
//                                                 <div className="flex items-start gap-3">
//                                                     <XCircle className="w-5 h-5 text-red-600 dark:text-red-400 mt-1" />
//                                                     <div className="flex-1">
//                                                         <p className="font-bold text-gray-900 dark:text-white">{request.groupName}</p>
//                                                         <p className="text-sm text-red-600 dark:text-red-400 mt-1">
//                                                             <strong>Reason:</strong> {request.reason}
//                                                         </p>
//                                                         <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Rejected {request.requestedAt}</p>
//                                                     </div>
//                                                     <button className="px-4 py-2 bg-gradient-to-r from-[#89beab] to-[#6fa893] text-white rounded-full text-sm font-bold hover:shadow-lg">
//                                                         Try Again
//                                                     </button>
//                                                 </div>
//                                             </div>
//                                         ))}
//                                     </div>
//                                 </div>
//                             )}

//                             {/* Empty State */}
//                             {myGroups.length === 0 && pendingRequests.length === 0 && (
//                                 <div className="text-center py-12">
//                                     <Users className="w-16 h-16 mx-auto mb-4 text-gray-400" />
//                                     <p className="text-gray-600 dark:text-gray-400 mb-4">You haven't joined any groups yet</p>
//                                     <button
//                                         onClick={() => navigate('/community/groups/browse')}
//                                         className="px-6 py-3 bg-gradient-to-r from-[#89beab] to-[#6fa893] text-white rounded-full font-bold hover:shadow-lg"
//                                     >
//                                         Explore Groups
//                                     </button>
//                                 </div>
//                             )}
//                         </div>
//                     )}

//                     {/* CHALLENGES TAB */}
//                     {activeTab === "challenges" && (
//                         <div>
//                             <div className="flex justify-between items-center mb-6">
//                                 <h2 className="text-xl font-bold text-gray-900 dark:text-white">My Challenges</h2>
//                                 <button
//                                     onClick={() => navigate('/community/challenges/browse')}
//                                     className="px-6 py-2 bg-gradient-to-r from-[#f4873e] to-[#ff9e5e] text-white rounded-full font-bold hover:shadow-lg flex items-center gap-2"
//                                 >
//                                     Explore Challenges
//                                     <ArrowRight className="w-4 h-4" />
//                                 </button>
//                             </div>

//                             {myChallenges.length > 0 ? (
//                                 <div className="grid grid-cols-1 gap-4">
//                                     {myChallenges.map(challenge => (
//                                         <div key={challenge._id} className="bg-gradient-to-br from-orange-50 to-white dark:from-orange-900/20 dark:to-gray-800 rounded-2xl p-5 border-2 border-orange-200 dark:border-orange-800 hover:shadow-lg transition-all">
//                                             <div className="flex items-start justify-between mb-3">
//                                                 <div className="flex items-center gap-3">
//                                                     <span className="text-3xl">{challenge.icon || "🏆"}</span>
//                                                     <div>
//                                                         <h4 className="font-bold text-gray-900 dark:text-white">{challenge.title}</h4>
//                                                         <p className="text-sm text-gray-600 dark:text-gray-400">{challenge.duration} days</p>
//                                                     </div>
//                                                 </div>
//                                                 <span className="px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-full text-xs font-bold">
//                                                     Active
//                                                 </span>
//                                             </div>

//                                             {/* Progress Bar */}
//                                             <div className="mb-3">
//                                                 <div className="flex justify-between text-sm mb-1">
//                                                     <span className="text-gray-600 dark:text-gray-400">Progress</span>
//                                                     <span className="font-bold text-gray-900 dark:text-white">
//                                                         Day {challenge.currentDay || 1} / {challenge.duration}
//                                                     </span>
//                                                 </div>
//                                                 <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
//                                                     <div
//                                                         className="bg-gradient-to-r from-[#f4873e] to-[#ff9e5e] h-2 rounded-full transition-all"
//                                                         style={{ width: `${((challenge.currentDay || 1) / challenge.duration) * 100}%` }}
//                                                     ></div>
//                                                 </div>
//                                             </div>

//                                             <button className="w-full py-2 bg-gradient-to-r from-[#f4873e] to-[#ff9e5e] text-white rounded-full font-bold hover:shadow-lg">
//                                                 View Details
//                                             </button>
//                                         </div>
//                                     ))}
//                                 </div>
//                             ) : (
//                                 <div className="text-center py-12">
//                                     <Trophy className="w-16 h-16 mx-auto mb-4 text-gray-400" />
//                                     <p className="text-gray-600 dark:text-gray-400 mb-4">You're not participating in any challenges</p>
//                                     <button
//                                         onClick={() => navigate('/community/challenges/browse')}
//                                         className="px-6 py-3 bg-gradient-to-r from-[#f4873e] to-[#ff9e5e] text-white rounded-full font-bold hover:shadow-lg"
//                                     >
//                                         Browse Challenges
//                                     </button>
//                                 </div>
//                             )}
//                         </div>
//                     )}
//                 </div>
//             </div>

//             {/* RIGHT SIDE CARDS - Fixed Position */}
//             <div className="fixed right-6 top-6 w-80 space-y-4 max-h-[calc(100vh-48px)] overflow-y-auto">

//                 {/* Top Navigation (Notification + Menu) */}
//                 <div className="flex items-center justify-end gap-4 mb-4">
//                     <NotificationBell />
//                     <button
//                         onClick={() => navigate('/settings')}
//                         className="w-12 h-12 flex items-center justify-center rounded-full bg-white dark:bg-gray-800 shadow-md hover:shadow-lg border-2 border-gray-200 dark:border-gray-700"
//                     >
//                         <Menu className="w-7 h-7 text-gray-600 dark:text-gray-300" />
//                     </button>
//                 </div>

//                 {/* Card 1: Active Challenge */}
//                 {myChallenges.length > 0 && (
//                     <div className="bg-gradient-to-br from-orange-50 to-white dark:from-orange-900/20 dark:to-gray-800 rounded-[40px] p-6 border-2 border-orange-200 dark:border-orange-800 shadow-lg">
//                         <div className="flex items-center gap-2 mb-4">
//                             <Trophy className="w-6 h-6 text-[#f4873e]" />
//                             <h3 className="font-bold text-gray-900 dark:text-white" style={{ fontFamily: "Brasika" }}>
//                                 Active Challenge
//                             </h3>
//                         </div>

//                         <div className="space-y-3">
//                             <div className="flex items-center gap-3">
//                                 <span className="text-3xl">{myChallenges[0].icon || "🏆"}</span>
//                                 <div className="flex-1">
//                                     <p className="font-bold text-gray-900 dark:text-white">{myChallenges[0].title}</p>
//                                     <p className="text-sm text-gray-600 dark:text-gray-400">
//                                         Day {myChallenges[0].currentDay || 1} of {myChallenges[0].duration}
//                                     </p>
//                                 </div>
//                             </div>

//                             {/* Progress Dots */}
//                             <div className="flex gap-1">
//                                 {[...Array(myChallenges[0].duration)].map((_, i) => (
//                                     <div
//                                         key={i}
//                                         className={`h-2 flex-1 rounded-full ${i < (myChallenges[0].currentDay || 1)
//                                                 ? 'bg-gradient-to-r from-[#f4873e] to-[#ff9e5e]'
//                                                 : 'bg-gray-200 dark:bg-gray-700'
//                                             }`}
//                                     ></div>
//                                 ))}
//                             </div>

//                             <button
//                                 onClick={() => navigate('/community/challenges/browse')}
//                                 className="w-full py-2 bg-gradient-to-r from-[#f4873e] to-[#ff9e5e] text-white rounded-full font-bold hover:shadow-lg text-sm"
//                             >
//                                 View All Challenges
//                             </button>
//                         </div>
//                     </div>
//                 )}

//                 {/* Card 2: My Groups */}
//                 <div className="bg-gradient-to-br from-teal-50 to-white dark:from-teal-900/20 dark:to-gray-800 rounded-[40px] p-6 border-2 border-teal-200 dark:border-teal-800 shadow-lg">
//                     <div className="flex items-center gap-2 mb-4">
//                         <Users className="w-6 h-6 text-[#89beab]" />
//                         <h3 className="font-bold text-gray-900 dark:text-white" style={{ fontFamily: "Brasika" }}>
//                             My Groups
//                         </h3>
//                     </div>

//                     {myGroups.length > 0 ? (
//                         <div className="space-y-3">
//                             {myGroups.slice(0, 3).map(group => (
//                                 <div
//                                     key={group._id}
//                                     className="flex items-center gap-3 p-3 bg-white dark:bg-gray-700 rounded-2xl hover:shadow-md transition-all cursor-pointer"
//                                     onClick={() => navigate(`/community/group/${group._id}`)}
//                                 >
//                                     <span className="text-2xl">{group.icon || "📝"}</span>
//                                     <div className="flex-1">
//                                         <p className="font-semibold text-gray-900 dark:text-white text-sm">{group.name}</p>
//                                         <p className="text-xs text-gray-600 dark:text-gray-400">{group.members?.length || 0} members</p>
//                                     </div>
//                                 </div>
//                             ))}

//                             <button
//                                 onClick={() => navigate('/community/groups/browse')}
//                                 className="w-full py-2 bg-gradient-to-r from-[#89beab] to-[#6fa893] text-white rounded-full font-bold hover:shadow-lg text-sm flex items-center justify-center gap-2"
//                             >
//                                 Explore Groups
//                                 <ArrowRight className="w-4 h-4" />
//                             </button>
//                         </div>
//                     ) : (
//                         <div className="text-center py-4">
//                             <p className="text-gray-600 dark:text-gray-400 text-sm mb-3">No groups yet</p>
//                             <button
//                                 onClick={() => navigate('/community/groups/browse')}
//                                 className="px-4 py-2 bg-gradient-to-r from-[#89beab] to-[#6fa893] text-white rounded-full font-bold hover:shadow-lg text-sm"
//                             >
//                                 Explore Groups
//                             </button>
//                         </div>
//                     )}
//                 </div>

//                 {/* Card 3: Stats & Requests */}
//                 <div className="bg-gradient-to-br from-blue-50 to-white dark:from-blue-900/20 dark:to-gray-800 rounded-[40px] p-6 border-2 border-blue-200 dark:border-blue-800 shadow-lg">
//                     <div className="flex items-center gap-2 mb-4">
//                         <TrendingUp className="w-6 h-6 text-blue-600 dark:text-blue-400" />
//                         <h3 className="font-bold text-gray-900 dark:text-white" style={{ fontFamily: "Brasika" }}>
//                             Quick Stats
//                         </h3>
//                     </div>

//                     {/* Stats */}
//                     <div className="grid grid-cols-3 gap-3 mb-4">
//                         <div className="bg-white dark:bg-gray-700 rounded-2xl p-3 text-center">
//                             <p className="text-2xl font-bold text-[#89beab]">{myGroups.length}</p>
//                             <p className="text-xs text-gray-600 dark:text-gray-400">Groups</p>
//                         </div>
//                         <div className="bg-white dark:bg-gray-700 rounded-2xl p-3 text-center">
//                             <p className="text-2xl font-bold text-[#f4873e]">{myChallenges.length}</p>
//                             <p className="text-xs text-gray-600 dark:text-gray-400">Challenges</p>
//                         </div>
//                         <div className="bg-white dark:bg-gray-700 rounded-2xl p-3 text-center">
//                             <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">{posts.length}</p>
//                             <p className="text-xs text-gray-600 dark:text-gray-400">Posts</p>
//                         </div>
//                     </div>

//                     {/* Pending/Rejected Requests */}
//                     {pendingRequests.length > 0 && (
//                         <div className="space-y-2">
//                             <p className="text-sm font-bold text-gray-700 dark:text-gray-300">Requests</p>

//                             {pendingRequests.map(request => (
//                                 <div
//                                     key={request.groupId}
//                                     className={`p-3 rounded-2xl ${request.status === 'pending'
//                                             ? 'bg-yellow-100 dark:bg-yellow-900/30'
//                                             : 'bg-red-100 dark:bg-red-900/30'
//                                         }`}
//                                 >
//                                     <div className="flex items-start gap-2">
//                                         {request.status === 'pending' ? (
//                                             <Clock className="w-4 h-4 text-yellow-600 dark:text-yellow-400 mt-0.5" />
//                                         ) : (
//                                             <XCircle className="w-4 h-4 text-red-600 dark:text-red-400 mt-0.5" />
//                                         )}
//                                         <div className="flex-1">
//                                             <p className="text-sm font-semibold text-gray-900 dark:text-white">{request.groupName}</p>
//                                             {request.status === 'pending' ? (
//                                                 <p className="text-xs text-gray-600 dark:text-gray-400">Sent {request.requestedAt}</p>
//                                             ) : (
//                                                 <p className="text-xs text-red-600 dark:text-red-400">{request.reason}</p>
//                                             )}
//                                         </div>
//                                     </div>
//                                 </div>
//                             ))}
//                         </div>
//                     )}
//                 </div>
//             </div>

//             {/* Floating Action Button */}
//             <button
//                 className="fixed bottom-6 right-6 w-14 h-14 bg-gradient-to-r from-[#89beab] to-[#6fa893] text-white rounded-full shadow-lg hover:shadow-xl flex items-center justify-center transition-all hover:scale-110"
//                 onClick={() => {/* TODO: Open create post modal */ }}
//             >
//                 <Plus className="w-7 h-7" />
//             </button>
//         </div>
//     );
// };

// export default CommunityPage;
// import React, { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import Sidebar from "../components/Sidebar";
// import NotificationBell from '../components/NotificationBell';
// import { Menu, Plus, Users, Trophy, TrendingUp, Clock, XCircle, ArrowRight, Calendar } from 'lucide-react';
// import { getPosts, getUserGroups, getUserChallenges } from "../services/communityService";

// const CommunityPage = () => {
//     const navigate = useNavigate();
//     const [activeTab, setActiveTab] = useState("feed"); // feed, groups, challenges
//     const [categoryFilter, setCategoryFilter] = useState("all");
//     const [posts, setPosts] = useState([]);
//     const [myGroups, setMyGroups] = useState([]);
//     const [myChallenges, setMyChallenges] = useState([]);
//     const [pendingRequests, setPendingRequests] = useState([]);
//     const [loading, setLoading] = useState(true);

//     useEffect(() => {
//         fetchData();
//     }, [activeTab, categoryFilter]);

//     const fetchData = async () => {
//         setLoading(true);
//         try {
//             // Fetch based on active tab
//             if (activeTab === "feed") {
//                 const data = await getPosts(1, 10, categoryFilter === "all" ? null : categoryFilter);
//                 setPosts(data.posts || []);
//             }

//             // Always fetch user's groups and challenges for right cards
//             const groupsData = await getUserGroups();
//             setMyGroups(groupsData.groups || []);

//             const challengesData = await getUserChallenges();
//             setMyChallenges(challengesData.challenges || []);

//             // TODO: Fetch pending requests (will need new API endpoint)
//             // For now, mock data:
//             setPendingRequests([
//                 // { groupId: "123", groupName: "Mindfulness Group", status: "pending", requestedAt: "2 days ago" },
//                 // { groupId: "456", groupName: "Wellness Circle", status: "rejected", reason: "Group is full. Try again in 2 weeks.", requestedAt: "1 week ago" }
//             ]);

//         } catch (error) {
//             console.error("Error fetching data:", error);
//         } finally {
//             setLoading(false);
//         }
//     };

//     const tabs = [
//         { id: "feed", label: "Community Feed", icon: "📰" },
//         { id: "groups", label: "My Groups", icon: "👥" },
//         { id: "challenges", label: "Challenges", icon: "🏆" }
//     ];

//     const categories = [
//         { id: "all", label: "All", icon: "📋" },
//         { id: "wellbeing", label: "Wellbeing", icon: "💚" },
//         { id: "habits", label: "Habits", icon: "✅" },
//         { id: "journaling", label: "Journaling", icon: "📝" },
//         { id: "gratitude", label: "Gratitude", icon: "🙏" },
//         { id: "mindfulness", label: "Mindfulness", icon: "🧘" },
//         { id: "fitness", label: "Fitness", icon: "💪" },
//         { id: "other", label: "Other", icon: "✨" }
//     ];

//     const getCategoryColor = (category) => {
//         const colors = {
//             wellbeing: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
//             habits: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
//             journaling: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
//             gratitude: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
//             mindfulness: "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400",
//             fitness: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
//             other: "bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400"
//         };
//         return colors[category] || colors.other;
//     };

//     return (
//         <div className="min-h-screen bg-white dark:bg-gray-900 p-6 flex gap-6 relative">
//             {/* LEFT SIDEBAR */}
//             <Sidebar />

//             {/* MAIN CONTENT AREA - Now 65% width */}
//             <div className="flex-1 ml-28 mr-80 border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 rounded-[50px] p-8 shadow-[0_10px_25px_rgba(248,186,144,0.25)] dark:shadow-[0_10px_25px_rgba(0,0,0,0.3)] max-h-[775px] overflow-y-auto">

//                 {/* Header */}
//                 <div className="mb-6">
//                     <h1 className="text-3xl font-bold mb-1" style={{ fontFamily: "Brasika" }}>
//                         <span className="text-[#f4873e] dark:text-orange-400">Community </span>
//                         <span className="text-[#89beab] dark:text-teal-400">Space</span>
//                     </h1>
//                     <p className="text-gray-600 dark:text-gray-400">Connect, share, and grow together</p>
//                 </div>

//                 {/* Tabs */}
//                 <div className="flex gap-6 mb-6 border-b-2 border-gray-200 dark:border-gray-700">
//                     {tabs.map(tab => (
//                         <button
//                             key={tab.id}
//                             onClick={() => setActiveTab(tab.id)}
//                             className={`
//                                 pb-3 px-2 font-semibold transition-all flex items-center gap-2
//                                 ${activeTab === tab.id 
//                                     ? 'text-[#f4873e] border-b-4 border-[#f4873e]' 
//                                     : 'text-gray-600 dark:text-gray-400 hover:text-[#f4873e]'
//                                 }
//                             `}
//                         >
//                             <span className="text-xl">{tab.icon}</span>
//                             {tab.label}
//                         </button>
//                     ))}
//                 </div>

//                 {/* Category Filters (Only show in Feed tab) */}
//                 {activeTab === "feed" && (
//                     <div className="flex gap-3 mb-6 overflow-x-auto pb-2">
//                         {categories.map(category => (
//                             <button
//                                 key={category.id}
//                                 onClick={() => setCategoryFilter(category.id)}
//                                 className={`
//                                     px-4 py-2 rounded-full text-sm font-semibold whitespace-nowrap transition-all flex items-center gap-2
//                                     ${categoryFilter === category.id
//                                         ? 'bg-[#f4873e] text-white shadow-lg'
//                                         : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:shadow-md'
//                                     }
//                                 `}
//                             >
//                                 <span>{category.icon}</span>
//                                 {category.label}
//                             </button>
//                         ))}
//                     </div>
//                 )}

//                 {/* Tab Content */}
//                 <div>
//                     {/* FEED TAB */}
//                     {activeTab === "feed" && (
//                         <div>
//                             {loading ? (
//                                 <div className="flex justify-center items-center py-12">
//                                     <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#f4873e]"></div>
//                                 </div>
//                             ) : posts.length === 0 ? (
//                                 <div className="text-center py-12">
//                                     <p className="text-gray-600 dark:text-gray-400">No posts yet. Be the first to share!</p>
//                                     <button className="mt-4 px-6 py-3 bg-gradient-to-r from-[#f4873e] to-[#ff9e5e] text-white rounded-full font-bold hover:shadow-lg">
//                                         Create Post
//                                     </button>
//                                 </div>
//                             ) : (
//                                 <div className="space-y-4">
//                                     {posts.map(post => (
//                                         <div key={post._id} className="bg-gradient-to-br from-gray-50 to-white dark:from-gray-700 dark:to-gray-800 rounded-3xl p-6 border-2 border-gray-200 dark:border-gray-600 hover:border-[#f4873e] transition-all">
//                                             {/* Post Header */}
//                                             <div className="flex items-center gap-3 mb-3">
//                                                 <div className="w-10 h-10 bg-gradient-to-br from-[#f4873e] to-[#ff9e5e] rounded-full flex items-center justify-center text-white font-bold">
//                                                     {post.userId?.firstName?.[0]}{post.userId?.lastName?.[0]}
//                                                 </div>
//                                                 <div className="flex-1">
//                                                     <p className="font-bold text-gray-900 dark:text-white">
//                                                         {post.userId?.firstName} {post.userId?.lastName}
//                                                     </p>
//                                                     <p className="text-sm text-gray-500 dark:text-gray-400">
//                                                         {new Date(post.createdAt).toLocaleDateString()}
//                                                     </p>
//                                                 </div>
//                                                 <span className={`px-3 py-1 rounded-full text-xs font-bold ${getCategoryColor(post.category)}`}>
//                                                     {post.category}
//                                                 </span>
//                                             </div>

//                                             {/* Post Content */}
//                                             <p className="text-gray-700 dark:text-gray-300 mb-4">{post.content}</p>

//                                             {/* Reactions */}
//                                             <div className="flex items-center gap-4 text-gray-600 dark:text-gray-400">
//                                                 <button className="hover:text-[#f4873e] transition-colors">👍 {post.reactions?.length || 0}</button>
//                                                 <button className="hover:text-[#f4873e] transition-colors">❤️</button>
//                                                 <button className="hover:text-[#f4873e] transition-colors">🎉</button>
//                                                 <button className="hover:text-[#f4873e] transition-colors">💪</button>
//                                                 <button className="hover:text-[#f4873e] transition-colors">🙏</button>
//                                                 <button className="hover:text-[#f4873e] transition-colors ml-auto">💬 {post.comments?.length || 0}</button>
//                                             </div>
//                                         </div>
//                                     ))}
//                                 </div>
//                             )}
//                         </div>
//                     )}

//                     {/* MY GROUPS TAB */}
//                     {activeTab === "groups" && (
//                         <div>
//                             <div className="flex justify-between items-center mb-6">
//                                 <h2 className="text-xl font-bold text-gray-900 dark:text-white">My Groups</h2>
//                                 <button 
//                                     onClick={() => navigate('/community/groups/browse')}
//                                     className="px-6 py-2 bg-gradient-to-r from-[#89beab] to-[#6fa893] text-white rounded-full font-bold hover:shadow-lg flex items-center gap-2"
//                                 >
//                                     Explore Groups
//                                     <ArrowRight className="w-4 h-4" />
//                                 </button>
//                             </div>

//                             {/* Joined Groups */}
//                             {myGroups.length > 0 && (
//                                 <div className="mb-8">
//                                     <h3 className="text-lg font-bold text-gray-700 dark:text-gray-300 mb-4">✓ Joined Groups</h3>
//                                     <div className="grid grid-cols-1 gap-4">
//                                         {myGroups.map(group => (
//                                             <div key={group._id} className="bg-gradient-to-br from-teal-50 to-white dark:from-teal-900/20 dark:to-gray-800 rounded-2xl p-5 border-2 border-teal-200 dark:border-teal-800 hover:shadow-lg transition-all cursor-pointer"
//                                                 onClick={() => navigate(`/community/group/${group._id}`)}>
//                                                 <div className="flex items-center gap-3">
//                                                     <span className="text-3xl">{group.icon || "📝"}</span>
//                                                     <div className="flex-1">
//                                                         <h4 className="font-bold text-gray-900 dark:text-white">{group.name}</h4>
//                                                         <p className="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-2">
//                                                             <Users className="w-4 h-4" />
//                                                             {group.members?.length || 0} members
//                                                         </p>
//                                                     </div>
//                                                 </div>
//                                             </div>
//                                         ))}
//                                     </div>
//                                 </div>
//                             )}

//                             {/* Pending Requests */}
//                             {pendingRequests.filter(r => r.status === 'pending').length > 0 && (
//                                 <div className="mb-8">
//                                     <h3 className="text-lg font-bold text-gray-700 dark:text-gray-300 mb-4">⏳ Pending Requests</h3>
//                                     <div className="space-y-3">
//                                         {pendingRequests.filter(r => r.status === 'pending').map(request => (
//                                             <div key={request.groupId} className="bg-yellow-50 dark:bg-yellow-900/20 rounded-2xl p-4 border-2 border-yellow-200 dark:border-yellow-800">
//                                                 <div className="flex items-center gap-3">
//                                                     <Clock className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
//                                                     <div className="flex-1">
//                                                         <p className="font-bold text-gray-900 dark:text-white">{request.groupName}</p>
//                                                         <p className="text-sm text-gray-600 dark:text-gray-400">Waiting for approval • Sent {request.requestedAt}</p>
//                                                     </div>
//                                                 </div>
//                                             </div>
//                                         ))}
//                                     </div>
//                                 </div>
//                             )}

//                             {/* Rejected Requests */}
//                             {pendingRequests.filter(r => r.status === 'rejected').length > 0 && (
//                                 <div className="mb-8">
//                                     <h3 className="text-lg font-bold text-gray-700 dark:text-gray-300 mb-4">❌ Rejected Requests</h3>
//                                     <div className="space-y-3">
//                                         {pendingRequests.filter(r => r.status === 'rejected').map(request => (
//                                             <div key={request.groupId} className="bg-red-50 dark:bg-red-900/20 rounded-2xl p-4 border-2 border-red-200 dark:border-red-800">
//                                                 <div className="flex items-start gap-3">
//                                                     <XCircle className="w-5 h-5 text-red-600 dark:text-red-400 mt-1" />
//                                                     <div className="flex-1">
//                                                         <p className="font-bold text-gray-900 dark:text-white">{request.groupName}</p>
//                                                         <p className="text-sm text-red-600 dark:text-red-400 mt-1">
//                                                             <strong>Reason:</strong> {request.reason}
//                                                         </p>
//                                                         <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Rejected {request.requestedAt}</p>
//                                                     </div>
//                                                     <button className="px-4 py-2 bg-gradient-to-r from-[#89beab] to-[#6fa893] text-white rounded-full text-sm font-bold hover:shadow-lg">
//                                                         Try Again
//                                                     </button>
//                                                 </div>
//                                             </div>
//                                         ))}
//                                     </div>
//                                 </div>
//                             )}

//                             {/* Empty State */}
//                             {myGroups.length === 0 && pendingRequests.length === 0 && (
//                                 <div className="text-center py-12">
//                                     <Users className="w-16 h-16 mx-auto mb-4 text-gray-400" />
//                                     <p className="text-gray-600 dark:text-gray-400 mb-4">You haven't joined any groups yet</p>
//                                     <button 
//                                         onClick={() => navigate('/community/groups/browse')}
//                                         className="px-6 py-3 bg-gradient-to-r from-[#89beab] to-[#6fa893] text-white rounded-full font-bold hover:shadow-lg"
//                                     >
//                                         Explore Groups
//                                     </button>
//                                 </div>
//                             )}
//                         </div>
//                     )}

//                     {/* CHALLENGES TAB */}
//                     {activeTab === "challenges" && (
//                         <div>
//                             <div className="flex justify-between items-center mb-6">
//                                 <h2 className="text-xl font-bold text-gray-900 dark:text-white">My Challenges</h2>
//                                 <button 
//                                     onClick={() => navigate('/community/challenges/browse')}
//                                     className="px-6 py-2 bg-gradient-to-r from-[#f4873e] to-[#ff9e5e] text-white rounded-full font-bold hover:shadow-lg flex items-center gap-2"
//                                 >
//                                     Explore Challenges
//                                     <ArrowRight className="w-4 h-4" />
//                                 </button>
//                             </div>

//                             {myChallenges.length > 0 ? (
//                                 <div className="grid grid-cols-1 gap-4">
//                                     {myChallenges.map(challenge => (
//                                         <div key={challenge._id} className="bg-gradient-to-br from-orange-50 to-white dark:from-orange-900/20 dark:to-gray-800 rounded-2xl p-5 border-2 border-orange-200 dark:border-orange-800 hover:shadow-lg transition-all">
//                                             <div className="flex items-start justify-between mb-3">
//                                                 <div className="flex items-center gap-3">
//                                                     <span className="text-3xl">{challenge.icon || "🏆"}</span>
//                                                     <div>
//                                                         <h4 className="font-bold text-gray-900 dark:text-white">{challenge.title}</h4>
//                                                         <p className="text-sm text-gray-600 dark:text-gray-400">{challenge.duration} days</p>
//                                                     </div>
//                                                 </div>
//                                                 <span className="px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-full text-xs font-bold">
//                                                     Active
//                                                 </span>
//                                             </div>

//                                             {/* Progress Bar */}
//                                             <div className="mb-3">
//                                                 <div className="flex justify-between text-sm mb-1">
//                                                     <span className="text-gray-600 dark:text-gray-400">Progress</span>
//                                                     <span className="font-bold text-gray-900 dark:text-white">
//                                                         Day {challenge.currentDay || 1} / {challenge.duration}
//                                                     </span>
//                                                 </div>
//                                                 <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
//                                                     <div 
//                                                         className="bg-gradient-to-r from-[#f4873e] to-[#ff9e5e] h-2 rounded-full transition-all"
//                                                         style={{ width: `${((challenge.currentDay || 1) / challenge.duration) * 100}%` }}
//                                                     ></div>
//                                                 </div>
//                                             </div>

//                                             <button className="w-full py-2 bg-gradient-to-r from-[#f4873e] to-[#ff9e5e] text-white rounded-full font-bold hover:shadow-lg">
//                                                 View Details
//                                             </button>
//                                         </div>
//                                     ))}
//                                 </div>
//                             ) : (
//                                 <div className="text-center py-12">
//                                     <Trophy className="w-16 h-16 mx-auto mb-4 text-gray-400" />
//                                     <p className="text-gray-600 dark:text-gray-400 mb-4">You're not participating in any challenges</p>
//                                     <button 
//                                         onClick={() => navigate('/community/challenges/browse')}
//                                         className="px-6 py-3 bg-gradient-to-r from-[#f4873e] to-[#ff9e5e] text-white rounded-full font-bold hover:shadow-lg"
//                                     >
//                                         Browse Challenges
//                                     </button>
//                                 </div>
//                             )}
//                         </div>
//                     )}
//                 </div>
//             </div>

//             {/* RIGHT SIDE CARDS - Fixed Position */}
//             <div className="fixed right-6 top-6 w-80 space-y-4 max-h-[calc(100vh-48px)] overflow-y-auto">

//                 {/* Top Navigation (Notification + Menu) */}
//                 <div className="flex items-center justify-end gap-4 mb-4">
//                     <NotificationBell />
//                     <button 
//                         onClick={() => navigate('/settings')}
//                         className="w-12 h-12 flex items-center justify-center rounded-full bg-white dark:bg-gray-800 shadow-md hover:shadow-lg border-2 border-gray-200 dark:border-gray-700"
//                     >
//                         <Menu className="w-7 h-7 text-gray-600 dark:text-gray-300" />
//                     </button>
//                 </div>

//                 {/* Card 1: Active Challenge */}
//                 {myChallenges.length > 0 && (
//                     <div className="bg-gradient-to-br from-orange-50 to-white dark:from-orange-900/20 dark:to-gray-800 rounded-[40px] p-6 border-2 border-orange-200 dark:border-orange-800 shadow-lg">
//                         <div className="flex items-center gap-2 mb-4">
//                             <Trophy className="w-6 h-6 text-[#f4873e]" />
//                             <h3 className="font-bold text-gray-900 dark:text-white" style={{ fontFamily: "Brasika" }}>
//                                 Active Challenge
//                             </h3>
//                         </div>

//                         <div className="space-y-3">
//                             <div className="flex items-center gap-3">
//                                 <span className="text-3xl">{myChallenges[0].icon || "🏆"}</span>
//                                 <div className="flex-1">
//                                     <p className="font-bold text-gray-900 dark:text-white">{myChallenges[0].title}</p>
//                                     <p className="text-sm text-gray-600 dark:text-gray-400">
//                                         Day {myChallenges[0].currentDay || 1} of {myChallenges[0].duration}
//                                     </p>
//                                 </div>
//                             </div>

//                             {/* Progress Dots */}
//                             <div className="flex gap-1">
//                                 {[...Array(myChallenges[0].duration)].map((_, i) => (
//                                     <div 
//                                         key={i}
//                                         className={`h-2 flex-1 rounded-full ${
//                                             i < (myChallenges[0].currentDay || 1) 
//                                                 ? 'bg-gradient-to-r from-[#f4873e] to-[#ff9e5e]' 
//                                                 : 'bg-gray-200 dark:bg-gray-700'
//                                         }`}
//                                     ></div>
//                                 ))}
//                             </div>

//                             <button 
//                                 onClick={() => navigate('/community/challenges/browse')}
//                                 className="w-full py-2 bg-gradient-to-r from-[#f4873e] to-[#ff9e5e] text-white rounded-full font-bold hover:shadow-lg text-sm"
//                             >
//                                 View All Challenges
//                             </button>
//                         </div>
//                     </div>
//                 )}

//                 {/* Card 2: My Groups */}
//                 <div className="bg-gradient-to-br from-teal-50 to-white dark:from-teal-900/20 dark:to-gray-800 rounded-[40px] p-6 border-2 border-teal-200 dark:border-teal-800 shadow-lg">
//                     <div className="flex items-center gap-2 mb-4">
//                         <Users className="w-6 h-6 text-[#89beab]" />
//                         <h3 className="font-bold text-gray-900 dark:text-white" style={{ fontFamily: "Brasika" }}>
//                             My Groups
//                         </h3>
//                     </div>

//                     {myGroups.length > 0 ? (
//                         <div className="space-y-3">
//                             {myGroups.slice(0, 3).map(group => (
//                                 <div 
//                                     key={group._id}
//                                     className="flex items-center gap-3 p-3 bg-white dark:bg-gray-700 rounded-2xl hover:shadow-md transition-all cursor-pointer"
//                                     onClick={() => navigate(`/community/group/${group._id}`)}
//                                 >
//                                     <span className="text-2xl">{group.icon || "📝"}</span>
//                                     <div className="flex-1">
//                                         <p className="font-semibold text-gray-900 dark:text-white text-sm">{group.name}</p>
//                                         <p className="text-xs text-gray-600 dark:text-gray-400">{group.members?.length || 0} members</p>
//                                     </div>
//                                 </div>
//                             ))}

//                             <button 
//                                 onClick={() => navigate('/community/groups/browse')}
//                                 className="w-full py-2 bg-gradient-to-r from-[#89beab] to-[#6fa893] text-white rounded-full font-bold hover:shadow-lg text-sm flex items-center justify-center gap-2"
//                             >
//                                 Explore Groups
//                                 <ArrowRight className="w-4 h-4" />
//                             </button>
//                         </div>
//                     ) : (
//                         <div className="text-center py-4">
//                             <p className="text-gray-600 dark:text-gray-400 text-sm mb-3">No groups yet</p>
//                             <button 
//                                 onClick={() => navigate('/community/groups/browse')}
//                                 className="px-4 py-2 bg-gradient-to-r from-[#89beab] to-[#6fa893] text-white rounded-full font-bold hover:shadow-lg text-sm"
//                             >
//                                 Explore Groups
//                             </button>
//                         </div>
//                     )}
//                 </div>

//                 {/* Card 3: Stats & Requests */}
//                 <div className="bg-gradient-to-br from-blue-50 to-white dark:from-blue-900/20 dark:to-gray-800 rounded-[40px] p-6 border-2 border-blue-200 dark:border-blue-800 shadow-lg">
//                     <div className="flex items-center gap-2 mb-4">
//                         <TrendingUp className="w-6 h-6 text-blue-600 dark:text-blue-400" />
//                         <h3 className="font-bold text-gray-900 dark:text-white" style={{ fontFamily: "Brasika" }}>
//                             Quick Stats
//                         </h3>
//                     </div>

//                     {/* Stats */}
//                     <div className="grid grid-cols-3 gap-3 mb-4">
//                         <div className="bg-white dark:bg-gray-700 rounded-2xl p-3 text-center">
//                             <p className="text-2xl font-bold text-[#89beab]">{myGroups.length}</p>
//                             <p className="text-xs text-gray-600 dark:text-gray-400">Groups</p>
//                         </div>
//                         <div className="bg-white dark:bg-gray-700 rounded-2xl p-3 text-center">
//                             <p className="text-2xl font-bold text-[#f4873e]">{myChallenges.length}</p>
//                             <p className="text-xs text-gray-600 dark:text-gray-400">Challenges</p>
//                         </div>
//                         <div className="bg-white dark:bg-gray-700 rounded-2xl p-3 text-center">
//                             <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">{posts.length}</p>
//                             <p className="text-xs text-gray-600 dark:text-gray-400">Posts</p>
//                         </div>
//                     </div>

//                     {/* Pending/Rejected Requests */}
//                     {pendingRequests.length > 0 && (
//                         <div className="space-y-2">
//                             <p className="text-sm font-bold text-gray-700 dark:text-gray-300">Requests</p>

//                             {pendingRequests.map(request => (
//                                 <div 
//                                     key={request.groupId}
//                                     className={`p-3 rounded-2xl ${
//                                         request.status === 'pending' 
//                                             ? 'bg-yellow-100 dark:bg-yellow-900/30' 
//                                             : 'bg-red-100 dark:bg-red-900/30'
//                                     }`}
//                                 >
//                                     <div className="flex items-start gap-2">
//                                         {request.status === 'pending' ? (
//                                             <Clock className="w-4 h-4 text-yellow-600 dark:text-yellow-400 mt-0.5" />
//                                         ) : (
//                                             <XCircle className="w-4 h-4 text-red-600 dark:text-red-400 mt-0.5" />
//                                         )}
//                                         <div className="flex-1">
//                                             <p className="text-sm font-semibold text-gray-900 dark:text-white">{request.groupName}</p>
//                                             {request.status === 'pending' ? (
//                                                 <p className="text-xs text-gray-600 dark:text-gray-400">Sent {request.requestedAt}</p>
//                                             ) : (
//                                                 <p className="text-xs text-red-600 dark:text-red-400">{request.reason}</p>
//                                             )}
//                                         </div>
//                                     </div>
//                                 </div>
//                             ))}
//                         </div>
//                     )}
//                 </div>
//             </div>

//             {/* Floating Action Button */}
//             <button 
//                 className="fixed bottom-6 right-6 w-14 h-14 bg-gradient-to-r from-[#89beab] to-[#6fa893] text-white rounded-full shadow-lg hover:shadow-xl flex items-center justify-center transition-all hover:scale-110"
//                 onClick={() => {/* TODO: Open create post modal */}}
//             >
//                 <Plus className="w-7 h-7" />
//             </button>
//         </div>
//     );
// };

// export default CommunityPage;

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import Sidebar from "../components/Sidebar";
import RightSidebarCards from "../components/RightSidebarCards";
import { Plus, Users, Trophy, XCircle, ArrowRight, Calendar } from 'lucide-react';
import { getPosts, getUserGroups, getUserChallenges } from "../services/communityService";
import CreatePostModal from "../components/CreatePostModal";

const CommunityPage = () => {
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const [activeTab, setActiveTab] = useState("feed"); // feed, groups, challenges
    const [categoryFilter, setCategoryFilter] = useState("all");
    const [pendingRequests, setPendingRequests] = useState([]);
    const [showCreatePostModal, setShowCreatePostModal] = useState(false);

    const { data: postsData, isLoading: loadingPosts } = useQuery({
        queryKey: ["community", "posts", categoryFilter],
        queryFn: () => getPosts(1, 10, categoryFilter === "all" ? null : categoryFilter),
        enabled: activeTab === "feed",
        refetchInterval: 5000,
    });

    const { data: groupsData } = useQuery({
        queryKey: ["community", "userGroups"],
        queryFn: getUserGroups,
        refetchInterval: 5000,
    });

    const { data: challengesData } = useQuery({
        queryKey: ["community", "userChallenges"],
        queryFn: getUserChallenges,
        refetchInterval: 5000,
    });

    const posts = postsData?.posts ?? [];
    const myGroups = groupsData?.groups ?? [];
    const myChallenges = challengesData?.challenges ?? [];
    const loading = activeTab === "feed" ? loadingPosts : false;

    const tabs = [
        { id: "feed", label: "Community Feed", icon: "📰" },
        { id: "groups", label: "My Groups", icon: "👥" },
        { id: "challenges", label: "Challenges", icon: "🏆" }
    ];

    const categories = [
        { id: "all", label: "All", icon: "📋" },
        { id: "wellbeing", label: "Wellbeing", icon: "💚" },
        { id: "habits", label: "Habits", icon: "✅" },
        { id: "journaling", label: "Journaling", icon: "📝" },
        { id: "gratitude", label: "Gratitude", icon: "🙏" },
        { id: "mindfulness", label: "Mindfulness", icon: "🧘" },
        { id: "fitness", label: "Fitness", icon: "💪" },
        { id: "other", label: "Other", icon: "✨" }
    ];

    const getCategoryColor = (category) => {
        const colors = {
            wellbeing: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
            habits: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
            journaling: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
            gratitude: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
            mindfulness: "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400",
            fitness: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
            other: "bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400"
        };
        return colors[category] || colors.other;
    };

    return (
        <div className="min-h-screen bg-white dark:bg-gray-900 p-6 flex gap-6">
            {/* LEFT SIDEBAR */}
            <Sidebar />

            {/* MAIN CONTENT AREA - Matches dashboard width */}
            <div className="flex-1 ml-28 border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 rounded-[50px] p-8 shadow-[0_10px_25px_rgba(248,186,144,0.25)] dark:shadow-[0_10px_25px_rgba(0,0,0,0.3)] max-h-[775px] overflow-y-auto">

                {/* Header */}
                <div className="mb-6 text-left">
                    <h1 className="text-3xl font-bold mb-1" style={{ fontFamily: "Brasika" }}>
                        <span className="text-[#f4873e] dark:text-orange-400">Community </span>
                        <span className="text-[#89beab] dark:text-teal-400">Space</span>
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400">Connect, share, and grow together</p>
                </div>

                {/* Tabs */}
                <div className="flex gap-6 mb-6 border-b-2 border-gray-200 dark:border-gray-700">
                    {tabs.map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`
                                pb-3 px-2 font-semibold transition-all flex items-center gap-2
                                ${activeTab === tab.id
                                    ? 'text-[#f4873e] border-b-4 border-[#f4873e]'
                                    : 'text-gray-600 dark:text-gray-400 hover:text-[#f4873e]'
                                }
                            `}
                        >
                            <span className="text-xl">{tab.icon}</span>
                            {tab.label}
                        </button>
                    ))}
                </div>

                {/* Category Filters (Only show in Feed tab) */}
                {activeTab === "feed" && (
                    <div className="flex gap-3 mb-6 overflow-x-auto pb-2">
                        {categories.map(category => (
                            <button
                                key={category.id}
                                onClick={() => setCategoryFilter(category.id)}
                                className={`
                                    px-4 py-2 rounded-full text-sm font-semibold whitespace-nowrap transition-all flex items-center gap-2
                                    ${categoryFilter === category.id
                                        ? 'bg-[#f4873e] text-white shadow-lg'
                                        : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:shadow-md'
                                    }
                                `}
                            >
                                <span>{category.icon}</span>
                                {category.label}
                            </button>
                        ))}
                    </div>
                )}

                {/* Tab Content */}
                <div>
                    {/* FEED TAB */}
                    {activeTab === "feed" && (
                        <div>
                            {loading ? (
                                <div className="flex justify-center items-center py-12">
                                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#f4873e]"></div>
                                </div>
                            ) : posts.length === 0 ? (
                                <div className="text-center py-12">
                                    <p className="text-gray-600 dark:text-gray-400">No posts yet. Be the first to share!</p>
                                    <button className="mt-4 px-6 py-3 bg-gradient-to-r from-[#f4873e] to-[#ff9e5e] text-white rounded-full font-bold hover:shadow-lg">
                                        Create Post
                                    </button>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {posts.map(post => (
                                        <div key={post._id} className="bg-gradient-to-br from-gray-50 to-white dark:from-gray-700 dark:to-gray-800 rounded-3xl p-6 border-2 border-gray-200 dark:border-gray-600 hover:border-[#f4873e] transition-all">
                                            {/* Post Header */}
                                            <div className="flex items-center gap-3 mb-3">
                                                <div className="w-10 h-10 bg-gradient-to-br from-[#f4873e] to-[#ff9e5e] rounded-full flex items-center justify-center text-white font-bold">
                                                    {post.userId?.firstName?.[0]}{post.userId?.lastName?.[0]}
                                                </div>
                                                <div className="flex-1">
                                                    <p className="font-bold text-gray-900 dark:text-white">
                                                        {post.userId?.firstName} {post.userId?.lastName}
                                                    </p>
                                                    <p className="text-sm text-gray-500 dark:text-gray-400">
                                                        {new Date(post.createdAt).toLocaleDateString()}
                                                    </p>
                                                </div>
                                                <span className={`px-3 py-1 rounded-full text-xs font-bold ${getCategoryColor(post.category)}`}>
                                                    {post.category}
                                                </span>
                                            </div>

                                            {/* Post Content */}
                                            <p className="text-gray-700 dark:text-gray-300 mb-4">{post.content}</p>

                                            {/* Reactions */}
                                            <div className="flex items-center gap-4 text-gray-600 dark:text-gray-400">
                                                <button className="hover:text-[#f4873e] transition-colors">👍 {post.reactions?.length || 0}</button>
                                                <button className="hover:text-[#f4873e] transition-colors">❤️</button>
                                                <button className="hover:text-[#f4873e] transition-colors">🎉</button>
                                                <button className="hover:text-[#f4873e] transition-colors">💪</button>
                                                <button className="hover:text-[#f4873e] transition-colors">🙏</button>
                                                <button className="hover:text-[#f4873e] transition-colors ml-auto">💬 {post.comments?.length || 0}</button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}

                    {/* MY GROUPS TAB */}
                    {activeTab === "groups" && (
                        <div>
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-xl font-bold text-gray-900 dark:text-white">My Groups</h2>
                                <button
                                    onClick={() => navigate('/community/groups/browse')}
                                    className="px-6 py-2 bg-gradient-to-r from-[#89beab] to-[#6fa893] text-white rounded-full font-bold hover:shadow-lg flex items-center gap-2"
                                >
                                    Explore Groups
                                    <ArrowRight className="w-4 h-4" />
                                </button>
                            </div>

                            {/* Joined Groups */}
                            {myGroups.length > 0 && (
                                <div className="mb-8">
                                    <h3 className="text-lg font-bold text-gray-700 dark:text-gray-300 mb-4">✓ Joined Groups</h3>
                                    <div className="grid grid-cols-1 gap-4">
                                        {myGroups.map(group => (
                                            <div key={group._id} className="bg-gradient-to-br from-teal-50 to-white dark:from-teal-900/20 dark:to-gray-800 rounded-2xl p-5 border-2 border-teal-200 dark:border-teal-800 hover:shadow-lg transition-all cursor-pointer"
                                                onClick={() => navigate(`/community/group/${group._id}`)}>
                                                <div className="flex items-center gap-3">
                                                    <span className="text-3xl">{group.icon || "📝"}</span>
                                                    <div className="flex-1">
                                                        <h4 className="font-bold text-gray-900 dark:text-white">{group.name}</h4>
                                                        <p className="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-2">
                                                            <Users className="w-4 h-4" />
                                                            {group.members?.length || 0} members
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Empty State */}
                            {myGroups.length === 0 && pendingRequests.length === 0 && (
                                <div className="text-center py-12">
                                    <Users className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                                    <p className="text-gray-600 dark:text-gray-400 mb-4">You haven't joined any groups yet</p>
                                    <button
                                        onClick={() => navigate('/community/groups/browse')}
                                        className="px-6 py-3 bg-gradient-to-r from-[#89beab] to-[#6fa893] text-white rounded-full font-bold hover:shadow-lg"
                                    >
                                        Explore Groups
                                    </button>
                                </div>
                            )}
                        </div>
                    )}

                    {/* CHALLENGES TAB */}
                    {activeTab === "challenges" && (
                        <div>
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-xl font-bold text-gray-900 dark:text-white">My Challenges</h2>
                                <button
                                    onClick={() => navigate('/community/challenges/browse')}
                                    className="px-6 py-2 bg-gradient-to-r from-[#f4873e] to-[#ff9e5e] text-white rounded-full font-bold hover:shadow-lg flex items-center gap-2"
                                >
                                    Explore Challenges
                                    <ArrowRight className="w-4 h-4" />
                                </button>
                            </div>

                            {myChallenges.length > 0 ? (
                                <div className="grid grid-cols-1 gap-4">
                                    {myChallenges.map(challenge => (
                                        <div key={challenge._id} className="bg-gradient-to-br from-orange-50 to-white dark:from-orange-900/20 dark:to-gray-800 rounded-2xl p-5 border-2 border-orange-200 dark:border-orange-800 hover:shadow-lg transition-all">
                                            <div className="flex items-start justify-between mb-3">
                                                <div className="flex items-center gap-3">
                                                    <span className="text-3xl">{challenge.icon || "🏆"}</span>
                                                    <div>
                                                        <h4 className="font-bold text-gray-900 dark:text-white">{challenge.title}</h4>
                                                        <p className="text-sm text-gray-600 dark:text-gray-400">{challenge.duration} days</p>
                                                    </div>
                                                </div>
                                                <span className="px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-full text-xs font-bold">
                                                    Active
                                                </span>
                                            </div>

                                            {/* Progress Bar */}
                                            <div className="mb-3">
                                                <div className="flex justify-between text-sm mb-1">
                                                    <span className="text-gray-600 dark:text-gray-400">Progress</span>
                                                    <span className="font-bold text-gray-900 dark:text-white">
                                                        Day {challenge.currentDay || 1} / {challenge.duration}
                                                    </span>
                                                </div>
                                                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                                                    <div
                                                        className="bg-gradient-to-r from-[#f4873e] to-[#ff9e5e] h-2 rounded-full transition-all"
                                                        style={{ width: `${((challenge.currentDay || 1) / challenge.duration) * 100}%` }}
                                                    ></div>
                                                </div>
                                            </div>

                                            <button className="w-full py-2 bg-gradient-to-r from-[#f4873e] to-[#ff9e5e] text-white rounded-full font-bold hover:shadow-lg">
                                                View Details
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-12">
                                    <Trophy className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                                    <p className="text-gray-600 dark:text-gray-400 mb-4">You're not participating in any challenges</p>
                                    <button
                                        onClick={() => navigate('/community/challenges/browse')}
                                        className="px-6 py-3 bg-gradient-to-r from-[#f4873e] to-[#ff9e5e] text-white rounded-full font-bold hover:shadow-lg"
                                    >
                                        Browse Challenges
                                    </button>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>

            {/* RIGHT SIDEBAR CARDS - Reusable Component */}
            <RightSidebarCards
                myGroups={myGroups}
                myChallenges={myChallenges}
                posts={posts}
                challenges={[]}
                pendingRequests={pendingRequests}
            />

            {/* Floating Action Button */}
            <button
                className="fixed bottom-6 right-6 w-14 h-14 bg-gradient-to-r from-[#89beab] to-[#6fa893] text-white rounded-full shadow-lg hover:shadow-xl flex items-center justify-center transition-all hover:scale-110"
                onClick={() => { setShowCreatePostModal(true) }}
            >
                <Plus className="w-7 h-7" />
            </button>
            {/* CREATE POST MODAL - ADD THIS */}
            {showCreatePostModal && (
                <CreatePostModal
                    onClose={() => setShowCreatePostModal(false)}
                    onPostCreated={() => {
                        setShowCreatePostModal(false);
                        queryClient.invalidateQueries({ queryKey: ["community"] });
                    }}
                />
            )}
        </div>
    );
};

export default CommunityPage;