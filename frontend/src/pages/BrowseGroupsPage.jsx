// import React, { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import Sidebar from "../components/Sidebar";
// import NotificationBell from '../components/NotificationBell';
// import { Menu, ArrowLeft, Users, Calendar, Clock } from 'lucide-react';
// import { getAllGroups, requestToJoinGroup } from "../services/communityService";

// const BrowseGroupsPage = () => {
//     const navigate = useNavigate();
//     const [groups, setGroups] = useState([]);
//     const [loading, setLoading] = useState(true);
//     const [categoryFilter, setCategoryFilter] = useState("all");
//     const [requesting, setRequesting] = useState(null);

//     useEffect(() => {
//         fetchGroups();
//     }, [categoryFilter]);

//     const fetchGroups = async () => {
//         setLoading(true);
//         try {
//             const data = await getAllGroups(categoryFilter);
//             setGroups(data.groups || []);
//         } catch (error) {
//             console.error("Error fetching groups:", error);
//             alert("Failed to load groups");
//         } finally {
//             setLoading(false);
//         }
//     };

//     const handleRequestToJoin = async (groupId, groupName) => {
//         const message = prompt(
//             `Request to join "${groupName}"?\n\n(Optional) Tell the moderators why you'd like to join:`
//         );

//         if (message === null) return; // User cancelled

//         setRequesting(groupId);
//         try {
//             await requestToJoinGroup(groupId, message);
//             alert(`✓ Join request submitted for "${groupName}"!\n\nA moderator will review your request soon.`);
//             fetchGroups(); // Refresh to update button states
//         } catch (error) {
//             alert(error.message || "Failed to submit join request");
//         } finally {
//             setRequesting(null);
//         }
//     };

//     const categoryColors = {
//         journaling: "from-purple-500 to-purple-600",
//         gratitude: "from-yellow-500 to-yellow-600",
//         mindfulness: "from-indigo-500 to-indigo-600",
//         fitness: "from-red-500 to-red-600",
//         habits: "from-blue-500 to-blue-600",
//         goals: "from-green-500 to-green-600",
//         wellness: "from-pink-500 to-pink-600",
//         other: "from-gray-500 to-gray-600"
//     };

//     return (
//         <div className="min-h-screen bg-white dark:bg-gray-900 p-6 flex gap-6 relative">
//             {/* LEFT SIDEBAR */}
//             <Sidebar />

//             {/* MAIN CENTER PANEL */}
//             <div className="flex-1 ml-28 border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 rounded-[50px] p-8 shadow-[0_10px_25px_rgba(248,186,144,0.25)] dark:shadow-[0_10px_25px_rgba(0,0,0,0.3)] relative max-h-[775px] overflow-y-auto">

//                 {/* Back Button */}
//                 <button
//                     onClick={() => navigate('/community')}
//                     className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-[#f4873e] mb-6 transition-colors"
//                 >
//                     <ArrowLeft className="w-5 h-5" />
//                     <span className="font-semibold">Back to Community</span>
//                 </button>

//                 {/* Header */}
//                 <div className="mb-6">
//                     <h1 className="text-3xl font-bold mb-2" style={{ fontFamily: "Brasika" }}>
//                         <span className="text-[#89beab] dark:text-teal-400">Browse </span>
//                         <span className="text-[#f4873e] dark:text-orange-400">Groups</span>
//                     </h1>
//                     <p className="text-gray-600 dark:text-gray-400">
//                         Find a supportive community to join your wellness journey!
//                     </p>
//                 </div>

//                 {/* Category Filter */}
//                 <div className="mb-6">
//                     <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
//                         Category
//                     </label>
//                     <div className="flex gap-3 flex-wrap">
//                         {["all", "journaling", "gratitude", "mindfulness", "fitness", "habits", "goals", "wellness", "other"].map(category => (
//                             <button
//                                 key={category}
//                                 onClick={() => setCategoryFilter(category)}
//                                 className={`
//                                     px-4 py-2 rounded-full text-sm font-semibold transition-all
//                                     ${categoryFilter === category
//                                         ? 'bg-gradient-to-r from-[#89beab] to-[#6fa893] text-white shadow-lg'
//                                         : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:shadow-md'
//                                     }
//                                 `}
//                             >
//                                 {category.charAt(0).toUpperCase() + category.slice(1)}
//                             </button>
//                         ))}
//                     </div>
//                 </div>

