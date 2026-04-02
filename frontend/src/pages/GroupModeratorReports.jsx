// import React from 'react';
// import { useParams } from 'react-router-dom';
// import ModeratorSidebar from '../components/ModeratorSidebar';
// import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
// import { getGroupReports, resolveGroupReport } from '../services/communityService';

// const GroupModeratorReports = () => {
//     const { groupId } = useParams();
//     const queryClient = useQueryClient();
//     const { data: reportsData } = useQuery({
//         queryKey: ['community', 'groupReports', groupId],
//         queryFn: () => getGroupReports(groupId),
//         enabled: !!groupId,
//     });
//     const reports = reportsData?.reports || [];

//     const resolveMutation = useMutation({
//         mutationFn: (reportId) => resolveGroupReport(groupId, reportId),
//         onSuccess: () => queryClient.invalidateQueries(['community', 'groupReports', groupId]),
//     });

//     const handleResolve = (reportId) => {
//         if (window.confirm('Mark this report as resolved?')) {
//             resolveMutation.mutate(reportId);
//         }
//     };

//     return (
//         <div className="min-h-screen bg-white dark:bg-gray-900 flex">
//             <ModeratorSidebar />
//             <div className="flex-1 p-8">
//                 <h1 className="text-2xl font-bold mb-6">Group Reports</h1>
//                 <table className="min-w-full bg-white rounded-xl shadow">
//                     <thead>
//                         <tr>
//                             <th className="py-2 px-4">Type</th>
//                             <th className="py-2 px-4">Reported By</th>
//                             <th className="py-2 px-4">Target</th>
//                             <th className="py-2 px-4">Reason</th>
//                             <th className="py-2 px-4">Status</th>
//                             <th className="py-2 px-4">Actions</th>
//                         </tr>
//                     </thead>
//                     <tbody>
//                         {reports.map((r) => (
//                             <tr key={r._id}>
//                                 <td className="py-2 px-4">{r.type}</td>
//                                 <td className="py-2 px-4">{r.reportedBy?.firstName} {r.reportedBy?.lastName}</td>
//                                 <td className="py-2 px-4">{r.targetType === 'post' ? r.post?.content : r.user?.firstName + ' ' + r.user?.lastName}</td>
//                                 <td className="py-2 px-4">{r.reason}</td>
//                                 <td className="py-2 px-4">{r.status}</td>
//                                 <td className="py-2 px-4">
//                                     {r.status !== 'resolved' && (
//                                         <button className="bg-green-500 text-white px-3 py-1 rounded" onClick={() => handleResolve(r._id)}>Resolve</button>
//                                     )}
//                                 </td>
//                             </tr>
//                         ))}
//                     </tbody>
//                 </table>
//             </div>
//         </div>
//     );
// };

// export default GroupModeratorReports;

import React from 'react';
import { useParams } from 'react-router-dom';
import ModeratorSidebar from '../components/ModeratorSidebar';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getGroupReports, resolveGroupReport } from '../services/communityService';
import { AlertTriangle, CheckCircle } from 'lucide-react';

const GroupModeratorReports = () => {
    const { groupId } = useParams();
    const queryClient = useQueryClient();

    const { data: reportsData, isLoading } = useQuery({
        queryKey: ['community', 'groupReports', groupId],
        queryFn: () => getGroupReports(groupId),
        enabled: !!groupId,
    });
    const reports = reportsData?.reports || [];

    const resolveMutation = useMutation({
        mutationFn: (reportId) => resolveGroupReport(groupId, reportId),
        onSuccess: () => queryClient.invalidateQueries(['community', 'groupReports', groupId]),
    });

    const handleResolve = (reportId) => {
        if (window.confirm('Mark this report as resolved?')) {
            resolveMutation.mutate(reportId);
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-white dark:bg-gray-900 p-6 flex gap-6 relative">
                <ModeratorSidebar />
                <div className="flex-1 ml-28 flex justify-center items-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500"></div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white dark:bg-gray-900 p-6 flex gap-6 relative">
            <ModeratorSidebar />

            <div className="flex-1 ml-28 border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 rounded-[50px] p-8 shadow-[0_10px_25px_rgba(248,186,144,0.25)] dark:shadow-[0_10px_25px_rgba(0,0,0,0.3)] relative max-h-[775px] overflow-y-auto">

                <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white flex items-center gap-3" style={{ fontFamily: 'Brasika' }}>
                    <AlertTriangle className="w-7 h-7 text-red-500" />
                    Group Reports
                </h2>

                {reports.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20 text-gray-400 dark:text-gray-600">
                        <CheckCircle className="w-16 h-16 mb-4 text-green-400" />
                        <p className="text-lg font-semibold">No reports to review</p>
                        <p className="text-sm mt-1">This group is all clear!</p>
                    </div>
                ) : (
                    <div className="flex flex-col gap-4">
                        {reports.map((r) => (
                            <div
                                key={r._id}
                                className="bg-gradient-to-br from-gray-50 to-white dark:from-gray-700 dark:to-gray-800 rounded-3xl p-6 border-2 border-gray-200 dark:border-gray-600 shadow-sm hover:shadow-md transition-all"
                            >
                                <div className="flex items-start justify-between gap-4 flex-wrap">
                                    <div className="flex flex-col gap-2 flex-1 min-w-0">
                                        {/* Type & Status row */}
                                        <div className="flex items-center gap-3 flex-wrap">
                                            <span className="px-3 py-1 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-full text-xs font-bold uppercase tracking-wide">
                                                {r.type}
                                            </span>
                                            <span className={`px-3 py-1 rounded-full text-xs font-bold ${r.status === 'resolved'
                                                ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
                                                : 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400'
                                                }`}>
                                                {r.status === 'resolved' ? '✅ Resolved' : '⏳ Pending'}
                                            </span>
                                        </div>

                                        {/* Reporter */}
                                        <p className="text-sm text-gray-500 dark:text-gray-400">
                                            Reported by:{' '}
                                            <span className="font-semibold text-gray-700 dark:text-gray-300">
                                                {r.reportedBy?.firstName} {r.reportedBy?.lastName}
                                            </span>
                                        </p>

                                        {/* Target */}
                                        <div className="bg-white dark:bg-gray-600 rounded-2xl px-4 py-3 border border-gray-200 dark:border-gray-500">
                                            <p className="text-xs font-bold text-gray-500 dark:text-gray-400 mb-1 uppercase tracking-wide">
                                                {r.targetType === 'post' ? 'Post Content' : 'Reported User'}
                                            </p>
                                            <p className="text-sm text-gray-800 dark:text-gray-200">
                                                {r.targetType === 'post'
                                                    ? (r.post?.content || '—')
                                                    : `${r.user?.firstName || ''} ${r.user?.lastName || ''}`.trim() || '—'
                                                }
                                            </p>
                                        </div>

                                        {/* Reason */}
                                        <div className="bg-red-50 dark:bg-red-900/20 rounded-2xl px-4 py-3">
                                            <p className="text-xs font-bold text-red-600 dark:text-red-400 mb-1 uppercase tracking-wide">Reason</p>
                                            <p className="text-sm text-red-800 dark:text-red-300">{r.reason || '—'}</p>
                                        </div>
                                    </div>

                                    {/* Action */}
                                    {r.status !== 'resolved' && (
                                        <button
                                            onClick={() => handleResolve(r._id)}
                                            disabled={resolveMutation.isLoading}
                                            className="px-5 py-2 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-full font-bold hover:shadow-lg transition-all flex items-center gap-2 self-start"
                                        >
                                            <CheckCircle className="w-4 h-4" />
                                            Resolve
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default GroupModeratorReports;