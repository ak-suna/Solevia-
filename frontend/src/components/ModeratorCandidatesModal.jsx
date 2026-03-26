// import React, { useState, useEffect } from 'react';
// import { X, Trophy, Calendar, MessageSquare, AlertCircle, CheckCircle } from 'lucide-react';
// import { getModeratorCandidates, promoteToModerator } from '../services/communityService';

// const ModeratorCandidatesModal = ({ groupId, groupName, onClose, onSuccess }) => {
//     const [candidates, setCandidates] = useState([]);
//     const [loading, setLoading] = useState(true);
//     const [promoting, setPromoting] = useState(null);

//     useEffect(() => {
//         fetchCandidates();
//     }, [groupId]);

//     const fetchCandidates = async () => {
//         setLoading(true);
//         try {
//             const data = await getModeratorCandidates(groupId);
//             setCandidates(data.candidates || []);
//         } catch (error) {
//             alert(error.message);
//         } finally {
//             setLoading(false);
//         }
//     };

//     const handlePromote = async (userId, userFirstName, userLastName) => {
//         if (!window.confirm(`Promote ${userFirstName} ${userLastName} to moderator?`)) return;

//         setPromoting(userId);
//         try {
//             await promoteToModerator(userId, groupId);
//             alert(`${userFirstName} ${userLastName} is now a moderator!`);
//             onSuccess();
//             onClose();
//         } catch (error) {
//             alert(error.message);
//         } finally {
//             setPromoting(null);
//         }
//     };

//     const getScoreColor = (score) => {
//         if (score >= 80) return 'from-green-500 to-green-600';
//         if (score >= 50) return 'from-yellow-500 to-yellow-600';
//         return 'from-gray-500 to-gray-600';
//     };

//     const getScoreLabel = (score) => {
//         if (score >= 80) return 'Excellent';
//         if (score >= 50) return 'Good';
//         return 'Needs More Activity';
//     };

//     return (
//         <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={onClose}>
//             <div
//                 className="bg-white dark:bg-gray-800 rounded-[40px] p-8 max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl"
//                 onClick={(e) => e.stopPropagation()}
//             >
//                 {/* Header */}
//                 <div className="flex justify-between items-center mb-6">
//                     <div>
//                         <h2 className="text-2xl font-bold text-gray-900 dark:text-white" style={{ fontFamily: "Brasika" }}>
//                             <span className="text-[#89beab]">Moderator </span>
//                             <span className="text-[#f4873e]">Candidates</span>
//                         </h2>
//                         <p className="text-gray-600 dark:text-gray-400 mt-1">
//                             For: <span className="font-semibold">{groupName}</span>
//                         </p>
//                     </div>
//                     <button
//                         onClick={onClose}
//                         className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
//                     >
//                         <X className="w-6 h-6 text-gray-600 dark:text-gray-400" />
//                     </button>
//                 </div>

//                 {/* Info Banner */}
//                 <div className="bg-blue-50 dark:bg-blue-900/20 border-2 border-blue-200 dark:border-blue-800 rounded-2xl p-4 mb-6 flex items-start gap-3">
//                     <AlertCircle className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
//                     <div>
//                         <p className="text-sm text-blue-900 dark:text-blue-100 font-semibold">
//                             Candidates are scored based on:
//                         </p>
//                         <p className="text-sm text-blue-700 dark:text-blue-300 mt-1">
//                             Time in group • Weekly tasks completed • Posts & comments • Reports filed • No violations
//                         </p>
//                     </div>
//                 </div>

