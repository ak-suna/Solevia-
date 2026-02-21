// import React, { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import { Trophy, Users, Calendar, ArrowLeft } from 'lucide-react';
// import { getAllChallenges, joinChallenge } from "../services/communityService";
// import Sidebar from "../components/Sidebar";
// import NotificationBell from '../components/NotificationBell';
// import { Menu } from 'lucide-react';

// const BrowseChallengesPage = () => {
//     const navigate = useNavigate();
//     const [challenges, setChallenges] = useState([]);
//     const [loading, setLoading] = useState(true);
//     const [filter, setFilter] = useState("all"); // all, active, upcoming

//     useEffect(() => {
//         fetchChallenges();
//     }, [filter]);

//     const fetchChallenges = async () => {
//         setLoading(true);
//         try {
//             const data = await getAllChallenges({ status: filter, limit: 50 });
//             setChallenges(data.challenges || []);
//         } catch (error) {
//             console.error("Error fetching challenges:", error);
//             alert("Failed to load challenges");
//         } finally {
//             setLoading(false);
//         }
//     };

//     const handleJoinChallenge = async (challengeId) => {
//         try {
//             await joinChallenge(challengeId);
//             alert("Successfully joined challenge!");
//             fetchChallenges(); // Refresh to show updated status
//         } catch (error) {
//             console.error("Error joining challenge:", error);
//             alert(error.response?.data?.error || "Failed to join challenge");
//         }
//     };

//     const getChallengeStatus = (challenge) => {
//         const now = new Date();
//         const start = new Date(challenge.startDate);
//         const end = new Date(challenge.endDate);

//         if (now < start) return { label: "Upcoming", color: "from-blue-500 to-blue-600" };
//         if (now > end) return { label: "Ended", color: "from-gray-500 to-gray-600" };
//         return { label: "Active", color: "from-green-500 to-green-600" };
//     };

//     const categoryColors = {
//         habits: "from-blue-500 to-blue-600",
//         gratitude: "from-yellow-500 to-yellow-600",
//         mindfulness: "from-indigo-500 to-indigo-600",
//         fitness: "from-red-500 to-red-600",
//         journaling: "from-purple-500 to-purple-600",
//         wellness: "from-pink-500 to-pink-600",
//         "digital-detox": "from-gray-500 to-gray-600"
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
//                         <span className="text-[#f4873e] dark:text-orange-400">Browse </span>
//                         <span className="text-[#89beab] dark:text-teal-400">Challenges</span>
//                     </h1>
//                     <p className="text-gray-600 dark:text-gray-400">
//                         Join challenges to stay motivated and track your progress with the community
//                     </p>
//                 </div>

//                 {/* Filter Tabs */}
//                 <div className="flex gap-3 mb-6 flex-wrap">
//                     {[
//                         { id: "all", label: "All" },
//                         { id: "active", label: "Active" },
//                         { id: "upcoming", label: "Upcoming" }
//                     ].map(tab => (
//                         <button
//                             key={tab.id}
//                             onClick={() => setFilter(tab.id)}
//                             className={`
//                                 px-6 py-3 rounded-full font-bold transition-all
//                                 ${filter === tab.id
//                                     ? 'bg-gradient-to-r from-[#f4873e] to-[#ff9e5e] text-white shadow-lg'
//                                     : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:shadow-md'
//                                 }
//                             `}
//                         >
//                             {tab.label}
//                         </button>
//                     ))}
//                 </div>

