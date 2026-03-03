import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getToken } from "../services/auth";
import { Users, Menu } from 'lucide-react';
import AdminSidebar from "../components/AdminSidebar";
import NotificationBell from '../components/NotificationBell';
import DataTable from "../components/DataTable";

const AdminUsersPage = () => {
    const navigate = useNavigate();
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        setLoading(true);
        try {
            const response = await fetch("http://localhost:5000/api/admin/users", {
                headers: { Authorization: `Bearer ${getToken()}` },
            });
            const data = await response.json();
            if (!response.ok) throw new Error(data.error);
            setUsers(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const toggleUserStatus = async (userId, currentStatus) => {
        const action = currentStatus ? "enable" : "disable";
        if (!window.confirm(`Are you sure you want to ${action} this user?`)) return;

        try {
            const response = await fetch(`http://localhost:5000/api/admin/users/${userId}/status`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${getToken()}`,
                },
                body: JSON.stringify({ disabled: !currentStatus }),
            });

            if (!response.ok) throw new Error(`Failed to ${action} user`);
            fetchUsers();
            alert(`User ${action}d successfully`);
        } catch (err) {
            alert(err.message);
        }
    };

    const changeRole = async (userId, newRole) => {
        try {
            const response = await fetch(`http://localhost:5000/api/admin/users/${userId}/role`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${getToken()}`,
                },
                body: JSON.stringify({ role: newRole }),
            });

            if (!response.ok) throw new Error("Failed to update role");
            fetchUsers();
            alert("Role updated successfully");
        } catch (err) {
            alert(err.message);
        }
    };

    const userColumns = [
        {
            key: 'name',
            label: 'Name',
            sortable: true,
            accessor: (row) => `${row.firstName} ${row.lastName}`,
            render: (value) => (
                <span className="text-gray-900 dark:text-white font-medium">{value}</span>
            )
        },
        {
            key: 'email',
            label: 'Email',
            sortable: true,
            render: (value) => (
                <span className="text-gray-600 dark:text-gray-400">{value}</span>
            )
        },
        {
            key: 'role',
            label: 'Role',
            sortable: true,
            render: (value, row) => (
                <select
                    value={value}
                    onChange={(e) => {
                        e.stopPropagation();
                        changeRole(row._id, e.target.value);
                    }}
                    disabled={row.disabled}
                    className="px-4 py-2 rounded-full border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white font-medium focus:outline-none focus:border-[#f4873e] disabled:opacity-50 cursor-pointer"
                    onClick={(e) => e.stopPropagation()}
                >
                    <option value="user">User</option>
                    <option value="admin">Admin</option>
                </select>
            )
        },
        {
            key: 'disabled',
            label: 'Status',
            sortable: true,
            render: (value) => (
                <span className={`
                    px-4 py-2 rounded-full text-sm font-bold inline-block
                    ${value
                        ? 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400'
                        : 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
                    }
                `}>
                    {value ? "🔴 Disabled" : "🟢 Active"}
                </span>
            )
        },
        {
            key: 'isVerified',
            label: 'Verified',
            sortable: true,
            render: (value) => (
                <span className="text-2xl">{value ? "✅" : "❌"}</span>
            )
        },
        {
            key: 'phone',
            label: 'Phone',
            render: (value) => (
                <span className="text-gray-600 dark:text-gray-400">{value || "N/A"}</span>
            )
        },
        {
            key: 'actions',
            label: 'Actions',
            render: (value, row) => (
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        toggleUserStatus(row._id, row.disabled);
                    }}
                    className={`
                        px-5 py-2 rounded-full font-bold text-white transition-all hover:shadow-lg
                        ${row.disabled
                            ? 'bg-gradient-to-r from-green-500 to-green-600'
                            : 'bg-gradient-to-r from-yellow-500 to-yellow-600'
                        }
                    `}
                >
                    {row.disabled ? "✅ Enable" : "🚫 Disable"}
                </button>
            )
        }
    ];

    return (
        <div className="min-h-screen bg-white dark:bg-gray-900 p-6 flex gap-6 relative">
            {/* LEFT SIDEBAR */}
            <AdminSidebar />

            {/* MAIN CENTER PANEL */}
            <div className="flex-1 ml-28 border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 rounded-[50px] p-8 shadow-[0_10px_25px_rgba(248,186,144,0.25)] dark:shadow-[0_10px_25px_rgba(0,0,0,0.3)] relative max-h-[775px] overflow-y-auto">

                <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white flex items-center gap-3" style={{ fontFamily: "Brasika" }}>
                    <Users className="w-7 h-7 text-[#f4873e]" />
                    User Management
                </h2>

                {error ? (
                    <div className="bg-red-50 dark:bg-red-900/20 border-2 border-red-200 dark:border-red-800 rounded-2xl p-6 text-center">
                        <p className="text-red-600 dark:text-red-400">Error: {error}</p>
                    </div>
                ) : (
                    <DataTable
                        columns={userColumns}
                        data={users}
                        loading={loading}
                        searchable={true}
                        searchPlaceholder="Search users by name, email..."
                        itemsPerPage={10}
                        emptyMessage="No users found"
                    />
                )}
            </div>

            {/* Top Right Navigation */}
            {/* <div className="absolute top-6 right-6 flex items-center gap-6">
                <NotificationBell />
                <button
                    onClick={() => navigate('/settings')}
                    className="w-12 h-12 flex items-center justify-center rounded-full bg-white dark:bg-gray-800 shadow-md hover:shadow-lg"
                >
                    <Menu className="w-7 h-7 text-gray-600 dark:text-gray-300" />
                </button>
            </div> */}
        </div>
    );
};

export default AdminUsersPage;