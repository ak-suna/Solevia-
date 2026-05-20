import React from 'react';
import { useParams } from 'react-router-dom';
import ModeratorSidebar from '../components/ModeratorSidebar';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getGroupReports, resolveGroupReport } from '../services/communityService';
import { AlertTriangle, CheckCircle } from 'lucide-react';
import ReportCard from '../components/ReportCard';

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
                            <ReportCard 
                                key={r._id} 
                                report={r} 
                                onResolve={handleResolve} 
                                isResolving={resolveMutation.isLoading} 
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default GroupModeratorReports;