//                 {/* Loading State */}
//                 {loading ? (
//                     <div className="flex justify-center items-center py-12">
//                         <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#89beab]"></div>
//                     </div>
//                 ) : candidates.length === 0 ? (
//                     /* Empty State */
//                     <div className="text-center py-12">
//                         <Trophy className="w-16 h-16 mx-auto mb-4 text-gray-400" />
//                         <p className="text-gray-600 dark:text-gray-400 text-lg">
//                             No eligible candidates yet. Members need more activity!
//                         </p>
//                         <p className="text-gray-500 dark:text-gray-500 text-sm mt-2">
//                             Minimum: 30 days in group, 50 points, no violations
//                         </p>
//                     </div>
//                 ) : (
//                     /* Candidates List */
//                     <div className="space-y-4">
//                         {candidates.map((candidate) => (
//                             <div
//                                 key={candidate.userId}
//                                 className={`
//                                     bg-gradient-to-br from-gray-50 to-white dark:from-gray-700 dark:to-gray-800 
//                                     rounded-3xl p-6 border-2 transition-all
//                                     ${candidate.eligible
//                                         ? 'border-green-200 dark:border-green-800 hover:border-green-400 dark:hover:border-green-600'
//                                         : 'border-gray-200 dark:border-gray-600 opacity-70'
//                                     }
//                                 `}
//                             >
//                                 {/* Header */}
//                                 <div className="flex items-start justify-between mb-4">
//                                     <div className="flex items-center gap-4">
//                                         {/* Score Badge */}
//                                         <div className={`w-20 h-20 bg-gradient-to-br ${getScoreColor(candidate.score)} rounded-2xl flex flex-col items-center justify-center text-white shadow-lg`}>
//                                             <p className="text-3xl font-bold">{candidate.score}</p>
//                                             <p className="text-xs opacity-90">points</p>
//                                         </div>

//                                         {/* User Info */}
//                                         <div>
//                                             <h3 className="text-xl font-bold text-gray-900 dark:text-white" style={{ fontFamily: "Brasika" }}>
//                                                 {candidate.user.firstName} {candidate.user.lastName}
//                                             </h3>
//                                             <p className="text-sm text-gray-600 dark:text-gray-400">{candidate.user.email}</p>
//                                             <span className={`
//                                                 inline-block px-3 py-1 rounded-full text-xs font-bold mt-2
//                                                 ${candidate.eligible
//                                                     ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
//                                                     : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-400'
//                                                 }
//                                             `}>
//                                                 {candidate.eligible ? '✓ Eligible' : getScoreLabel(candidate.score)}
//                                             </span>
//                                         </div>
//                                     </div>

//                                     {/* Promote Button */}
//                                     <button
//                                         onClick={() => handlePromote(candidate.user._id, candidate.user.firstName, candidate.user.lastName)}
//                                         disabled={promoting === candidate.user._id}
//                                         className={`
//                                             px-6 py-3 rounded-full font-bold transition-all
//                                             ${candidate.eligible
//                                                 ? 'bg-gradient-to-r from-[#89beab] to-[#6fa893] text-white hover:shadow-lg'
//                                                 : 'bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-500 cursor-not-allowed'
//                                             }
//                                         `}
//                                     >
//                                         {promoting === candidate.user._id ? (
//                                             <div className="flex items-center gap-2">
//                                                 <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
//                                                 Promoting...
//                                             </div>
//                                         ) : (
//                                             'Promote to Moderator'
//                                         )}
//                                     </button>
//                                 </div>

//                                 {/* Metrics Grid */}
//                                 <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
//                                     {/* Days in Group */}
//                                     <div className="bg-white dark:bg-gray-600 rounded-2xl p-3 text-center">
//                                         <Calendar className="w-4 h-4 mx-auto mb-1 text-blue-500" />
//                                         <p className="text-xs text-gray-600 dark:text-gray-400">Days in Group</p>
//                                         <p className="text-lg font-bold text-gray-900 dark:text-white">{candidate.metrics.daysInGroup}</p>
//                                     </div>

//                                     {/* Tasks */}
//                                     <div className="bg-white dark:bg-gray-600 rounded-2xl p-3 text-center">
//                                         <CheckCircle className="w-4 h-4 mx-auto mb-1 text-green-500" />
//                                         <p className="text-xs text-gray-600 dark:text-gray-400">Tasks Done</p>
//                                         <p className="text-lg font-bold text-gray-900 dark:text-white">{candidate.metrics.tasksCompleted || 0}</p>
//                                     </div>

