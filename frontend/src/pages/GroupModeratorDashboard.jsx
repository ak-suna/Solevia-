import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ModeratorSidebar from '../components/ModeratorSidebar';
import MobileMenu from '../components/MobileMenu';
import { useQuery } from '@tanstack/react-query';
import { getGroupById, getGroupJoinRequests, getGroupReports } from '../services/communityService';
import { LayoutDashboard, Users, Inbox, AlertTriangle, Menu } from 'lucide-react';
import { jwtDecode } from "jwt-decode";

const GroupModeratorDashboard = () => {
    const { groupId } = useParams();
    const [showMobileMenu, setShowMobileMenu] = useState(false);
    const token = localStorage.getItem("token");
    const role = token ? jwtDecode(token)?.role : null;

    const { data: groupData } = useQuery({
        queryKey: ['community', 'group', groupId],
        queryFn: () => getGroupById(groupId),
        enabled: !!groupId,
    });
    const { data: joinRequestsData } = useQuery({
        queryKey: ['community', 'groupJoinRequests', groupId],
        queryFn: () => getGroupJoinRequests(groupId),
        enabled: !!groupId,
    });
    const { data: reportsData } = useQuery({
        queryKey: ['community', 'groupReports', groupId],
        queryFn: () => getGroupReports(groupId),
        enabled: !!groupId,
    });

    const group = groupData?.group;
    const totalMembers = group?.members?.length || 0;
    const pendingRequests = joinRequestsData?.requests?.length || 0;
    const pendingReports = reportsData?.reports?.length || 0;
    const navigate = useNavigate();
    const stats = [
        {
            label: 'Total Members',
            value: totalMembers,
            icon: Users,
            color: 'from-[#89beab] to-[#6fa893]',
            bg: 'bg-teal-50 dark:bg-teal-900/20',
            iconColor: 'text-[#89beab]',
        },
        {
            label: 'Pending Join Requests',
            value: pendingRequests,
            icon: Inbox,
            color: 'from-[#f4873e] to-[#ff9e5e]',
            bg: 'bg-orange-50 dark:bg-orange-900/20',
            iconColor: 'text-[#f4873e]',
        },
        {
            label: 'Pending Reports',
            value: pendingReports,
            icon: AlertTriangle,
            color: 'from-red-500 to-red-600',
            bg: 'bg-red-50 dark:bg-red-900/20',
            iconColor: 'text-red-500',
        },
    ];

    return (
        <div className="min-h-screen bg-white dark:bg-gray-900 p-4 lg:p-6 flex flex-col lg:flex-row gap-4 lg:gap-6 relative">
            {/* Mobile Menu Button */}
            <button
                onClick={() => setShowMobileMenu(true)}
                className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-white dark:bg-gray-800 rounded-full shadow-lg border-2 border-gray-200 dark:border-gray-700"
            >
                <Menu className="w-6 h-6 text-gray-700 dark:text-gray-300" />
            </button>

            <ModeratorSidebar />
            <MobileMenu isOpen={showMobileMenu} onClose={() => setShowMobileMenu(false)} type="moderator" groupId={groupId} />

            <div className="flex-1 lg:ml-28 border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 rounded-[50px] p-4 lg:p-8 shadow-[0_10px_25px_rgba(248,186,144,0.25)] dark:shadow-[0_10px_25px_rgba(0,0,0,0.3)] relative max-h-[775px] overflow-y-auto">

                {/* Header */}
                <div className="mb-8 flex items-center gap-4">

                    {/* Back Button */}
                    <button
                        onClick={() =>
                            navigate(role === "admin" ? "/admin/groups" : `/community/group/${groupId}`)
                        }
                        className="flex items-center gap-2 px-4 py-2 rounded-full bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition text-sm font-semibold"
                    >
                        ← Back
                    </button>

                    <h2
                        className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-3"
                        style={{ fontFamily: 'Brasika' }}
                    >
                        <LayoutDashboard className="w-7 h-7 text-[#f4873e]" />
                        Moderator Dashboard
                        {group?.name && (
                            <span className="text-gray-400 dark:text-gray-500 font-normal text-lg">
                                — {group.name}
                            </span>
                        )}
                    </h2>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-6 mb-8">
                    {stats.map((stat, i) => {
                        const Icon = stat.icon;
                        return (
                            <div
                                key={i}
                                className="bg-gradient-to-br from-gray-50 to-white dark:from-gray-700 dark:to-gray-800 rounded-3xl p-4 lg:p-6 shadow-lg border-2 border-gray-200 dark:border-gray-600 flex flex-col items-center gap-3"
                            >
                                <div className={`w-14 h-14 rounded-full bg-gradient-to-br ${stat.color} flex items-center justify-center shadow-md`}>
                                    <Icon className="w-7 h-7 text-white" />
                                </div>
                                <p className="text-4xl font-bold text-gray-900 dark:text-white" style={{ fontFamily: 'Brasika' }}>
                                    {stat.value}
                                </p>
                                <p className="text-sm font-semibold text-gray-500 dark:text-gray-400 text-center">
                                    {stat.label}
                                </p>
                            </div>
                        );
                    })}
                </div>

                {/* Group Info Card */}
                {group && (
                    <div className="bg-gradient-to-br from-gray-50 to-white dark:from-gray-700 dark:to-gray-800 rounded-3xl p-4 lg:p-6 shadow-lg border-2 border-gray-200 dark:border-gray-600">
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4" style={{ fontFamily: 'Brasika' }}>
                            Group Info
                        </h3>
                        <div className="flex items-center gap-4 mb-3">
                            <span className="text-4xl">{group.icon || '👥'}</span>
                            <div>
                                <p className="text-xl font-bold text-gray-900 dark:text-white">{group.name}</p>
                                <span className="inline-block px-3 py-1 bg-gradient-to-r from-[#89beab] to-[#6fa893] text-white rounded-full text-xs font-bold capitalize">
                                    {group.category}
                                </span>
                            </div>
                        </div>
                        <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
                            {group.description}
                        </p>
                        {group.weeklyTask?.task && (
                            <div className="mt-4 bg-gradient-to-r from-yellow-100 to-orange-100 dark:from-yellow-900/30 dark:to-orange-900/30 rounded-2xl p-4">
                                <p className="text-xs font-bold text-orange-900 dark:text-orange-300 mb-1">This Week's Task</p>
                                <p className="text-sm text-orange-800 dark:text-orange-200">{group.weeklyTask.task}</p>
                                <p className="text-xs text-orange-600 dark:text-orange-400 mt-2">
                                    ✓ {group.weeklyTask.completedBy?.length || 0} completed
                                </p>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default GroupModeratorDashboard;