//                 {/* Loading State */}
//                 {loading ? (
//                     <div className="flex justify-center items-center py-12">
//                         <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#89beab]"></div>
//                     </div>
//                 ) : groups.length === 0 ? (
//                     /* Empty State */
//                     <div className="text-center py-12">
//                         <Users className="w-16 h-16 mx-auto mb-4 text-gray-400" />
//                         <p className="text-gray-600 dark:text-gray-400 text-lg">
//                             No groups found. Check back later!
//                         </p>
//                     </div>
//                 ) : (
//                     /* Groups Grid */
//                     <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                         {groups.map(group => {
//                             const isMember = false; // TODO: Check if current user is member
//                             const hasPendingRequest = false; // TODO: Check if user has pending request
//                             const isFull = group.members?.length >= group.maxMembers;

//                             return (
//                                 <div
//                                     key={group._id}
//                                     className="bg-gradient-to-br from-gray-50 to-white dark:from-gray-700 dark:to-gray-800 rounded-3xl p-6 shadow-lg border-2 border-gray-200 dark:border-gray-600 hover:shadow-xl hover:border-[#89beab] dark:hover:border-teal-500 transition-all cursor-pointer"
//                                     onClick={() => navigate(`/community/group/${group._id}`)}
//                                 >
//                                     {/* Header */}
//                                     <div className="flex items-center gap-3 mb-4">
//                                         <div className={`w-14 h-14 bg-gradient-to-br ${categoryColors[group.category] || 'from-gray-500 to-gray-600'} rounded-2xl flex items-center justify-center text-3xl shadow-md`}>
//                                             {group.icon || "📝"}
//                                         </div>
//                                         <div className="flex-1">
//                                             <h3 className="text-xl font-bold text-gray-900 dark:text-white" style={{ fontFamily: "Brasika" }}>
//                                                 {group.name}
//                                             </h3>
//                                             <span className={`inline-block px-3 py-1 bg-gradient-to-r ${categoryColors[group.category]} text-white rounded-full text-xs font-bold`}>
//                                                 {group.category}
//                                             </span>
//                                         </div>
//                                     </div>

//                                     {/* Description */}
//                                     <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-2">
//                                         {group.description}
//                                     </p>

//                                     {/* Stats */}
//                                     <div className="grid grid-cols-2 gap-3 mb-4">
//                                         <div className="bg-white dark:bg-gray-600 rounded-2xl p-3 text-center">
//                                             <Users className="w-4 h-4 mx-auto mb-1 text-[#89beab]" />
//                                             <p className="text-xs text-gray-600 dark:text-gray-400">Members</p>
//                                             <p className="font-bold text-gray-900 dark:text-white">
//                                                 {group.members?.length || 0} / {group.maxMembers}
//                                             </p>
//                                         </div>
//                                         <div className="bg-white dark:bg-gray-600 rounded-2xl p-3 text-center">
//                                             <Calendar className="w-4 h-4 mx-auto mb-1 text-blue-500" />
//                                             <p className="text-xs text-gray-600 dark:text-gray-400">Weekly Task</p>
//                                             <p className="text-xs font-bold text-gray-900 dark:text-white">
//                                                 {group.weeklyTask?.task ? '✓ Active' : 'None'}
//                                             </p>
//                                         </div>
//                                     </div>

//                                     {/* Weekly Task Preview */}
//                                     {group.weeklyTask?.task && (
//                                         <div className="bg-gradient-to-r from-yellow-100 to-orange-100 dark:from-yellow-900/30 dark:to-orange-900/30 rounded-2xl p-3 mb-4">
//                                             <div className="flex items-start gap-2">
//                                                 <Calendar className="w-4 h-4 text-orange-600 dark:text-orange-400 mt-0.5" />
//                                                 <div className="flex-1">
//                                                     <p className="text-xs font-bold text-orange-900 dark:text-orange-300 mb-1">This Week's Task</p>
//                                                     <p className="text-sm text-orange-800 dark:text-orange-200 line-clamp-1">
//                                                         {group.weeklyTask.task}
//                                                     </p>
//                                                 </div>
//                                             </div>
//                                         </div>
//                                     )}