//                 {/* Loading State */}
//                 {loading ? (
//                     <div className="flex justify-center items-center py-12">
//                         <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#f4873e]"></div>
//                     </div>
//                 ) : challenges.length === 0 ? (
//                     /* Empty State */
//                     <div className="text-center py-12">
//                         <Trophy className="w-16 h-16 mx-auto mb-4 text-gray-300 dark:text-gray-600" />
//                         <p className="text-gray-600 dark:text-gray-400 text-lg">
//                             No challenges available yet
//                         </p>
//                         <p className="text-gray-500 dark:text-gray-500 text-sm mt-2">
//                             Check back later for new challenges!
//                         </p>
//                     </div>
//                 ) : (
//                     /* Challenges Grid */
//                     <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                         {challenges.map(challenge => {
//                             const status = getChallengeStatus(challenge);
//                             return (
//                                 <div
//                                     key={challenge._id}
//                                     className="bg-gradient-to-br from-gray-50 to-white dark:from-gray-700 dark:to-gray-800 rounded-3xl p-6 shadow-lg border-2 border-gray-200 dark:border-gray-600 hover:shadow-xl transition-all"
//                                 >
//                                     {/* Header */}
//                                     <div className="flex justify-between items-start mb-4">
//                                         <div className="flex items-center gap-3">
//                                             <span className="text-4xl">{challenge.icon}</span>
//                                             {challenge.isFeatured && (
//                                                 <span className="px-3 py-1 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 rounded-full text-xs font-bold">
//                                                     ⭐ Featured
//                                                 </span>
//                                             )}
//                                         </div>
//                                         <span className={`px-3 py-1 bg-gradient-to-r ${status.color} text-white rounded-full text-xs font-bold`}>
//                                             {status.label}
//                                         </span>
//                                     </div>

//                                     {/* Content */}
//                                     <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2" style={{ fontFamily: "Brasika" }}>
//                                         {challenge.title}
//                                     </h3>
//                                     <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-2">
//                                         {challenge.description}
//                                     </p>

//                                     {/* Category Badge */}
//                                     <div className="mb-4">
//                                         <span className={`inline-block px-3 py-1 bg-gradient-to-r ${categoryColors[challenge.category] || categoryColors.habits} text-white rounded-full text-xs font-bold`}>
//                                             {challenge.category}
//                                         </span>
//                                     </div>

//                                     {/* Stats */}
//                                     <div className="grid grid-cols-3 gap-3 mb-4">
//                                         <div className="bg-white dark:bg-gray-600 rounded-2xl p-3 text-center">
//                                             <Calendar className="w-4 h-4 mx-auto mb-1 text-[#f4873e]" />
//                                             <p className="text-xs text-gray-600 dark:text-gray-400">Duration</p>
//                                             <p className="font-bold text-gray-900 dark:text-white">{challenge.duration}d</p>
//                                         </div>
//                                         <div className="bg-white dark:bg-gray-600 rounded-2xl p-3 text-center">
//                                             <Users className="w-4 h-4 mx-auto mb-1 text-[#89beab]" />
//                                             <p className="text-xs text-gray-600 dark:text-gray-400">Members</p>
//                                             <p className="font-bold text-gray-900 dark:text-white">{challenge.participantCount || 0}</p>
//                                         </div>
//                                         <div className="bg-white dark:bg-gray-600 rounded-2xl p-3 text-center">
//                                             <Trophy className="w-4 h-4 mx-auto mb-1 text-yellow-500" />
//                                             <p className="text-xs text-gray-600 dark:text-gray-400">Reward</p>
//                                             <p className="text-lg">{challenge.rewards?.badge || "🏆"}</p>
//                                         </div>
//                                     </div>

//                                     {/* Dates */}
//                                     <div className="mb-4 text-sm text-gray-600 dark:text-gray-400">
//                                         <p>Starts: {new Date(challenge.startDate).toLocaleDateString()}</p>
//                                         <p>Ends: {new Date(challenge.endDate).toLocaleDateString()}</p>
//                                     </div>

//                                     {/* Join Button */}
//                                     <button
//                                         onClick={() => handleJoinChallenge(challenge._id)}
//                                         disabled={status.label === "Ended"}
//                                         className={`
//                                             w-full py-3 rounded-full font-bold transition-all
//                                             ${status.label === "Ended"
//                                                 ? 'bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed'
//                                                 : 'bg-gradient-to-r from-[#f4873e] to-[#ff9e5e] text-white hover:shadow-lg'
//                                             }
//                                         `}
//                                     >
//                                         {status.label === "Ended" ? "Challenge Ended" : "Join Challenge"}
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

// export default BrowseChallengesPage;
// import React, { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import { Trophy, Users, Calendar, ArrowLeft, TrendingUp, ArrowRight } from 'lucide-react';
// import { getAllChallenges, joinChallenge, getUserGroups, getUserChallenges } from "../services/communityService";
// import Sidebar from "../components/Sidebar";
// import NotificationBell from '../components/NotificationBell';
// import { Menu } from 'lucide-react';

