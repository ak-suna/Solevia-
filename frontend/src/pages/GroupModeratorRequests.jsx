import React from 'react';
import { useParams } from 'react-router-dom';
import ModeratorSidebar from '../components/ModeratorSidebar';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getGroupJoinRequests, approveJoinRequest, rejectJoinRequest } from '../services/communityService';
import { UserPlus, CheckCircle, XCircle } from 'lucide-react';
import toast from 'react-hot-toast';

const GroupModeratorRequests = () => {
    const { groupId } = useParams();
    // const navigate = useNavigate();
    const queryClient = useQueryClient();

    const { data: joinRequestsData, isLoading } = useQuery({
        queryKey: ['community', 'groupJoinRequests', groupId],
        queryFn: () => getGroupJoinRequests(groupId),
        enabled: !!groupId,
    });
    const requests = joinRequestsData?.requests || [];

    const approveMutation = useMutation({
        mutationFn: (requestId) => approveJoinRequest(groupId, requestId),
        onSuccess: () => {
            queryClient.invalidateQueries(['community', 'groupJoinRequests', groupId]);
            toast.success("Request approved successfully");
        },
        onError: (error) => {
            toast.error(error.message || "Failed to approve request");
        }
    });
    const rejectMutation = useMutation({
        mutationFn: (requestId) => rejectJoinRequest(groupId, requestId),
        onSuccess: () => {
            queryClient.invalidateQueries(['community', 'groupJoinRequests', groupId]);
            toast.success("Request rejected");
        },
        onError: (error) => {
            toast.error(error.message || "Failed to reject request");
        }
    });

    if (isLoading) {
        return (
            <div className="min-h-screen bg-white dark:bg-gray-900 p-6 flex gap-6 relative">
                <ModeratorSidebar />
                <div className="flex-1 ml-28 flex justify-center items-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#89beab]"></div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white dark:bg-gray-900 p-6 flex gap-6 relative">
            <ModeratorSidebar />
            

            <div className="flex-1 ml-28 border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 rounded-[50px] p-8 shadow-[0_10px_25px_rgba(248,186,144,0.25)] dark:shadow-[0_10px_25px_rgba(0,0,0,0.3)] relative max-h-[775px] overflow-y-auto">
                {/* <button
                    onClick={() => navigate(`/admin/groups/${groupId}/moderator/dashboard`)}
                    className="flex items-center gap-2 px-4 py-2 rounded-full bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition text-sm font-semibold"
                >
                    <ArrowLeft className="w-4 h-4" /> Back
                </button> */}
                <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white flex items-center gap-3" style={{ fontFamily: 'Brasika' }}>
                    <UserPlus className="w-7 h-7 text-[#89beab]" />
                    Join Requests
                </h2>

                {requests.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20 text-gray-400 dark:text-gray-600">
                        <UserPlus className="w-16 h-16 mb-4 text-gray-300 dark:text-gray-600" />
                        <p className="text-lg font-semibold">No pending requests</p>
                        <p className="text-sm mt-1">New requests will appear here.</p>
                    </div>
                ) : (
                    <div className="flex flex-col gap-4">
                        {requests.map((r) => (
                            <div
                                key={r._id}
                                className="bg-gradient-to-br from-gray-50 to-white dark:from-gray-700 dark:to-gray-800 rounded-3xl p-6 border-2 border-gray-200 dark:border-gray-600 shadow-sm hover:shadow-md transition-all"
                            >
                                <div className="flex items-center justify-between gap-4 flex-wrap">
                                    <div className="flex items-center gap-4 flex-1 min-w-0">
                                        {/* Avatar */}
                                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#89beab] to-[#6fa893] flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
                                            {r.userId?.firstName?.charAt(0)?.toUpperCase() || '?'}
                                        </div>

                                        <div className="flex-1 min-w-0">
                                            <p className="font-bold text-gray-900 dark:text-white text-base">
                                                {r.userId?.firstName} {r.userId?.lastName}
                                            </p>
                                            <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                                                {r.userId?.email}
                                            </p>
                                            {r.message && (
                                                <div className="mt-2 bg-white dark:bg-gray-600 rounded-2xl px-4 py-2 border border-gray-200 dark:border-gray-500">
                                                    <p className="text-xs font-bold text-gray-500 dark:text-gray-400 mb-1 uppercase tracking-wide">Message</p>
                                                    <p className="text-sm text-gray-700 dark:text-gray-300">{r.message}</p>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Actions */}
                                    <div className="flex gap-2 flex-shrink-0">
                                        <button
                                            onClick={() => approveMutation.mutate(r._id)}
                                            disabled={approveMutation.isLoading}
                                            className="flex items-center gap-2 px-5 py-2 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-full font-bold hover:shadow-lg transition-all"
                                        >
                                            <CheckCircle className="w-4 h-4" />
                                            Approve
                                        </button>
                                        <button
                                            onClick={() => rejectMutation.mutate(r._id)}
                                            disabled={rejectMutation.isLoading}
                                            className="flex items-center gap-2 px-5 py-2 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-full font-bold hover:shadow-lg transition-all"
                                        >
                                            <XCircle className="w-4 h-4" />
                                            Reject
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default GroupModeratorRequests;