//                                     {/* ✅ NEW: Request to Join Button */}
//                                     <button
//                                         onClick={(e) => {
//                                             e.stopPropagation(); // Prevent card click
//                                             if (!isMember && !hasPendingRequest && !isFull) {
//                                                 handleRequestToJoin(group._id, group.name);
//                                             }
//                                         }}
//                                         disabled={isMember || hasPendingRequest || isFull || requesting === group._id}
//                                         className={`
//                                             w-full py-3 rounded-full font-bold transition-all flex items-center justify-center gap-2
//                                             ${isMember
//                                                 ? 'bg-gray-300 dark:bg-gray-600 text-gray-600 dark:text-gray-400 cursor-not-allowed'
//                                                 : hasPendingRequest
//                                                     ? 'bg-yellow-200 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 cursor-not-allowed'
//                                                     : isFull
//                                                         ? 'bg-red-200 dark:bg-red-900/30 text-red-700 dark:text-red-400 cursor-not-allowed'
//                                                         : 'bg-gradient-to-r from-[#89beab] to-[#6fa893] text-white hover:shadow-lg'
//                                             }
//                                         `}
//                                     >
//                                         {requesting === group._id ? (
//                                             <>
//                                                 <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
//                                                 Sending Request...
//                                             </>
//                                         ) : isMember ? (
//                                             <>✓ Joined</>
//                                         ) : hasPendingRequest ? (
//                                             <>
//                                                 <Clock className="w-4 h-4" />
//                                                 Request Pending
//                                             </>
//                                         ) : isFull ? (
//                                             <>Full</>
//                                         ) : (
//                                             <>
//                                                 <Users className="w-4 h-4" />
//                                                 Request to Join
//                                             </>
//                                         )}
//                                     </button>
//                                 </div>
//                             );
//                         })}
//                     </div>
//                 )}
//             </div>

//             {/* Top Right Navigation Buttons */}
//             <div className="absolute top-6 right-6 flex items-center gap-6">
//                 <NotificationBell />
//                 <button
//                     onClick={() => navigate('/settings')}
//                     className="w-12 h-12 flex items-center justify-center rounded-full bg-white dark:bg-gray-800 shadow-md hover:shadow-lg"
//                 >
//                     <Menu className="w-7 h-7 text-gray-600 dark:text-gray-300" />
//                 </button>
//             </div>
//         </div>
//     );
// };

// export default BrowseGroupsPage;
// import React, { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import Sidebar from "../components/Sidebar";
// import NotificationBell from '../components/NotificationBell';
// import { Menu, ArrowLeft, Users, Calendar, Clock, TrendingUp, Trophy } from 'lucide-react';
// import { getAllGroups, requestToJoinGroup, getUserGroups, getUserChallenges } from "../services/communityService";

// const BrowseGroupsPage = () => {
//     const navigate = useNavigate();
//     const [groups, setGroups] = useState([]);
//     const [myGroups, setMyGroups] = useState([]);
//     const [myChallenges, setMyChallenges] = useState([]);
//     const [loading, setLoading] = useState(true);
//     const [categoryFilter, setCategoryFilter] = useState("all");
//     const [requesting, setRequesting] = useState(null);

//     useEffect(() => {
//         fetchData();
//     }, [categoryFilter]);

//     const fetchData = async () => {
//         setLoading(true);
//         try {
//             const data = await getAllGroups(categoryFilter);
//             setGroups(data.groups || []);

//             // Fetch user's data for right cards
//             const myGroupsData = await getUserGroups();
//             setMyGroups(myGroupsData.groups || []);

//             const challengesData = await getUserChallenges();
//             setMyChallenges(challengesData.challenges || []);
//         } catch (error) {
//             console.error("Error fetching groups:", error);
//             alert("Failed to load groups");
//         } finally {
//             setLoading(false);
//         }
//     };