// const BrowseChallengesPage = () => {
//     const navigate = useNavigate();
//     const [challenges, setChallenges] = useState([]);
//     const [myGroups, setMyGroups] = useState([]);
//     const [myChallenges, setMyChallenges] = useState([]);
//     const [loading, setLoading] = useState(true);
//     const [filter, setFilter] = useState("all"); // all, active, upcoming

//     useEffect(() => {
//         fetchData();
//     }, [filter]);

//     const fetchData = async () => {
//         setLoading(true);
//         try {
//             const data = await getAllChallenges({ status: filter, limit: 50 });
//             setChallenges(data.challenges || []);

//             // Fetch user's data for right cards
//             const myGroupsData = await getUserGroups();
//             setMyGroups(myGroupsData.groups || []);

//             const challengesData = await getUserChallenges();
//             setMyChallenges(challengesData.challenges || []);
//         } catch (error) {
//             console.error("Error fetching challenges:", error);
//             alert("Failed to load challenges");
//         } finally {
//             setLoading(false);
//         }
//     };

//     const handleJoinChallenge = async (challengeId) => {
//         try {
//             await joinChallenge(challengeId);
//             alert("Successfully joined challenge!");
//             fetchData(); // Refresh to show updated status
//         } catch (error) {
//             console.error("Error joining challenge:", error);
//             alert(error.response?.data?.error || "Failed to join challenge");
//         }
//     };

//     const getChallengeStatus = (challenge) => {
//         const now = new Date();
//         const start = new Date(challenge.startDate);
//         const end = new Date(challenge.endDate);

//         if (now < start) return { label: "Upcoming", color: "from-blue-500 to-blue-600" };
//         if (now > end) return { label: "Ended", color: "from-gray-500 to-gray-600" };
//         return { label: "Active", color: "from-green-500 to-green-600" };
//     };

//     const categoryColors = {
//         habits: "from-blue-500 to-blue-600",
//         gratitude: "from-yellow-500 to-yellow-600",
//         mindfulness: "from-indigo-500 to-indigo-600",
//         fitness: "from-red-500 to-red-600",
//         journaling: "from-purple-500 to-purple-600",
//         wellness: "from-pink-500 to-pink-600",
//         "digital-detox": "from-gray-500 to-gray-600"
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
//                         <span className="text-[#f4873e] dark:text-orange-400">Browse </span>
//                         <span className="text-[#89beab] dark:text-teal-400">Challenges</span>
//                     </h1>
//                     <p className="text-gray-600 dark:text-gray-400">
//                         Join challenges to stay motivated and track your progress with the community
//                     </p>
//                 </div>

//                 {/* Filter Tabs */}
//                 <div className="flex gap-3 mb-6 flex-wrap">
//                     {[
//                         { id: "all", label: "All" },
//                         { id: "active", label: "Active" },
//                         { id: "upcoming", label: "Upcoming" }
//                     ].map(tab => (
//                         <button
//                             key={tab.id}
//                             onClick={() => setFilter(tab.id)}
//                             className={`
//                                 px-6 py-3 rounded-full font-bold transition-all
//                                 ${filter === tab.id
//                                     ? 'bg-gradient-to-r from-[#f4873e] to-[#ff9e5e] text-white shadow-lg'
//                                     : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:shadow-md'
//                                 }
//                             `}
//                         >
//                             {tab.label}
//                         </button>
//                     ))}
//                 </div>

//                 {/* Loading State */}
//                 {loading ? (
//                     <div className="flex justify-center items-center py-12">
//                         <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#f4873e]"></div>
//                     </div>
//                 ) : challenges.length === 0 ? (
//                     <div className="text-center py-12">
//                         <Trophy className="w-16 h-16 mx-auto mb-4 text-gray-300 dark:text-gray-600" />
//                         <p className="text-gray-600 dark:text-gray-400 text-lg">
//                             No challenges available yet
//                         </p>
//                         <p className="text-gray-500 dark:text-gray-500 text-sm mt-2">
//                             Check back later for new challenges!
//                         </p>
//                     </div>
//                 ) : (
//                     <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                         {challenges.map(challenge => {
//                             const status = getChallengeStatus(challenge);
//                             const isJoined = myChallenges.some(c => c._id === challenge._id);

