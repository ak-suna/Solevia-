import React, { useState } from "react";
import { UserPlus, Check, Clock, Flag } from "lucide-react";
import ReportModal from "./ReportModal";

const MemberCard = ({ member, currentUserId, groupId, existingConnections, onConnect }) => {
    const [loading, setLoading] = useState(false);
    const [showReportModal, setShowReportModal] = useState(false);

    const userId = member.userId?._id || member.userId;
    const name = member.userId?.firstName
        ? `${member.userId.firstName} ${member.userId.lastName}`
        : "Member";

    const isMe = userId === currentUserId;

    const connectionStatus = existingConnections.find(c => {
        const rId = c.requesterId?._id || c.requesterId;
        const recId = c.recipientId?._id || c.recipientId;
        return rId?.toString() === userId?.toString() ||
            recId?.toString() === userId?.toString();
    });

    const handleConnect = async () => {
        if (loading || connectionStatus) return;
        setLoading(true);
        try {
            await onConnect(userId);
        } finally {
            setLoading(false);
        }
    };

    if (isMe) return null;
    if (member.role === "admin") return null;  // ← add this


    return (
        <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
            <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#f8ba90] to-[#f4873e] flex items-center justify-center text-white font-bold text-sm">
                    {name.charAt(0).toUpperCase()}
                </div>
                <div>
                    <p className="font-semibold text-sm text-gray-900 dark:text-white">{name}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 capitalize">{member.role}</p>
                </div>
            </div>

            {!connectionStatus && (
                <button
                    onClick={handleConnect}
                    disabled={loading}
                    className="flex items-center gap-1 px-3 py-1.5 bg-[#89beab] hover:bg-[#6fa893] text-white rounded-full text-xs font-semibold transition-colors disabled:opacity-60"
                >
                    {loading ? (
                        <div className="w-3 h-3 border border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                        <UserPlus className="w-3 h-3" />
                    )}
                    Connect
                </button>
            )}

            {connectionStatus?.status === "pending" && (
                <span className="flex items-center gap-1 px-3 py-1.5 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 rounded-full text-xs font-semibold">
                    <Clock className="w-3 h-3" /> Pending
                </span>
            )}

            {connectionStatus?.status === "accepted" && (
                <span className="flex items-center gap-1 px-3 py-1.5 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-full text-xs font-semibold">
                    <Check className="w-3 h-3" /> Connected
                </span>
            )}

            <button
                onClick={() => setShowReportModal(true)}
                className="p-1.5 ml-2 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-full transition-colors"
                title="Report User"
            >
                <Flag className="w-4 h-4" />
            </button>

            {showReportModal && (
                <ReportModal
                    targetId={userId}
                    targetType="user"
                    onClose={() => setShowReportModal(false)}
                />
            )}
        </div>
    );
};

export default MemberCard;