//     const handleRequestToJoin = async (groupId, groupName) => {
//         const message = prompt(
//             `Request to join "${groupName}"?\n\n(Optional) Tell the moderators why you'd like to join:`
//         );

//         if (message === null) return;

//         setRequesting(groupId);
//         try {
//             await requestToJoinGroup(groupId, message);
//             alert(`✓ Join request submitted for "${groupName}"!\n\nA moderator will review your request soon.`);
//             fetchData();
//         } catch (error) {
//             alert(error.message || "Failed to submit join request");
//         } finally {
//             setRequesting(null);
//         }
//     };

//     const categoryColors = {
//         journaling: "from-purple-500 to-purple-600",
//         gratitude: "from-yellow-500 to-yellow-600",
//         mindfulness: "from-indigo-500 to-indigo-600",
//         fitness: "from-red-500 to-red-600",
//         habits: "from-blue-500 to-blue-600",
//         goals: "from-green-500 to-green-600",
//         wellness: "from-pink-500 to-pink-600",
//         other: "from-gray-500 to-gray-600"
//     };

//     return (
//         <div className="min-h-screen bg-white dark:bg-gray-900 p-6 flex gap-6 relative">
//             {/* LEFT SIDEBAR */}
//             <Sidebar />

//             {/* MAIN CENTER PANEL - 65% width */}
//             <div className="flex-1 ml-28 mr-80 border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 rounded-[50px] p-8 shadow-[0_10px_25px_rgba(248,186,144,0.25)] dark:shadow-[0_10px_25px_rgba(0,0,0,0.3)] max-h-[775px] overflow-y-auto">

//                 {/* Back Button */}
//                 <button
//                     onClick={() => navigate('/community')}
//                     className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-[#f4873e] mb-6 transition-colors"
//                 >
//                     <ArrowLeft className="w-5 h-5" />
//                     <span className="font-semibold">Back to Community</span>
//                 </button>

//                 {/* Header */}
//                 <div className="mb-6">
//                     <h1 className="text-3xl font-bold mb-2" style={{ fontFamily: "Brasika" }}>
//                         <span className="text-[#89beab] dark:text-teal-400">Browse </span>
//                         <span className="text-[#f4873e] dark:text-orange-400">Groups</span>
//                     </h1>
//                     <p className="text-gray-600 dark:text-gray-400">
//                         Find a supportive community to join your wellness journey!
//                     </p>
//                 </div>

//                 {/* Category Filter */}
//                 <div className="mb-6">
//                     <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
//                         Category
//                     </label>
//                     <div className="flex gap-3 flex-wrap">
//                         {["all", "journaling", "gratitude", "mindfulness", "fitness", "habits", "goals", "wellness", "other"].map(category => (
//                             <button
//                                 key={category}
//                                 onClick={() => setCategoryFilter(category)}
//                                 className={`
//                                     px-4 py-2 rounded-full text-sm font-semibold transition-all
//                                     ${categoryFilter === category
//                                         ? 'bg-gradient-to-r from-[#89beab] to-[#6fa893] text-white shadow-lg'
//                                         : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:shadow-md'
//                                     }
//                                 `}
//                             >
//                                 {category.charAt(0).toUpperCase() + category.slice(1)}
//                             </button>
//                         ))}
//                     </div>
//                 </div>

//                 {/* Loading State */}
//                 {loading ? (
//                     <div className="flex justify-center items-center py-12">
//                         <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#89beab]"></div>
//                     </div>
//                 ) : groups.length === 0 ? (
//                     <div className="text-center py-12">
//                         <Users className="w-16 h-16 mx-auto mb-4 text-gray-400" />
//                         <p className="text-gray-600 dark:text-gray-400 text-lg">
//                             No groups found. Check back later!
//                         </p>
//                     </div>
//                 ) : (
//                     <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                         {groups.map(group => {
//                             const isMember = myGroups.some(g => g._id === group._id);
//                             const isFull = group.members?.length >= group.maxMembers;