//                             return (
//                                 <div
//                                     key={challenge._id}
//                                     className="bg-gradient-to-br from-gray-50 to-white dark:from-gray-700 dark:to-gray-800 rounded-3xl p-6 shadow-lg border-2 border-gray-200 dark:border-gray-600 hover:shadow-xl hover:border-[#f4873e] dark:hover:border-orange-500 transition-all"
//                                 >
//                                     {/* Header */}
//                                     <div className="flex justify-between items-start mb-4">
//                                         <div className="flex items-center gap-3">
//                                             <span className="text-4xl">{challenge.icon}</span>
//                                             {challenge.isFeatured && (
//                                                 <span className="px-3 py-1 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 rounded-full text-xs font-bold">
//                                                     ⭐ Featured
//                                                 </span>
//                                             )}
//                                         </div>
//                                         <span className={`px-3 py-1 bg-gradient-to-r ${status.color} text-white rounded-full text-xs font-bold`}>
//                                             {status.label}
//                                         </span>
//                                     </div>

//                                     {/* Content */}
//                                     <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2" style={{ fontFamily: "Brasika" }}>
//                                         {challenge.title}
//                                     </h3>
//                                     <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-2">
//                                         {challenge.description}
//                                     </p>

//                                     {/* Category Badge */}
//                                     <div className="mb-4">
//                                         <span className={`inline-block px-3 py-1 bg-gradient-to-r ${categoryColors[challenge.category] || categoryColors.habits} text-white rounded-full text-xs font-bold`}>
//                                             {challenge.category}
//                                         </span>
//                                     </div>

//                                     {/* Stats */}
//                                     <div className="grid grid-cols-3 gap-3 mb-4">
//                                         <div className="bg-white dark:bg-gray-600 rounded-2xl p-3 text-center">
//                                             <Calendar className="w-4 h-4 mx-auto mb-1 text-[#f4873e]" />
//                                             <p className="text-xs text-gray-600 dark:text-gray-400">Duration</p>
//                                             <p className="font-bold text-gray-900 dark:text-white">{challenge.duration}d</p>
//                                         </div>
//                                         <div className="bg-white dark:bg-gray-600 rounded-2xl p-3 text-center">
//                                             <Users className="w-4 h-4 mx-auto mb-1 text-[#89beab]" />
//                                             <p className="text-xs text-gray-600 dark:text-gray-400">Members</p>
//                                             <p className="font-bold text-gray-900 dark:text-white">{challenge.participantCount || 0}</p>
//                                         </div>
//                                         <div className="bg-white dark:bg-gray-600 rounded-2xl p-3 text-center">
//                                             <Trophy className="w-4 h-4 mx-auto mb-1 text-yellow-500" />
//                                             <p className="text-xs text-gray-600 dark:text-gray-400">Reward</p>
//                                             <p className="text-lg">{challenge.rewards?.badge || "🏆"}</p>
//                                         </div>
//                                     </div>

//                                     {/* Dates */}
//                                     <div className="mb-4 text-sm text-gray-600 dark:text-gray-400">
//                                         <p>Starts: {new Date(challenge.startDate).toLocaleDateString()}</p>
//                                         <p>Ends: {new Date(challenge.endDate).toLocaleDateString()}</p>
//                                     </div>

//                                     {/* Join Button */}
//                                     <button
//                                         onClick={() => handleJoinChallenge(challenge._id)}
//                                         disabled={status.label === "Ended" || isJoined}
//                                         className={`
//                                             w-full py-3 rounded-full font-bold transition-all
//                                             ${status.label === "Ended" || isJoined
//                                                 ? 'bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed'
//                                                 : 'bg-gradient-to-r from-[#f4873e] to-[#ff9e5e] text-white hover:shadow-lg'
//                                             }
//                                         `}
//                                     >
//                                         {status.label === "Ended" ? "Challenge Ended" : isJoined ? "✓ Joined" : "Join Challenge"}
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