//                                     {/* Posts */}
//                                     <div className="bg-white dark:bg-gray-600 rounded-2xl p-3 text-center">
//                                         <MessageSquare className="w-4 h-4 mx-auto mb-1 text-purple-500" />
//                                         <p className="text-xs text-gray-600 dark:text-gray-400">Posts</p>
//                                         <p className="text-lg font-bold text-gray-900 dark:text-white">{candidate.metrics.posts}</p>
//                                     </div>

//                                     {/* Comments */}
//                                     <div className="bg-white dark:bg-gray-600 rounded-2xl p-3 text-center">
//                                         <MessageSquare className="w-4 h-4 mx-auto mb-1 text-orange-500" />
//                                         <p className="text-xs text-gray-600 dark:text-gray-400">Comments</p>
//                                         <p className="text-lg font-bold text-gray-900 dark:text-white">{candidate.metrics.helpfulComments}</p>
//                                     </div>

//                                     {/* Violations */}
//                                     <div className="bg-white dark:bg-gray-600 rounded-2xl p-3 text-center">
//                                         <AlertCircle className="w-4 h-4 mx-auto mb-1 text-red-500" />
//                                         <p className="text-xs text-gray-600 dark:text-gray-400">Violations</p>
//                                         <p className={`text-lg font-bold ${candidate.metrics.violations > 0 ? 'text-red-600 dark:text-red-400' : 'text-green-600 dark:text-green-400'}`}>
//                                             {candidate.metrics.violations}
//                                         </p>
//                                     </div>
//                                 </div>

//                                 {/* Eligibility Warning */}
//                                 {!candidate.eligible && (
//                                     <div className="mt-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-xl p-3">
//                                         <p className="text-sm text-yellow-800 dark:text-yellow-200">
//                                             <strong>Not eligible:</strong> {
//                                                 candidate.score < 50 ? 'Score too low (need 50+)' :
//                                                     candidate.metrics.daysInGroup < 30 ? 'Need 30+ days in group' :
//                                                         candidate.metrics.violations > 0 ? 'Has violations' :
//                                                             'Requirements not met'
//                                             }
//                                         </p>
//                                     </div>
//                                 )}
//                             </div>
//                         ))}
//                     </div>
//                 )}

//                 {/* Footer */}
//                 <div className="flex justify-end gap-3 mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
//                     <button
//                         onClick={onClose}
//                         className="px-6 py-3 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full font-bold hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
//                     >
//                         Close
//                     </button>
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default ModeratorCandidatesModal;
import React, { useState, useEffect } from 'react';
import { X, Trophy, Calendar, MessageSquare, AlertCircle, CheckCircle } from 'lucide-react';
import { getModeratorCandidates, promoteToModerator } from '../services/communityService';