//                             return (
//                                 <div
//                                     key={group._id}
//                                     className="bg-gradient-to-br from-gray-50 to-white dark:from-gray-700 dark:to-gray-800 rounded-3xl p-6 shadow-lg border-2 border-gray-200 dark:border-gray-600 hover:shadow-xl hover:border-[#89beab] dark:hover:border-teal-500 transition-all cursor-pointer"
//                                     onClick={() => navigate(`/community/group/${group._id}`)}
//                                 >
//                                     <div className="flex items-center gap-3 mb-4">
//                                         <div className={`w-14 h-14 bg-gradient-to-br ${categoryColors[group.category] || 'from-gray-500 to-gray-600'} rounded-2xl flex items-center justify-center text-3xl shadow-md`}>
//                                             {group.icon || "📝"}
//                                         </div>
//                                         <div className="flex-1">
//                                             <h3 className="text-xl font-bold text-gray-900 dark:text-white" style={{ fontFamily: "Brasika" }}>
//                                                 {group.name}
//                                             </h3>
//                                             <span className={`inline-block px-3 py-1 bg-gradient-to-r ${categoryColors[group.category]} text-white rounded-full text-xs font-bold`}>
//                                                 {group.category}
//                                             </span>
//                                         </div>
//                                     </div>

//                                     <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-2">
//                                         {group.description}
//                                     </p>

//                                     <div className="grid grid-cols-2 gap-3 mb-4">
//                                         <div className="bg-white dark:bg-gray-600 rounded-2xl p-3 text-center">
//                                             <Users className="w-4 h-4 mx-auto mb-1 text-[#89beab]" />
//                                             <p className="text-xs text-gray-600 dark:text-gray-400">Members</p>
//                                             <p className="font-bold text-gray-900 dark:text-white">
//                                                 {group.members?.length || 0} / {group.maxMembers}
//                                             </p>
//                                         </div>
//                                         <div className="bg-white dark:bg-gray-600 rounded-2xl p-3 text-center">
//                                             <Calendar className="w-4 h-4 mx-auto mb-1 text-blue-500" />
//                                             <p className="text-xs text-gray-600 dark:text-gray-400">Weekly Task</p>
//                                             <p className="text-xs font-bold text-gray-900 dark:text-white">
//                                                 {group.weeklyTask?.task ? '✓ Active' : 'None'}
//                                             </p>
//                                         </div>
//                                     </div>

//                                     {group.weeklyTask?.task && (
//                                         <div className="bg-gradient-to-r from-yellow-100 to-orange-100 dark:from-yellow-900/30 dark:to-orange-900/30 rounded-2xl p-3 mb-4">
//                                             <div className="flex items-start gap-2">
//                                                 <Calendar className="w-4 h-4 text-orange-600 dark:text-orange-400 mt-0.5" />
//                                                 <div className="flex-1">
//                                                     <p className="text-xs font-bold text-orange-900 dark:text-orange-300 mb-1">This Week's Task</p>
//                                                     <p className="text-sm text-orange-800 dark:text-orange-200 line-clamp-1">
//                                                         {group.weeklyTask.task}
//                                                     </p>
//                                                 </div>
//                                             </div>
//                                         </div>
//                                     )}

//                                     <button
//                                         onClick={(e) => {
//                                             e.stopPropagation();
//                                             if (!isMember && !isFull) {
//                                                 handleRequestToJoin(group._id, group.name);
//                                             }
//                                         }}
//                                         disabled={isMember || isFull || requesting === group._id}
//                                         className={`
//                                             w-full py-3 rounded-full font-bold transition-all flex items-center justify-center gap-2
//                                             ${isMember
//                                                 ? 'bg-gray-300 dark:bg-gray-600 text-gray-600 dark:text-gray-400 cursor-not-allowed'
//                                                 : isFull
//                                                     ? 'bg-red-200 dark:bg-red-900/30 text-red-700 dark:text-red-400 cursor-not-allowed'
//                                                     : 'bg-gradient-to-r from-[#89beab] to-[#6fa893] text-white hover:shadow-lg'
//                                             }
//                                         `}
//                                     >
//                                         {requesting === group._id ? (
//                                             <>
//                                                 <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
//                                                 Sending Request...
//                                             </>
//                                         ) : isMember ? (
//                                             <>✓ Joined</>
//                                         ) : isFull ? (
//                                             <>Full</>
//                                         ) : (
//                                             <>
//                                                 <Users className="w-4 h-4" />
//                                                 Request to Join
//                                             </>
//                                         )}
//                                     </button>
//                                 </div>
//                             );
//                         })}
//                     </div>
//                 )}
//             </div>