//                 {/* Card 1: My Active Challenges */}
//                 <div className="bg-gradient-to-br from-orange-50 to-white dark:from-orange-900/20 dark:to-gray-800 rounded-[40px] p-6 border-2 border-orange-200 dark:border-orange-800 shadow-lg">
//                     <div className="flex items-center gap-2 mb-4">
//                         <Trophy className="w-6 h-6 text-[#f4873e]" />
//                         <h3 className="font-bold text-gray-900 dark:text-white" style={{ fontFamily: "Brasika" }}>
//                             My Challenges
//                         </h3>
//                     </div>

//                     {myChallenges.length > 0 ? (
//                         <div className="space-y-3">
//                             {myChallenges.slice(0, 2).map(challenge => (
//                                 <div
//                                     key={challenge._id}
//                                     className="flex items-center gap-3 p-3 bg-white dark:bg-gray-700 rounded-2xl hover:shadow-md transition-all"
//                                 >
//                                     <span className="text-2xl">{challenge.icon || "🏆"}</span>
//                                     <div className="flex-1">
//                                         <p className="font-semibold text-gray-900 dark:text-white text-sm">{challenge.title}</p>
//                                         <p className="text-xs text-gray-600 dark:text-gray-400">
//                                             Day {challenge.currentDay || 1}/{challenge.duration}
//                                         </p>
//                                         {/* Mini Progress Bar */}
//                                         <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-1.5 mt-1">
//                                             <div
//                                                 className="bg-gradient-to-r from-[#f4873e] to-[#ff9e5e] h-1.5 rounded-full"
//                                                 style={{ width: `${((challenge.currentDay || 1) / challenge.duration) * 100}%` }}
//                                             ></div>
//                                         </div>
//                                     </div>
//                                 </div>
//                             ))}

//                             <p className="text-center text-sm text-gray-600 dark:text-gray-400 pt-2">
//                                 {myChallenges.length} active challenge{myChallenges.length !== 1 ? 's' : ''}
//                             </p>
//                         </div>
//                     ) : (
//                         <div className="text-center py-4">
//                             <p className="text-gray-600 dark:text-gray-400 text-sm mb-3">No active challenges</p>
//                             <p className="text-xs text-gray-500 dark:text-gray-500">Join one to get started!</p>
//                         </div>
//                     )}
//                 </div>

//                 {/* Card 2: My Groups */}
//                 {myGroups.length > 0 && (
//                     <div className="bg-gradient-to-br from-teal-50 to-white dark:from-teal-900/20 dark:to-gray-800 rounded-[40px] p-6 border-2 border-teal-200 dark:border-teal-800 shadow-lg">
//                         <div className="flex items-center gap-2 mb-4">
//                             <Users className="w-6 h-6 text-[#89beab]" />
//                             <h3 className="font-bold text-gray-900 dark:text-white" style={{ fontFamily: "Brasika" }}>
//                                 My Groups
//                             </h3>
//                         </div>

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
//                     </div>
//                 )}

//                 {/* Card 3: Challenge Stats */}
//                 <div className="bg-gradient-to-br from-blue-50 to-white dark:from-blue-900/20 dark:to-gray-800 rounded-[40px] p-6 border-2 border-blue-200 dark:border-blue-800 shadow-lg">
//                     <div className="flex items-center gap-2 mb-4">
//                         <TrendingUp className="w-6 h-6 text-blue-600 dark:text-blue-400" />
//                         <h3 className="font-bold text-gray-900 dark:text-white" style={{ fontFamily: "Brasika" }}>
//                             Challenge Stats
//                         </h3>
//                     </div>

//                     <div className="grid grid-cols-2 gap-3">
//                         <div className="bg-white dark:bg-gray-700 rounded-2xl p-4 text-center">
//                             <p className="text-2xl font-bold text-[#f4873e]">{myChallenges.length}</p>
//                             <p className="text-xs text-gray-600 dark:text-gray-400">Active</p>
//                         </div>
//                         <div className="bg-white dark:bg-gray-700 rounded-2xl p-4 text-center">
//                             <p className="text-2xl font-bold text-[#89beab]">{challenges.length}</p>
//                             <p className="text-xs text-gray-600 dark:text-gray-400">Available</p>
//                         </div>
//                     </div>