const ModeratorCandidatesModal = ({ groupId, groupName, onClose, onSuccess }) => {
    const [candidates, setCandidates] = useState([]);
    const [loading, setLoading] = useState(true);
    const [promoting, setPromoting] = useState(null);

    useEffect(() => {
        fetchCandidates();
    }, [groupId]);

    const fetchCandidates = async () => {
        setLoading(true);
        try {
            const data = await getModeratorCandidates(groupId);
            setCandidates(data.candidates || []);
        } catch (error) {
            alert(error.message);
        } finally {
            setLoading(false);
        }
    };

    const handlePromote = async (userId, userFirstName, userLastName) => {
        if (!window.confirm(`Promote ${userFirstName} ${userLastName} to moderator?`)) return;

        setPromoting(userId);
        try {
            await promoteToModerator(userId, groupId);
            alert(`${userFirstName} ${userLastName} is now a moderator!`);
            onSuccess();
            onClose();
        } catch (error) {
            alert(error.message);
        } finally {
            setPromoting(null);
        }
    };

    const getScoreColor = (score) => {
        if (score >= 80) return 'from-green-500 to-green-600';
        if (score >= 50) return 'from-yellow-500 to-yellow-600';
        return 'from-gray-500 to-gray-600';
    };

    const getScoreLabel = (score) => {
        if (score >= 80) return 'Excellent';
        if (score >= 50) return 'Good';
        return 'Needs More Activity';
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={onClose}>
            <div
                className="bg-white dark:bg-gray-800 rounded-[40px] p-8 max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white" style={{ fontFamily: "Brasika" }}>
                            <span className="text-[#89beab]">Moderator </span>
                            <span className="text-[#f4873e]">Candidates</span>
                        </h2>
                        <p className="text-gray-600 dark:text-gray-400 mt-1">
                            For: <span className="font-semibold">{groupName}</span>
                        </p>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
                    >
                        <X className="w-6 h-6 text-gray-600 dark:text-gray-400" />
                    </button>
                </div>

                {/* Info Banner */}
                <div className="bg-blue-50 dark:bg-blue-900/20 border-2 border-blue-200 dark:border-blue-800 rounded-2xl p-4 mb-6 flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
                    <div>
                        <p className="text-sm text-blue-900 dark:text-blue-100 font-semibold">
                            Candidates are scored based on:
                        </p>
                        <p className="text-sm text-blue-700 dark:text-blue-300 mt-1">
                            Time in group • Weekly tasks completed • Posts & comments • Reports filed • No violations
                        </p>
                    </div>
                </div>

                {/* Loading State */}
                {loading ? (
                    <div className="flex justify-center items-center py-12">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#89beab]"></div>
                    </div>
                ) : candidates.length === 0 ? (
                    /* Empty State */
                    <div className="text-center py-12">
                        <Trophy className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                        <p className="text-gray-600 dark:text-gray-400 text-lg">
                            No eligible candidates yet. Members need more activity!
                        </p>
                        <p className="text-gray-500 dark:text-gray-500 text-sm mt-2">
                            Minimum: 30 days in group, <span className="font-bold">25 points</span>, no violations
                        </p>
                    </div>
                ) : (
                    /* Candidates List */
                    <div className="space-y-4">
                        {candidates.map((candidate) => (
                            <div
                                key={candidate.userId}
                                className={`
                                    bg-gradient-to-br from-gray-50 to-white dark:from-gray-700 dark:to-gray-800 
                                    rounded-3xl p-6 border-2 transition-all
                                    ${candidate.eligible
                                        ? 'border-green-200 dark:border-green-800 hover:border-green-400 dark:hover:border-green-600'
                                        : 'border-gray-200 dark:border-gray-600 opacity-70'
                                    }
                                `}
                            >
                                {/* Header */}
                                <div className="flex items-start justify-between mb-4">
                                    <div className="flex items-center gap-4">
                                        {/* Score Badge */}
                                        <div className={`w-20 h-20 bg-gradient-to-br ${getScoreColor(candidate.score)} rounded-2xl flex flex-col items-center justify-center text-white shadow-lg`}>
                                            <p className="text-3xl font-bold">{candidate.score}</p>
                                            <p className="text-xs opacity-90">points</p>
                                        </div>

                                        {/* User Info */}
                                        <div>
                                            <h3 className="text-xl font-bold text-gray-900 dark:text-white" style={{ fontFamily: "Brasika" }}>
                                                {candidate.user.firstName} {candidate.user.lastName}
                                            </h3>
                                            <p className="text-sm text-gray-600 dark:text-gray-400">{candidate.user.email}</p>
                                            <span className={`
                                                inline-block px-3 py-1 rounded-full text-xs font-bold mt-2
                                                ${candidate.eligible
                                                    ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
                                                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-400'
                                                }
                                            `}>
                                                {candidate.eligible ? '✓ Eligible' : getScoreLabel(candidate.score)}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Promote Button */}
                                    <button
                                        onClick={() => handlePromote(candidate.user._id, candidate.user.firstName, candidate.user.lastName)}
                                        disabled={promoting === candidate.user._id}
                                        className={`
                                            px-6 py-3 rounded-full font-bold transition-all
                                            ${candidate.eligible
                                                ? 'bg-gradient-to-r from-[#89beab] to-[#6fa893] text-white hover:shadow-lg'
                                                : 'bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-500 cursor-not-allowed'
                                            }
                                        `}
                                    >
                                        {promoting === candidate.user._id ? (
                                            <div className="flex items-center gap-2">
                                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                                Promoting...
                                            </div>
                                        ) : (
                                            'Promote to Moderator'
                                        )}
                                    </button>
                                </div>

                                {/* Metrics Grid */}
                                <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                                    {/* Days in Group */}
                                    <div className="bg-white dark:bg-gray-600 rounded-2xl p-3 text-center">
                                        <Calendar className="w-4 h-4 mx-auto mb-1 text-blue-500" />
                                        <p className="text-xs text-gray-600 dark:text-gray-400">Days in Group</p>
                                        <p className="text-lg font-bold text-gray-900 dark:text-white">{candidate.metrics.daysInGroup}</p>
                                    </div>

                                    {/* Tasks */}
                                    <div className="bg-white dark:bg-gray-600 rounded-2xl p-3 text-center">
                                        <CheckCircle className="w-4 h-4 mx-auto mb-1 text-green-500" />
                                        <p className="text-xs text-gray-600 dark:text-gray-400">Tasks Done</p>
                                        <p className="text-lg font-bold text-gray-900 dark:text-white">{candidate.metrics.tasksCompleted || 0}</p>
                                    </div>

                                    {/* Posts */}
                                    <div className="bg-white dark:bg-gray-600 rounded-2xl p-3 text-center">
                                        <MessageSquare className="w-4 h-4 mx-auto mb-1 text-purple-500" />
                                        <p className="text-xs text-gray-600 dark:text-gray-400">Posts</p>
                                        <p className="text-lg font-bold text-gray-900 dark:text-white">{candidate.metrics.posts}</p>
                                    </div>

                                    {/* Comments */}
                                    <div className="bg-white dark:bg-gray-600 rounded-2xl p-3 text-center">
                                        <MessageSquare className="w-4 h-4 mx-auto mb-1 text-orange-500" />
                                        <p className="text-xs text-gray-600 dark:text-gray-400">Comments</p>
                                        <p className="text-lg font-bold text-gray-900 dark:text-white">{candidate.metrics.helpfulComments}</p>
                                    </div>

                                    {/* Violations */}
                                    <div className="bg-white dark:bg-gray-600 rounded-2xl p-3 text-center">
                                        <AlertCircle className="w-4 h-4 mx-auto mb-1 text-red-500" />
                                        <p className="text-xs text-gray-600 dark:text-gray-400">Violations</p>
                                        <p className={`text-lg font-bold ${candidate.metrics.violations > 0 ? 'text-red-600 dark:text-red-400' : 'text-green-600 dark:text-green-400'}`}>
                                            {candidate.metrics.violations}
                                        </p>
                                    </div>
                                </div>

                                {/* Eligibility Warning */}
                                {!candidate.eligible && (
                                    <div className="mt-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-xl p-3">
                                        <p className="text-sm text-yellow-800 dark:text-yellow-200">
                                            <strong>Not eligible:</strong> {
                                                candidate.score < 25 ? 'Score too low (need 25+)' :
                                                    candidate.metrics.daysInGroup < 30 ? 'Need 30+ days in group' :
                                                        candidate.metrics.violations > 0 ? 'Has violations' :
                                                            'Requirements not met'
                                            }
                                        </p>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}

                {/* Footer */}
                <div className="flex justify-end gap-3 mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                    <button
                        onClick={onClose}
                        className="px-6 py-3 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full font-bold hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ModeratorCandidatesModal;