//             {/* RIGHT SIDE CARDS - Fixed Position */}
//             <div className="fixed right-6 top-6 w-80 space-y-4 max-h-[calc(100vh-48px)] overflow-y-auto">

//                 {/* Top Navigation */}
//                 <div className="flex items-center justify-end gap-4 mb-4">
//                     <NotificationBell />
//                     <button
//                         onClick={() => navigate('/settings')}
//                         className="w-12 h-12 flex items-center justify-center rounded-full bg-white dark:bg-gray-800 shadow-md hover:shadow-lg border-2 border-gray-200 dark:border-gray-700"
//                     >
//                         <Menu className="w-7 h-7 text-gray-600 dark:text-gray-300" />
//                     </button>
//                 </div>

//                 {/* Card 1: My Groups */}
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

//                             <p className="text-center text-sm text-gray-600 dark:text-gray-400 pt-2">
//                                 {myGroups.length} group{myGroups.length !== 1 ? 's' : ''} joined
//                             </p>
//                         </div>
//                     ) : (
//                         <div className="text-center py-4">
//                             <p className="text-gray-600 dark:text-gray-400 text-sm">No groups yet</p>
//                         </div>
//                     )}
//                 </div>

//                 {/* Card 2: Active Challenge */}
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

//                             <div className="flex gap-1">
//                                 {[...Array(Math.min(myChallenges[0].duration, 14))].map((_, i) => (
//                                     <div
//                                         key={i}
//                                         className={`h-2 flex-1 rounded-full ${i < (myChallenges[0].currentDay || 1)
//                                             ? 'bg-gradient-to-r from-[#f4873e] to-[#ff9e5e]'
//                                             : 'bg-gray-200 dark:bg-gray-700'
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

//                 {/* Card 3: Quick Stats */}
//                 <div className="bg-gradient-to-br from-blue-50 to-white dark:from-blue-900/20 dark:to-gray-800 rounded-[40px] p-6 border-2 border-blue-200 dark:border-blue-800 shadow-lg">
//                     <div className="flex items-center gap-2 mb-4">
//                         <TrendingUp className="w-6 h-6 text-blue-600 dark:text-blue-400" />
//                         <h3 className="font-bold text-gray-900 dark:text-white" style={{ fontFamily: "Brasika" }}>
//                             Quick Stats
//                         </h3>
//                     </div>

//                     <div className="grid grid-cols-2 gap-3">
//                         <div className="bg-white dark:bg-gray-700 rounded-2xl p-4 text-center">
//                             <p className="text-2xl font-bold text-[#89beab]">{myGroups.length}</p>
//                             <p className="text-xs text-gray-600 dark:text-gray-400">My Groups</p>
//                         </div>
//                         <div className="bg-white dark:bg-gray-700 rounded-2xl p-4 text-center">
//                             <p className="text-2xl font-bold text-[#f4873e]">{groups.length}</p>
//                             <p className="text-xs text-gray-600 dark:text-gray-400">Available</p>
//                         </div>
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default BrowseGroupsPage;
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import RightSidebarCards from "../components/RightSidebarCards";
import { ArrowLeft, Users, Calendar } from 'lucide-react';
import { getAllGroups, requestToJoinGroup, getUserGroups, getUserChallenges } from "../services/communityService";

