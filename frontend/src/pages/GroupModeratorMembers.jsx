import React, { useState } from 'react';
import DataTable from '../components/DataTable';
import { useParams } from 'react-router-dom';
import ModeratorSidebar from '../components/ModeratorSidebar';
import MobileMenu from '../components/MobileMenu';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getGroupById, disableGroupMember } from '../services/communityService';
import { Users, Menu } from 'lucide-react';
import { showInfo } from "../utils/uiFeedback";

const GroupModeratorMembers = () => {
    const { groupId } = useParams();
    const [showMobileMenu, setShowMobileMenu] = useState(false);
    const queryClient = useQueryClient();

    const { data: groupData, isLoading } = useQuery({
        queryKey: ['community', 'group', groupId],
        queryFn: () => getGroupById(groupId),
        enabled: !!groupId,
    });

    const group = groupData?.group;
    const members = (group?.members || []).filter(m => m.role !== 'admin');

    const disableMutation = useMutation({
        mutationFn: ({ userId, disabled, reason }) => disableGroupMember(groupId, userId, disabled, reason),
        onSuccess: () => queryClient.invalidateQueries(['community', 'group', groupId]),
    });

    const handleDisable = async (userId, disabled) => {
        if (!disabled) {
            const reason = window.prompt('Please provide a reason for disabling this member (required):');
            if (!reason || reason.trim() === '') {
                showInfo('A reason is required to disable a member.');
                return;
            }
            disableMutation.mutate({ userId, disabled: true, reason });
        } else {
            disableMutation.mutate({ userId, disabled: false });
        }
    };

    const columns = [
        {
            key: 'name',
            label: 'Name',
            accessor: row => `${row.userId.firstName} ${row.userId.lastName || ''}`,
            sortable: true,
            render: (value) => (
                <span className="text-gray-900 dark:text-white font-medium">{value}</span>
            ),
        },
        {
            key: 'email',
            label: 'Email',
            accessor: row => row.userId.email,
            sortable: true,
            render: (value) => (
                <span className="text-gray-600 dark:text-gray-400">{value}</span>
            ),
        },
        {
            key: 'role',
            label: 'Role',
            accessor: row => row.role,
            sortable: true,
            render: (value) => (
                <span className="px-4 py-2 rounded-full bg-gradient-to-r from-[#89beab] to-[#6fa893] text-white text-sm font-bold capitalize">
                    {value}
                </span>
            ),
        },
        {
            key: 'status',
            label: 'Status',
            accessor: row => row.disabled,
            sortable: true,
            render: (value) => (
                <span className={`
                    px-4 py-2 rounded-full text-sm font-bold inline-block
                    ${value
                        ? 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400'
                        : 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
                    }
                `}>
                    {value ? '🔴 Disabled' : '🟢 Active'}
                </span>
            ),
        },
        {
            key: 'reason',
            label: 'Disabled Reason',
            accessor: row => row.disabled ? (row.disabledReason || '—') : '—',
            render: (value) => (
                <span className="text-gray-500 dark:text-gray-400 text-sm">{value}</span>
            ),
        },
        {
            key: 'actions',
            label: 'Actions',
            render: (value, row) => (
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        handleDisable(row.userId._id || row.userId, row.disabled);
                    }}
                    className={`
                        px-5 py-2 rounded-full font-bold text-white transition-all hover:shadow-lg
                        ${row.disabled
                            ? 'bg-gradient-to-r from-green-500 to-green-600'
                            : 'bg-gradient-to-r from-yellow-500 to-yellow-600'
                        }
                    `}
                >
                    {row.disabled ? '✅ Enable' : '🚫 Disable'}
                </button>
            ),
        },
    ];

    if (isLoading) {
        return (
            <div className="min-h-screen bg-white dark:bg-gray-900 p-4 lg:p-6 flex flex-col lg:flex-row gap-4 lg:gap-6 relative">
                <ModeratorSidebar />
                <div className="flex-1 lg:ml-28 flex justify-center items-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#f4873e]"></div>
                </div>
            </div>
        );
    }

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

                <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white flex items-center gap-3" style={{ fontFamily: 'Brasika' }}>
                    <Users className="w-7 h-7 text-[#89beab]" />
                    Group Members
                </h2>

                <DataTable
                    columns={columns}
                    data={members}
                    loading={isLoading}
                    searchable={true}
                    searchPlaceholder="Search members by name, email..."
                    itemsPerPage={10}
                    emptyMessage="No members found"
                />
            </div>
        </div>
    );
};

export default GroupModeratorMembers;