//                     {/* Featured Challenge */}
//                     {challenges.find(c => c.isFeatured) && (
//                         <div className="mt-4 p-4 bg-gradient-to-r from-yellow-100 to-orange-100 dark:from-yellow-900/30 dark:to-orange-900/30 rounded-2xl">
//                             <p className="text-xs font-bold text-orange-900 dark:text-orange-300 mb-1">⭐ Featured Challenge</p>
//                             <p className="text-sm font-semibold text-gray-900 dark:text-white">
//                                 {challenges.find(c => c.isFeatured).title}
//                             </p>
//                             <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
//                                 {challenges.find(c => c.isFeatured).participantCount || 0} participants
//                             </p>
//                         </div>
//                     )}
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default BrowseChallengesPage;
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Trophy, Users, Calendar, ArrowLeft, ArrowRight } from 'lucide-react';
import { getAllChallenges, joinChallenge, getUserGroups, getUserChallenges } from "../services/communityService";
import Sidebar from "../components/Sidebar";
import RightSidebarCards from "../components/RightSidebarCards";

const BrowseChallengesPage = () => {
    const navigate = useNavigate();
    const [challenges, setChallenges] = useState([]);
    const [myGroups, setMyGroups] = useState([]);
    const [myChallenges, setMyChallenges] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState("all"); // all, active, upcoming

    useEffect(() => {
        fetchData();
    }, [filter]);

    const fetchData = async () => {
        setLoading(true);
        try {
            const data = await getAllChallenges({ status: filter, limit: 50 });
            setChallenges(data.challenges || []);

            // Fetch user's data for right cards
            const myGroupsData = await getUserGroups();
            setMyGroups(myGroupsData.groups || []);

            const challengesData = await getUserChallenges();
            setMyChallenges(challengesData.challenges || []);
        } catch (error) {
            console.error("Error fetching challenges:", error);
            alert("Failed to load challenges");
        } finally {
            setLoading(false);
        }
    };

    const handleJoinChallenge = async (challengeId) => {
        try {
            await joinChallenge(challengeId);
            alert("Successfully joined challenge!");
            fetchData(); // Refresh to show updated status
        } catch (error) {
            console.error("Error joining challenge:", error);
            alert(error.response?.data?.error || "Failed to join challenge");
        }
    };

    const getChallengeStatus = (challenge) => {
        const now = new Date();
        const start = new Date(challenge.startDate);
        const end = new Date(challenge.endDate);

        if (now < start) return { label: "Upcoming", color: "from-blue-500 to-blue-600" };
        if (now > end) return { label: "Ended", color: "from-gray-500 to-gray-600" };
        return { label: "Active", color: "from-green-500 to-green-600" };
    };

    const categoryColors = {
        habits: "from-blue-500 to-blue-600",
        gratitude: "from-yellow-500 to-yellow-600",
        mindfulness: "from-indigo-500 to-indigo-600",
        fitness: "from-red-500 to-red-600",
        journaling: "from-purple-500 to-purple-600",
        wellness: "from-pink-500 to-pink-600",
        "digital-detox": "from-gray-500 to-gray-600"
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
                        <span className="text-[#f4873e] dark:text-orange-400">Browse </span>
                        <span className="text-[#89beab] dark:text-teal-400">Challenges</span>
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400">
                        Join challenges to stay motivated and track your progress with the community
                    </p>
                </div>

                {/* Filter Tabs */}
                <div className="flex gap-3 mb-6 flex-wrap">
                    {[
                        { id: "all", label: "All" },
                        { id: "active", label: "Active" },
                        { id: "upcoming", label: "Upcoming" }
                    ].map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setFilter(tab.id)}
                            className={`
                                px-6 py-3 rounded-full font-bold transition-all
                                ${filter === tab.id
                                    ? 'bg-gradient-to-r from-[#f4873e] to-[#ff9e5e] text-white shadow-lg'
                                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:shadow-md'
                                }
                            `}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>

                {/* Loading State */}
                {loading ? (
                    <div className="flex justify-center items-center py-12">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#f4873e]"></div>
                    </div>
                ) : challenges.length === 0 ? (
                    <div className="text-center py-12">
                        <Trophy className="w-16 h-16 mx-auto mb-4 text-gray-300 dark:text-gray-600" />
                        <p className="text-gray-600 dark:text-gray-400 text-lg">
                            No challenges available yet
                        </p>
                        <p className="text-gray-500 dark:text-gray-500 text-sm mt-2">
                            Check back later for new challenges!
                        </p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {challenges.map(challenge => {
                            const status = getChallengeStatus(challenge);
                            const isJoined = myChallenges.some(c => c._id === challenge._id);

                            return (
                                <div
                                    key={challenge._id}
                                    className="bg-gradient-to-br from-gray-50 to-white dark:from-gray-700 dark:to-gray-800 rounded-3xl p-6 shadow-lg border-2 border-gray-200 dark:border-gray-600 hover:shadow-xl hover:border-[#f4873e] dark:hover:border-orange-500 transition-all"
                                >
                                    {/* Header */}
                                    <div className="flex justify-between items-start mb-4">
                                        <div className="flex items-center gap-3">
                                            <span className="text-4xl">{challenge.icon}</span>
                                            {challenge.isFeatured && (
                                                <span className="px-3 py-1 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 rounded-full text-xs font-bold">
                                                    ⭐ Featured
                                                </span>
                                            )}
                                        </div>
                                        <span className={`px-3 py-1 bg-gradient-to-r ${status.color} text-white rounded-full text-xs font-bold`}>
                                            {status.label}
                                        </span>
                                    </div>

                                    {/* Content */}
                                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2" style={{ fontFamily: "Brasika" }}>
                                        {challenge.title}
                                    </h3>
                                    <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-2">
                                        {challenge.description}
                                    </p>

                                    {/* Category Badge */}
                                    <div className="mb-4">
                                        <span className={`inline-block px-3 py-1 bg-gradient-to-r ${categoryColors[challenge.category] || categoryColors.habits} text-white rounded-full text-xs font-bold`}>
                                            {challenge.category}
                                        </span>
                                    </div>

                                    {/* Stats */}
                                    <div className="grid grid-cols-3 gap-3 mb-4">
                                        <div className="bg-white dark:bg-gray-600 rounded-2xl p-3 text-center">
                                            <Calendar className="w-4 h-4 mx-auto mb-1 text-[#f4873e]" />
                                            <p className="text-xs text-gray-600 dark:text-gray-400">Duration</p>
                                            <p className="font-bold text-gray-900 dark:text-white">{challenge.duration}d</p>
                                        </div>
                                        <div className="bg-white dark:bg-gray-600 rounded-2xl p-3 text-center">
                                            <Users className="w-4 h-4 mx-auto mb-1 text-[#89beab]" />
                                            <p className="text-xs text-gray-600 dark:text-gray-400">Members</p>
                                            <p className="font-bold text-gray-900 dark:text-white">{challenge.participantCount || 0}</p>
                                        </div>
                                        <div className="bg-white dark:bg-gray-600 rounded-2xl p-3 text-center">
                                            <Trophy className="w-4 h-4 mx-auto mb-1 text-yellow-500" />
                                            <p className="text-xs text-gray-600 dark:text-gray-400">Reward</p>
                                            <p className="text-lg">{challenge.rewards?.badge || "🏆"}</p>
                                        </div>
                                    </div>

                                    {/* Dates */}
                                    <div className="mb-4 text-sm text-gray-600 dark:text-gray-400">
                                        <p>Starts: {new Date(challenge.startDate).toLocaleDateString()}</p>
                                        <p>Ends: {new Date(challenge.endDate).toLocaleDateString()}</p>
                                    </div>

                                    {/* Join Button */}
                                    <button
                                        onClick={() => handleJoinChallenge(challenge._id)}
                                        disabled={status.label === "Ended" || isJoined}
                                        className={`
                                            w-full py-3 rounded-full font-bold transition-all
                                            ${status.label === "Ended" || isJoined
                                                ? 'bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed'
                                                : 'bg-gradient-to-r from-[#f4873e] to-[#ff9e5e] text-white hover:shadow-lg'
                                            }
                                        `}
                                    >
                                        {status.label === "Ended" ? "Challenge Ended" : isJoined ? "✓ Joined" : "Join Challenge"}
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
                challenges={challenges}
                pendingRequests={[]}
            />
        </div>
    );
};

export default BrowseChallengesPage;