const BrowseGroupsPage = () => {
    const navigate = useNavigate();
    const [groups, setGroups] = useState([]);
    const [myGroups, setMyGroups] = useState([]);
    const [myChallenges, setMyChallenges] = useState([]);
    const [loading, setLoading] = useState(true);
    const [categoryFilter, setCategoryFilter] = useState("all");
    const [requesting, setRequesting] = useState(null);

    useEffect(() => {
        fetchData();
    }, [categoryFilter]);

    const fetchData = async () => {
        setLoading(true);
        try {
            const data = await getAllGroups(categoryFilter);
            setGroups(data.groups || []);

            // Fetch user's data for right cards
            const myGroupsData = await getUserGroups();
            setMyGroups(myGroupsData.groups || []);

            const challengesData = await getUserChallenges();
            setMyChallenges(challengesData.challenges || []);
        } catch (error) {
            console.error("Error fetching groups:", error);
            alert("Failed to load groups");
        } finally {
            setLoading(false);
        }
    };

    const handleRequestToJoin = async (groupId, groupName) => {
        const message = prompt(
            `Request to join "${groupName}"?\n\n(Optional) Tell the moderators why you'd like to join:`
        );

        if (message === null) return;

        setRequesting(groupId);
        try {
            await requestToJoinGroup(groupId, message);
            alert(`✓ Join request submitted for "${groupName}"!\n\nA moderator will review your request soon.`);
            fetchData();
        } catch (error) {
            alert(error.message || "Failed to submit join request");
        } finally {
            setRequesting(null);
        }
    };

    const categoryColors = {
        journaling: "from-purple-500 to-purple-600",
        gratitude: "from-yellow-500 to-yellow-600",
        mindfulness: "from-indigo-500 to-indigo-600",
        fitness: "from-red-500 to-red-600",
        habits: "from-blue-500 to-blue-600",
        goals: "from-green-500 to-green-600",
        wellness: "from-pink-500 to-pink-600",
        other: "from-gray-500 to-gray-600"
    };

    return (
        <div className="min-h-screen bg-white dark:bg-gray-900 p-6 flex gap-6">
            {/* LEFT SIDEBAR */}
            <Sidebar />

            {/* MAIN CENTER PANEL - Matches dashboard width */}
            <div className="flex-1 ml-28 border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 rounded-[50px] p-8 shadow-[0_10px_25px_rgba(248,186,144,0.25)] dark:shadow-[0_10px_25px_rgba(0,0,0,0.3)] max-h-[775px] overflow-y-auto">

                {/* Back Button */}
                <button
                    onClick={() => navigate('/community')}
                    className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-[#f4873e] mb-6 transition-colors"
                >
                    <ArrowLeft className="w-5 h-5" />
                    <span className="font-semibold">Back to Community</span>
                </button>

                {/* Header */}
                <div className="mb-6">
                    <h1 className="text-3xl font-bold mb-2" style={{ fontFamily: "Brasika" }}>
                        <span className="text-[#89beab] dark:text-teal-400">Browse </span>
                        <span className="text-[#f4873e] dark:text-orange-400">Groups</span>
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400">
                        Find a supportive community to join your wellness journey!
                    </p>
                </div>

                {/* Category Filter */}
                <div className="mb-6">
                    <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
                        Category
                    </label>
                    <div className="flex gap-3 flex-wrap">
                        {["all", "journaling", "gratitude", "mindfulness", "fitness", "habits", "goals", "wellness", "other"].map(category => (
                            <button
                                key={category}
                                onClick={() => setCategoryFilter(category)}
                                className={`
                                    px-4 py-2 rounded-full text-sm font-semibold transition-all
                                    ${categoryFilter === category
                                        ? 'bg-gradient-to-r from-[#89beab] to-[#6fa893] text-white shadow-lg'
                                        : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:shadow-md'
                                    }
                                `}
                            >
                                {category.charAt(0).toUpperCase() + category.slice(1)}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Loading State */}
                {loading ? (
                    <div className="flex justify-center items-center py-12">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#89beab]"></div>
                    </div>
                ) : groups.length === 0 ? (
                    <div className="text-center py-12">
                        <Users className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                        <p className="text-gray-600 dark:text-gray-400 text-lg">
                            No groups found. Check back later!
                        </p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {groups.map(group => {
                            const isMember = myGroups.some(g => g._id === group._id);
                            const isFull = group.members?.length >= group.maxMembers;

                            return (
                                <div
                                    key={group._id}
                                    className="bg-gradient-to-br from-gray-50 to-white dark:from-gray-700 dark:to-gray-800 rounded-3xl p-6 shadow-lg border-2 border-gray-200 dark:border-gray-600 hover:shadow-xl hover:border-[#89beab] dark:hover:border-teal-500 transition-all cursor-pointer"
                                    onClick={() => navigate(`/community/group/${group._id}`)}
                                >
                                    <div className="flex items-center gap-3 mb-4">
                                        <div className={`w-14 h-14 bg-gradient-to-br ${categoryColors[group.category] || 'from-gray-500 to-gray-600'} rounded-2xl flex items-center justify-center text-3xl shadow-md`}>
                                            {group.icon || "📝"}
                                        </div>
                                        <div className="flex-1">
                                            <h3 className="text-xl font-bold text-gray-900 dark:text-white" style={{ fontFamily: "Brasika" }}>
                                                {group.name}
                                            </h3>
                                            <span className={`inline-block px-3 py-1 bg-gradient-to-r ${categoryColors[group.category]} text-white rounded-full text-xs font-bold`}>
                                                {group.category}
                                            </span>
                                        </div>
                                    </div>

                                    <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-2">
                                        {group.description}
                                    </p>

                                    <div className="grid grid-cols-2 gap-3 mb-4">
                                        <div className="bg-white dark:bg-gray-600 rounded-2xl p-3 text-center">
                                            <Users className="w-4 h-4 mx-auto mb-1 text-[#89beab]" />
                                            <p className="text-xs text-gray-600 dark:text-gray-400">Members</p>
                                            <p className="font-bold text-gray-900 dark:text-white">
                                                {group.members?.length || 0} / {group.maxMembers}
                                            </p>
                                        </div>
                                        <div className="bg-white dark:bg-gray-600 rounded-2xl p-3 text-center">
                                            <Calendar className="w-4 h-4 mx-auto mb-1 text-blue-500" />
                                            <p className="text-xs text-gray-600 dark:text-gray-400">Weekly Task</p>
                                            <p className="text-xs font-bold text-gray-900 dark:text-white">
                                                {group.weeklyTask?.task ? '✓ Active' : 'None'}
                                            </p>
                                        </div>
                                    </div>

                                    {group.weeklyTask?.task && (
                                        <div className="bg-gradient-to-r from-yellow-100 to-orange-100 dark:from-yellow-900/30 dark:to-orange-900/30 rounded-2xl p-3 mb-4">
                                            <div className="flex items-start gap-2">
                                                <Calendar className="w-4 h-4 text-orange-600 dark:text-orange-400 mt-0.5" />
                                                <div className="flex-1">
                                                    <p className="text-xs font-bold text-orange-900 dark:text-orange-300 mb-1">This Week's Task</p>
                                                    <p className="text-sm text-orange-800 dark:text-orange-200 line-clamp-1">
                                                        {group.weeklyTask.task}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            if (!isMember && !isFull) {
                                                handleRequestToJoin(group._id, group.name);
                                            }
                                        }}
                                        disabled={isMember || isFull || requesting === group._id}
                                        className={`
                                            w-full py-3 rounded-full font-bold transition-all flex items-center justify-center gap-2
                                            ${isMember
                                                ? 'bg-gray-300 dark:bg-gray-600 text-gray-600 dark:text-gray-400 cursor-not-allowed'
                                                : isFull
                                                    ? 'bg-red-200 dark:bg-red-900/30 text-red-700 dark:text-red-400 cursor-not-allowed'
                                                    : 'bg-gradient-to-r from-[#89beab] to-[#6fa893] text-white hover:shadow-lg'
                                            }
                                        `}
                                    >
                                        {requesting === group._id ? (
                                            <>
                                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                                Sending Request...
                                            </>
                                        ) : isMember ? (
                                            <>✓ Joined</>
                                        ) : isFull ? (
                                            <>Full</>
                                        ) : (
                                            <>
                                                <Users className="w-4 h-4" />
                                                Request to Join
                                            </>
                                        )}
                                    </button>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>

            {/* RIGHT SIDEBAR CARDS - Reusable Component */}
            <RightSidebarCards
                myGroups={myGroups}
                myChallenges={myChallenges}
                posts={[]}
                challenges={groups}
                pendingRequests={[]}
            />
        </div>
    );
};

export default BrowseGroupsPage;