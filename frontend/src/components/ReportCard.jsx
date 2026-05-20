import React from 'react';
import { CheckCircle, AlertTriangle } from 'lucide-react';

const ReportCard = ({ report, onResolve, isResolving }) => {
    // dynamically adjust based on targetType
    const isResolved = report.status === 'resolved';

    let contentLabel = 'Reported Content';
    let contentText = '—';

    if (report.targetType === 'post') {
        contentLabel = 'Reported Post';
        contentText = report.post?.content || '—';
    } else if (report.targetType === 'comment') {
        contentLabel = 'Reported Comment';
        contentText = report.comment?.content || '—';
    } else if (report.targetType === 'user') {
        contentLabel = 'Reported User';
        contentText = `${report.user?.firstName || ''} ${report.user?.lastName || ''}`.trim() || '—';
    }

    return (
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow flex flex-col md:flex-row gap-5 items-start">
            
            {/* Left side info */}
            <div className="flex-1 min-w-0 space-y-3 w-full">
                
                {/* Header row: Type & Status */}
                <div className="flex items-center gap-3">
                    <span className="px-2.5 py-1 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 rounded-md text-xs font-bold uppercase tracking-wider">
                        {report.targetType || 'Report'}
                    </span>
                    <span className={`px-2.5 py-1 rounded-md text-xs font-bold flex items-center gap-1 ${
                        isResolved 
                            ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400' 
                            : 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400'
                    }`}>
                        {isResolved ? '✅ Resolved' : '⏳ Pending'}
                    </span>
                    
                    <span className="text-xs text-gray-500 dark:text-gray-400 ml-auto flex items-center gap-1">
                        By <span className="font-semibold text-gray-700 dark:text-gray-300">{report.reportedBy?.firstName} {report.reportedBy?.lastName}</span>
                    </span>
                </div>

                {/* Target Content & Reason Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {/* Content Box */}
                    <div className="bg-gray-50 dark:bg-gray-750/50 rounded-xl p-3 border border-gray-100 dark:border-gray-700">
                        <p className="text-[11px] font-bold text-gray-500 dark:text-gray-400 mb-1 uppercase tracking-wider">{contentLabel}</p>
                        <p className="text-sm text-gray-800 dark:text-gray-200 line-clamp-2">{contentText}</p>
                    </div>

                    {/* Reason Box */}
                    <div className="bg-red-50/50 dark:bg-red-900/10 rounded-xl p-3 border border-red-100 dark:border-red-900/30">
                        <p className="text-[11px] font-bold text-red-600 dark:text-red-400 mb-1 uppercase tracking-wider flex items-center gap-1">
                            <AlertTriangle className="w-3 h-3" /> Reason
                        </p>
                        <p className="text-sm text-red-800 dark:text-red-300 capitalize">{report.reason?.replace('-', ' ') || '—'}</p>
                    </div>
                </div>
            </div>

            {/* Right side action */}
            {!isResolved && onResolve && (
                <div className="md:self-center shrink-0 w-full md:w-auto mt-2 md:mt-0">
                    <button
                        onClick={() => onResolve(report._id)}
                        disabled={isResolving}
                        className="w-full md:w-auto px-5 py-2.5 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white rounded-xl text-sm font-bold shadow-sm transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                        <CheckCircle className="w-4 h-4" />
                        Resolve
                    </button>
                </div>
            )}
        </div>
    );
};

export default ReportCard;
